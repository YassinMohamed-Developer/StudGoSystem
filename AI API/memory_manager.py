from typing import List, Dict, Optional, Any
from datetime import datetime
import logging
import numpy as np
from config import VECTOR_DB_CONFIG, LOGGING_CONFIG
from cv_processor import CVProcessor
from database import DatabaseConnectionPool
from sentence_transformers import SentenceTransformer
from chromadb import PersistentClient
from chromadb.config import Settings

# Configure logging
logging.config.dictConfig(LOGGING_CONFIG)
logger = logging.getLogger(__name__)

class MemoryManager:
    def __init__(
        self,
        embedder: SentenceTransformer,
        cv_processor: CVProcessor,
        db_pool: DatabaseConnectionPool
    ):
        # Use the provided dependencies (which should be singletons from FastAPI)
        self.embedder = embedder
        self.cv_processor = cv_processor
        self.db_pool = db_pool
        
        # Initialize ChromaDB client
        self.chroma_client = PersistentClient(
            path=VECTOR_DB_CONFIG["path"],
            settings=Settings(anonymized_telemetry=False)
        )
        
        # Initialize collections
        self.conversation_collection = self.chroma_client.get_or_create_collection(
            name="conversations",
            metadata={"description": "Stores conversation history"}
        )
        
        self.cv_collection = self.chroma_client.get_or_create_collection(
            name="cvs",
            metadata={"description": "Stores CV information"}
        )
        
        self.embedding_cache: Dict[str, np.ndarray] = {}
        self.conversation_history = {}
        self.student_info = {}
        
        logger.info("Memory Manager initialized successfully")

    def add_exchange(self, student_id: int, user_input: str, assistant_response: str, 
                    context: Optional[str] = None, is_important: bool = False) -> None:
        """Add a conversation exchange to the database."""
        try:
            with self.db_pool.get_cursor() as cursor:
                current_time = datetime.now()
                
                # Determine if the exchange is important based on content
                is_important = self._is_important_exchange(user_input, assistant_response)
                
                # Update current chat
                cursor.execute("""
                    IF EXISTS (SELECT 1 FROM StudentChats WHERE StudentId = %s)
                        UPDATE StudentChats 
                        SET LastMessage = %s, LastResponse = %s, 
                            ContextSummary = %s, IsImportant = %s, LastUpdated = %s
                        WHERE StudentId = %s
                    ELSE
                        INSERT INTO StudentChats 
                        (StudentId, LastMessage, LastResponse, ContextSummary, IsImportant, LastUpdated)
                        VALUES (%s, %s, %s, %s, %s, %s)
                """, (student_id, user_input, assistant_response, context, is_important, current_time, student_id,
                      student_id, user_input, assistant_response, context, is_important, current_time))
                
                # Add to history
                cursor.execute("""
                    INSERT INTO ChatHistories 
                    (StudentId, MessageType, MessageContent, Timestamp, IsImportant)
                    VALUES (%s, 'user', %s, %s, %s),
                           (%s, 'assistant', %s, %s, %s)
                """, (student_id, user_input, current_time, is_important,
                      student_id, assistant_response, current_time, is_important))
                
                logger.info(f"Added conversation exchange for student {student_id}")
                
        except Exception as e:
            logger.error(f"Error adding conversation exchange: {str(e)}")
            raise

    def _is_important_exchange(self, user_input: str, assistant_response: str) -> bool:
        """Determine if an exchange is important based on its content.
        
        Args:
            user_input: The user's message
            assistant_response: The assistant's response
            
        Returns:
            True if the exchange is important, False otherwise
        """
        # Keywords that indicate important information
        important_keywords = {
            'preference', 'like', 'dislike', 'favorite', 'hate',
            'important', 'crucial', 'critical', 'essential',
            'remember', 'remind', 'note', 'keep in mind',
            'always', 'never', 'must', 'should', 'need'
        }
        
        # Check if the exchange contains important keywords
        combined_text = (user_input + " " + assistant_response).lower()
        return any(keyword in combined_text for keyword in important_keywords)

    def get_basic_student_info(self, student_id: int) -> Dict:
        """Get basic student information without parsing CV."""
        try:
            with self.db_pool.get_cursor() as cursor:
                cursor.execute("""
                    SELECT FirstName, LastName, FieldOfStudy, University, Faculty,
                           Latitude, Longitude, CVUrl
                    FROM Students
                    WHERE Id = %s
                """, (student_id,))
                
                row = cursor.fetchone()
                if row:
                    return {
                        'firstName': row[0],
                        'lastName': row[1],
                        'fieldOfStudy': row[2],
                        'university': row[3],
                        'faculty': row[4],
                        'latitude': row[5],
                        'longitude': row[6],
                        'cvUrl': row[7]
                    }
                return {}
        except Exception as e:
            logger.error(f"Error getting basic student info: {str(e)}")
            return {}

    def get_recent_context(self, student_id: int, num_exchanges: int = 2) -> str:
        """Get recent conversation context for a specific student.
        
        Args:
            student_id: The ID of the student
            num_exchanges: Number of recent exchanges to include
            
        Returns:
            Formatted conversation context
        """
        try:
            with self.db_pool.get_cursor() as cursor:
                cursor.execute("""
                    SELECT TOP (%s) 
                        MessageType,
                        MessageContent,
                        Timestamp,
                        IsImportant
                    FROM ChatHistories
                    WHERE StudentId = %s
                    ORDER BY Timestamp DESC
                """, (num_exchanges * 2, student_id))
                rows = cursor.fetchall()
                
                if not rows:
                    return ""
                
                # Format the conversation in a more natural way
                context = []
                current_exchange = []
                
                for row in reversed(rows):  # Process oldest first
                    message_type, content, _, is_important = row
                    
                    # Only include important exchanges or the most recent ones
                    if is_important or len(context) < num_exchanges * 2:
                        if message_type == 'user':
                            if current_exchange:
                                context.append(f"User: {current_exchange[0]}")
                                context.append(f"Assistant: {current_exchange[1]}")
                            current_exchange = [content]
                        elif message_type == 'assistant' and current_exchange:
                            current_exchange.append(content)
                
                # Add the last exchange if it exists
                if current_exchange and len(current_exchange) == 2:
                    context.append(f"User: {current_exchange[0]}")
                    context.append(f"Assistant: {current_exchange[1]}")
                
                return "\n".join(context) if context else ""
                
        except Exception as e:
            logger.error(f"Error getting recent context: {str(e)}")
            return ""

    def get_semantic_context(self, student_id: int, query: str, num_results: int = 2) -> str:
        """Get semantically relevant context for a specific student.
        
        Args:
            student_id: The ID of the student
            query: The current query
            num_results: Number of relevant results to return
            
        Returns:
            Formatted semantic context
        """
        try:
            with self.db_pool.get_cursor() as cursor:
                cursor.execute("""
                    SELECT TOP (%s) 
                        MessageType,
                        MessageContent,
                        Timestamp,
                        IsImportant
                    FROM ChatHistories
                    WHERE StudentId = %s AND IsImportant = 1
                    ORDER BY Timestamp DESC
                """, (num_results * 2, student_id))
                rows = cursor.fetchall()
                
                if not rows:
                    return ""
                
                # Format relevant context
                context = []
                current_exchange = []
                
                for row in reversed(rows):
                    message_type, content, _, _ = row
                    
                    if message_type == 'user':
                        if current_exchange:
                            context.append(f"Relevant previous exchange:")
                            context.append(f"User: {current_exchange[0]}")
                            context.append(f"Assistant: {current_exchange[1]}")
                            context.append("")  # Add spacing between exchanges
                        current_exchange = [content]
                    elif message_type == 'assistant' and current_exchange:
                        current_exchange.append(content)
                
                # Add the last exchange if it exists
                if current_exchange and len(current_exchange) == 2:
                    context.append(f"Relevant previous exchange:")
                    context.append(f"User: {current_exchange[0]}")
                    context.append(f"Assistant: {current_exchange[1]}")
                
                return "\n".join(context) if context else ""
                
        except Exception as e:
            logger.error(f"Error getting semantic context: {str(e)}")
            return ""

    def get_student_info(self, student_id: int, parse_cv: bool = True) -> Dict:
        """Get student information from the database.
        
        Args:
            student_id: The ID of the student
            parse_cv: Whether to parse and include CV content
            
        Returns:
            Dictionary containing student information
        """
        student_info = self.get_basic_student_info(student_id)
        
        if student_info and parse_cv and student_info.get('cvUrl'):
            try:
                cv_content = self.cv_processor.parse_cv(student_info['cvUrl'])
                student_info['cvContent'] = cv_content
            except Exception as e:
                logger.warning(f"Could not parse CV: {str(e)}")
                student_info['cvContent'] = None
        
        return student_info

    def get_conversation_history(self, student_id: int) -> List[Dict[str, Any]]:
        """Get conversation history for a student."""
        try:
            with self.db_pool.get_cursor() as cursor:
                cursor.execute("""
                    SELECT TOP 20 
                        MessageType,
                        MessageContent,
                        Timestamp
                    FROM ChatHistories
                    WHERE StudentId = %s
                    ORDER BY Timestamp DESC
                """, (student_id,))
                
                rows = cursor.fetchall()
                
                # Format the conversation history
                history = []
                current_exchange = {}
                
                # Process messages in reverse order to pair them correctly
                for row in reversed(rows):
                    message_type, content, timestamp = row
                    
                    if message_type == 'assistant':
                        current_exchange = {
                            'student_id': student_id,
                            'last_response': content,
                            'timestamp': timestamp.strftime('%Y-%m-%d %H:%M:%S')
                        }
                    elif message_type == 'user' and current_exchange:
                        current_exchange['last_message'] = content
                        history.append(current_exchange)
                        current_exchange = {}
                
                # If there's an unpaired assistant message, add it with empty user message
                if current_exchange and 'last_response' in current_exchange:
                    current_exchange['last_message'] = ""
                    history.append(current_exchange)
                
                return history
                
        except Exception as e:
            logger.error(f"Error getting conversation history: {str(e)}")
            raise

    def clear_chat_history(self, student_id: int) -> None:
        """Clear all chat history for a student."""
        try:
            with self.db_pool.get_cursor() as cursor:
                # Delete from ChatHistories
                cursor.execute("""
                    DELETE FROM ChatHistories
                    WHERE StudentId = %s
                """, (student_id,))
                
                # Delete from StudentChats
                cursor.execute("""
                    DELETE FROM StudentChats
                    WHERE StudentId = %s
                """, (student_id,))
                
                logger.info(f"Cleared chat history for student {student_id}")
                
        except Exception as e:
            logger.error(f"Error clearing chat history: {str(e)}")
            raise

    def __del__(self):
        """Clean up resources when object is destroyed."""
        pass 