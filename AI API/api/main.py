from fastapi import FastAPI, HTTPException, Request, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
import logging
import logging.config
from sentence_transformers import SentenceTransformer
import spacy
from chromadb import PersistentClient
from chromadb.config import Settings
from config import VECTOR_DB_CONFIG, LOGGING_CONFIG
from functools import lru_cache
from cv_processor import CVProcessor
from database import get_db_pool

from core import StudentAssistant
from auth import JWTBearer
from activity_manager import ActivityManager, ActivityConflictResponse

# Configure logging
logging.config.dictConfig(LOGGING_CONFIG)
logger = logging.getLogger(__name__)

# Singleton dependencies using lru_cache
@lru_cache()
def get_embedder() -> SentenceTransformer:
    logger.info("Initializing sentence transformer embedder")
    return SentenceTransformer(VECTOR_DB_CONFIG["embedding_model"])

@lru_cache()
def get_spacy_model() -> spacy.Language:
    logger.info("Initializing spaCy model")
    try:
        return spacy.load("en_core_web_sm")
    except OSError:
        logger.error("spaCy model not found. Please run 'python -m spacy download en_core_web_sm'")
        raise

@lru_cache()
def get_cv_processor(nlp: spacy.Language = Depends(get_spacy_model)) -> CVProcessor:
    logger.info("Initializing CV Processor")
    return CVProcessor(nlp=nlp)

# FastAPI dependency for ChromaDB client
async def get_chroma_client() -> PersistentClient:
    return PersistentClient(
        path=VECTOR_DB_CONFIG["path"],
        settings=Settings(anonymized_telemetry=False)
    )

# FastAPI dependency for StudentAssistant
async def get_assistant(
    embedder: SentenceTransformer = Depends(get_embedder),
    nlp: spacy.Language = Depends(get_spacy_model),
    chroma_client: PersistentClient = Depends(get_chroma_client),
    cv_processor: CVProcessor = Depends(get_cv_processor),
    db_pool = Depends(get_db_pool)
) -> StudentAssistant:
    return StudentAssistant(
        embedder=embedder,
        nlp=nlp,
        chroma_client=chroma_client,
        cv_processor=cv_processor,
        db_pool=db_pool
    )

# Initialize the sentence transformer model
sentence_model = SentenceTransformer('all-MiniLM-L6-v2')

def get_sentence_model() -> SentenceTransformer:
    """Get the sentence transformer model instance."""
    return sentence_model

# FastAPI dependency for ActivityManager
async def get_activity_manager(
    db_pool = Depends(get_db_pool),
    cv_processor: CVProcessor = Depends(get_cv_processor),
    model: SentenceTransformer = Depends(get_sentence_model)
) -> ActivityManager:
    """Get ActivityManager instance with dependencies."""
    return ActivityManager(db_pool, cv_processor, model)

# Initialize FastAPI app
app = FastAPI(
    title="Student Assistant API",
    description="API for the Student Assistant powered by Mistral AI",
    version="1.0.0"
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize JWT Bearer
security = JWTBearer()

# Standard response models
class ErrorResponse(BaseModel):
    errorDetails: str

class StudentRequest(BaseModel):
    message: str = Field(..., description="The message to process", min_length=1)

class StudentResponse(BaseModel):
    response: str
    student_info: Optional[Dict[str, Any]] = None

class StudentInfo(BaseModel):
    firstName: str
    lastName: str
    fieldOfStudy: str
    university: str
    faculty: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    cvUrl: Optional[str] = None

class ConversationInfo(BaseModel):
    student_id: int
    last_message: str
    last_response: str
    timestamp: str

class Activity(BaseModel):
    id: int
    title: str
    description: str
    start_date: str
    end_date: str

class ActivityConflict(BaseModel):
    activities: List[Activity]
    recommendation: str

class ActivityConflictResponse(BaseModel):
    conflicts: List[ActivityConflict]
    message: str

# Error handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"errorDetails": exc.detail}
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unexpected error: {str(exc)}")
    return JSONResponse(
        status_code=500,
        content={"errorDetails": "An unexpected error occurred"}
    )

@app.get("/")
async def root():
    """Root endpoint that returns API information"""
    return {
        "message": "Welcome to the Student Assistant API",
        "version": "1.0.0",
        "endpoints": {
            "/chat": {
                "POST": "Process student messages",
                "DELETE": "Clear chat history"
            },
            "/student": "Get student information",
            "/conversations": "Get conversation history"
        }
    }

@app.get("/student", 
         response_model=StudentInfo,
         responses={404: {"model": ErrorResponse}, 500: {"model": ErrorResponse}})
async def get_student_info(
    token_payload: Dict[str, Any] = Depends(security),
    assistant: StudentAssistant = Depends(get_assistant)
):
    """Get student information"""
    try:
        student_id = token_payload.get("EntityId")
        if not student_id:
            raise HTTPException(status_code=400, detail="Invalid student ID in token")
            
        student_info = assistant.memory_manager.get_student_info(student_id)
        if not student_info:
            raise HTTPException(status_code=404, detail=f"Student with ID {student_id} not found")
        return student_info
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting student info: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/conversations", 
         response_model=List[ConversationInfo],
         responses={404: {"model": ErrorResponse}, 500: {"model": ErrorResponse}})
async def get_conversation_history(
    token_payload: Dict[str, Any] = Depends(security),
    assistant: StudentAssistant = Depends(get_assistant)
):
    """Get conversation history for a student"""
    try:
        student_id = token_payload.get("EntityId")
        if not student_id:
            raise HTTPException(status_code=400, detail="Invalid student ID in token")
            
        # First check if student exists - using basic info without CV parsing
        student_info = assistant.memory_manager.get_basic_student_info(student_id)
        if not student_info:
            raise HTTPException(status_code=404, detail=f"Student with ID {student_id} not found")
            
        history = assistant.memory_manager.get_conversation_history(student_id)
        if not history:
            raise HTTPException(status_code=404, detail="No conversation history found")
        return history
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error getting conversation history: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat", 
          response_model=StudentResponse,
          responses={400: {"model": ErrorResponse}, 404: {"model": ErrorResponse}, 500: {"model": ErrorResponse}})
async def process_message(
    request: StudentRequest,
    token_payload: Dict[str, Any] = Depends(security),
    assistant: StudentAssistant = Depends(get_assistant)
):
    """Process a student message and return a response"""
    try:
        student_id = token_payload.get("EntityId")
        if not student_id:
            raise HTTPException(status_code=400, detail="Invalid student ID in token")
            
        # Get student information
        student_info = assistant.memory_manager.get_student_info(student_id)
        if not student_info:
            raise HTTPException(status_code=404, detail=f"Student with ID {student_id} not found")

        # Process the message
        response = assistant.process_user_input(
            user_input=request.message,
            student_id=student_id,
            student_info=student_info
        )

        return StudentResponse(
            response=response,
            student_info=student_info
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error processing message: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.delete("/chat", 
         responses={400: {"model": ErrorResponse}, 404: {"model": ErrorResponse}, 500: {"model": ErrorResponse}})
async def clear_chat_history(
    token_payload: Dict[str, Any] = Depends(security),
    assistant: StudentAssistant = Depends(get_assistant)
):
    """Clear all chat history for a student"""
    try:
        student_id = token_payload.get("EntityId")
        if not student_id:
            raise HTTPException(status_code=400, detail="Invalid student ID in token")
            
        # First check if student exists - using basic info without CV parsing
        student_info = assistant.memory_manager.get_basic_student_info(student_id)
        if not student_info:
            raise HTTPException(status_code=404, detail=f"Student with ID {student_id} not found")
            
        assistant.memory_manager.clear_chat_history(student_id)
        return {"message": "Chat history cleared successfully"}
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error clearing chat history: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/activities/conflicts", 
         response_model=ActivityConflictResponse,
         responses={400: {"model": ErrorResponse}, 404: {"model": ErrorResponse}, 500: {"model": ErrorResponse}})
async def check_activity_conflicts(
    token_payload: Dict[str, Any] = Depends(security),
    assistant: StudentAssistant = Depends(get_assistant),
    activity_manager: ActivityManager = Depends(get_activity_manager)
):
    """Check for conflicts in student's activities and provide recommendations based on CV"""
    try:
        student_id = token_payload.get("EntityId")
        if not student_id:
            raise HTTPException(status_code=400, detail="Invalid student ID in token")
            
        # Get student information including CV
        student_info = assistant.memory_manager.get_student_info(student_id, parse_cv=True)
        if not student_info:
            raise HTTPException(status_code=404, detail=f"Student with ID {student_id} not found")

        # Process conflicts using ActivityManager
        return activity_manager.process_conflicts(student_id, student_info)

    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error checking activity conflicts: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))