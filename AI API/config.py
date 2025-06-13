from typing import Dict, List
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Base paths
BASE_DIR = Path(__file__).parent
DATA_DIR = BASE_DIR / "data"
LOGS_DIR = BASE_DIR / "logs"
MEMORY_DIR = BASE_DIR / "memory"

# Create necessary directories
for dir_path in [DATA_DIR, LOGS_DIR, MEMORY_DIR]:
    dir_path.mkdir(exist_ok=True)

# Mistral AI Configuration
MISTRAL_CONFIG = {
    "api_key": "XMfCHVNHiIN5a7biXMY3kyNRIYEwRLjF",  # Set your API key in environment variables
    "model": "mistral-medium",  # or "mistral-small", "mistral-large"
    "temperature": 0.1,
    "max_tokens": 2000,
    "top_p": 0.95,
    "stream": True
}

# Vector Database Configuration
VECTOR_DB_CONFIG = {
    "path": str(BASE_DIR / "chroma_db"),
    "embedding_model": "all-MiniLM-L6-v2",
    "collections": ["Activities", "Organization", "InternShips"],
    "top_k": 3,
    "embedding_dimension": 384
}



# Database Configuration
DB_CONFIG = {
    "driver": os.getenv("DB_DRIVER", "{ODBC Driver 17 for SQL Server}"),
    "server": os.getenv("DB_SERVER", "localhost"),
    "database": os.getenv("DB_NAME", "YourDatabaseName"),
    "username": os.getenv("DB_USERNAME", "sa"),
    "password": os.getenv("DB_PASSWORD", "YourPassword"),
    "encrypt": "yes",
    "trust_server_certificate": "yes",
    "multiple_active_result_sets": "True"
}

# Logging Configuration
LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "standard": {
            "format": "%(asctime)s [%(levelname)s] %(name)s: %(message)s"
        },
    },
    "handlers": {
        "file": {
            "class": "logging.FileHandler",
            "filename": str(LOGS_DIR / "chatbot.log"),
            "formatter": "standard",
        },
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "standard",
        },
    },
    "loggers": {
        "": {
            "handlers": ["console", "file"],
            "level": "INFO",
            "propagate": True
        }
    }
}




# Enhanced System Prompts
SYSTEM_PROMPTS = {
    "base": """You are a friendly and helpful student assistant chatbot powered by Mistral AI. Your goal is to help students with their queries about activities, organizations, and internships.
    Always be polite, professional, and concise in your responses.
    By default, provide brief, to-the-point answers (1-3 sentences) that focus on the most essential information.
    If a student asks for more details or elaboration, then provide comprehensive information.
    If you're unsure about something, acknowledge it and suggest alternative questions.
    Use the provided context to answer questions, but don't make assumptions beyond that information.
    When appropriate, reference previous conversation context to provide more personalized responses.""",
    
    "error": """I apologize, but I encountered an error while processing your request. 
    Please try rephrasing your question or try again later. 
    If the problem persists, contact the system administrator.""",
    
    "context_missing": """I don't have enough information in my database to answer your question accurately.
    Could you please try rephrasing your question or ask about something else?
    I can help you with information about:
    - Activities and events
    - Student organizations
    - Internship opportunities""",
    
    "memory_summary": """Based on our conversation history, I understand that you're interested in {topics}.
    Let me help you with that while considering your previous questions and preferences."""
} 