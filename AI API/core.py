import json
import requests
import logging
import logging.config
from typing import Dict
import math
from sentence_transformers import SentenceTransformer
import spacy
from chromadb import PersistentClient

from config import (
    MISTRAL_CONFIG,
    VECTOR_DB_CONFIG,
    SYSTEM_PROMPTS,
    LOGGING_CONFIG
)
from memory_manager import MemoryManager
from cv_processor import CVProcessor
from database import DatabaseConnectionPool

# Configure logging
logging.config.dictConfig(LOGGING_CONFIG)
logger = logging.getLogger(__name__)

class StudentAssistant:
    def __init__(
        self,
        embedder: SentenceTransformer,
        nlp: spacy.Language,
        chroma_client: PersistentClient,
        cv_processor: CVProcessor,
        db_pool: DatabaseConnectionPool
    ):
        # Use the provided dependencies (which should be singletons from FastAPI)
        self.embedder = embedder
        self.nlp = nlp
        self.chroma_client = chroma_client
        self.cv_processor = cv_processor
        self.db_pool = db_pool
        
        # Initialize memory manager with the singleton dependencies
        self.memory_manager = MemoryManager(
            embedder=self.embedder,
            cv_processor=self.cv_processor,
            db_pool=self.db_pool
        )
        
        logger.info("Student Assistant initialized successfully")

    def call_mistral(self, prompt: str) -> str:
        """Call the Mistral AI API with a given prompt."""
        try:
            headers = {
                "Authorization": f"Bearer {MISTRAL_CONFIG['api_key']}",
                "Content-Type": "application/json"
            }
            
            data = {
                "model": MISTRAL_CONFIG["model"],
                "messages": [{"role": "user", "content": prompt}],
                "temperature": MISTRAL_CONFIG["temperature"],
                "max_tokens": MISTRAL_CONFIG["max_tokens"],
                "top_p": MISTRAL_CONFIG["top_p"],
                "stream": MISTRAL_CONFIG["stream"]
            }

            response_text = ""
            
            if MISTRAL_CONFIG["stream"]:
                # Streaming response
                response = requests.post(
                    "https://api.mistral.ai/v1/chat/completions",
                    headers=headers,
                    json=data,
                    stream=True
                )
                response.raise_for_status()

                for line in response.iter_lines():
                    if line:
                        try:
                            line_text = line.decode('utf-8')
                            if line_text.startswith('data: '):
                                line_text = line_text[6:]  # Remove 'data: ' prefix
                                if line_text.strip() == '[DONE]':
                                    break
                                
                                chunk_data = json.loads(line_text)
                                if 'choices' in chunk_data and len(chunk_data['choices']) > 0:
                                    content = chunk_data['choices'][0].get('delta', {}).get('content', '')
                                    if content:
                                        print(content, end='', flush=True)
                                        response_text += content
                        except json.JSONDecodeError:
                            logger.warning(f"Failed to parse JSON from line: {line_text}")
                            continue
            else:
                # Non-streaming response
                response = requests.post(
                    "https://api.mistral.ai/v1/chat/completions",
                    headers=headers,
                    json=data
                )
                response.raise_for_status()
                response_data = response.json()
                
                if 'choices' in response_data and len(response_data['choices']) > 0:
                    content = response_data['choices'][0].get('message', {}).get('content', '')
                    if content:
                        print(content, end='', flush=True)
                        response_text = content
            
            print()  # Add newline after response
            return response_text

        except requests.exceptions.RequestException as e:
            logger.error(f"Error calling Mistral AI: {str(e)}")
            raise

    def query_vector_database(self, user_query: str, student_info: Dict) -> str:
        """Query all collections in the vector DB and return a context string with location-based filtering."""
        try:
            query_embedding = self.embedder.encode(user_query).tolist()
            all_results = []

            for collection_name in VECTOR_DB_CONFIG["collections"]:
                collection = self.chroma_client.get_collection(name=collection_name)
                results = collection.query(
                    query_embeddings=[query_embedding],
                    n_results=VECTOR_DB_CONFIG["top_k"],
                    include=["documents", "metadatas"]
                )
                
                for doc, meta in zip(results["documents"][0], results["metadatas"][0]):
                    # Calculate distance if location data is available
                    if 'Latitude' in meta and 'Longitude' in meta:
                        distance = self._calculate_distance(
                            student_info['latitude'],
                            student_info['longitude'],
                            meta['Latitude'],
                            meta['Longitude']
                        )
                        meta['distance_km'] = distance
                    
                    all_results.append((collection_name, doc, meta))

            if not all_results:
                return ""

            # Sort results by distance if available
            all_results.sort(key=lambda x: x[2].get('distance_km', float('inf')))

            # Format context
            context = "Database results:\n"
            for idx, (collection, doc, meta) in enumerate(all_results, 1):
                context += f"\n{idx}. From {collection}:\n"
                context += f"Text: {doc}\n"
                if 'distance_km' in meta:
                    context += f"Distance: {meta['distance_km']:.2f} km\n"
                context += f"Metadata: {json.dumps(meta, indent=2)}\n"
            return context

        except Exception as e:
            logger.error(f"Error querying vector database: {str(e)}")
            return ""

    def _calculate_distance(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculate distance between two points using the Haversine formula."""
        # Convert to radians
        lat1, lon1, lat2, lon2 = map(math.radians, [lat1, lon1, lat2, lon2])
        
        # Haversine formula
        dlat = lat2 - lat1
        dlon = lon2 - lon1
        a = math.sin(dlat/2)**2 + math.cos(lat1) * math.cos(lat2) * math.sin(dlon/2)**2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
        R = 6371  # Earth's radius in kilometers
        return R * c

    def process_user_input(self, user_input: str, student_id: int, student_info: Dict, user_id: str = "default") -> str:
        """Process user input and return a response.
        
        Args:
            user_input: The user's question or input
            student_id: The ID of the student
            student_info: Information about the student
            user_id: Optional user identifier for rate limiting
            
        Returns:
            The assistant's response
        """
        try:
            # Get context from vector database with location-based filtering
            context = self.query_vector_database(user_input, student_info)
            
            # Get recent context (limited to last 2 exchanges)
            recent_context = self.memory_manager.get_recent_context(student_id)
            
            # Get semantic context (focused on current query)
            semantic_context = self.memory_manager.get_semantic_context(student_id, user_input)

            # Construct prompt with enhanced student context
            prompt = (
                f"{SYSTEM_PROMPTS['base']}\n\n"
                f"Student Information:\n"
                f"Name: {student_info['firstName']} {student_info['lastName']}\n"
                f"Field of Study: {student_info['fieldOfStudy']}\n"
                f"University: {student_info['university']}\n"
                f"Faculty: {student_info['faculty']}\n"
                f"Location: ({student_info['latitude']}, {student_info['longitude']})\n"
            )

            # Add CV information if available
            if student_info.get('cvContent'):
                cv_data = student_info['cvContent']
                prompt += "\nCV Information:\n"
                if cv_data.get('raw_text'):
                    prompt += f"CV Content:\n{cv_data['raw_text']}\n"

            # Add current query with clear emphasis
            prompt += (
                f"\nCurrent Query:\n"
                f"'{user_input}'\n\n"
            )

            # Add recent context if available
            if recent_context:
                prompt += (
                    f"Recent Conversation:\n"
                    f"{recent_context}\n\n"
                )

            # Add semantic context if available
            if semantic_context:
                prompt += (
                    f"Relevant Previous Exchanges:\n"
                    f"{semantic_context}\n\n"
                )

            # Add additional context if available
            if context:
                prompt += (
                    f"Database Results:\n"
                    f"{context}\n\n"
                )

            # Add instructions for response format
            prompt += (
                "Response Guidelines:\n"
                "1. Analyze the user's query to determine if they are requesting detailed information or a quick answer\n"
                "2. Use the provided context to give relevant and personalized responses\n"
                "3. If the query is about activities or events, consider the student's location and interests\n"
                "4. If the query is about academic matters, consider the student's field of study and faculty\n"
                "5. If the query is about career or skills, consider the student's CV and experience\n"
                "6. Keep responses concise but informative\n"
                "7. If you're unsure about something, acknowledge the limitation and suggest alternative approaches\n"
            )

            # Get response from Mistral AI
            response = self.call_mistral(prompt)

            # Store the exchange in memory
            self.memory_manager.add_exchange(
                student_id=student_id,
                user_input=user_input,
                assistant_response=response,
                context=context
            )

            return response

        except Exception as e:
            logger.error(f"Error processing user input: {str(e)}")
            raise

