import pyodbc
from chromadb import PersistentClient
from chromadb.config import Settings
from sentence_transformers import SentenceTransformer
import hashlib
import time
from datetime import datetime
from typing import List, Dict

# Initialize embedding model
embedder = SentenceTransformer('all-MiniLM-L6-v2')

# Initialize persistent ChromaDB client
chroma_client = PersistentClient(
    path="./chroma_db",
    settings=Settings(anonymized_telemetry=False)
)

# Database connection
def connect_db() -> pyodbc.Connection:
    return pyodbc.connect(
        "DRIVER={ODBC Driver 17 for SQL Server};"
        "SERVER=db16870.public.databaseasp.net;"
        "DATABASE=db16870;"
        "UID=db16870;"
        "PWD=K+r5-g2E8Fj?;"
        "Encrypt=yes;"
        "TrustServerCertificate=yes;"
        "MultipleActiveResultSets=True"
    )

# Date handling utilities
def format_date(value):
    """Convert datetime values to ISO format strings"""
    if isinstance(value, datetime):
        return value.isoformat()
    return value

def clean_metadata_value(value):
    """Convert None values to empty strings and ensure all values are of accepted types"""
    if value is None:
        return ""
    if isinstance(value, (str, int, float, bool)):
        return value
    return str(value)

def generate_hash(row_dict: Dict, date_columns: List[str]) -> str:
    """Generate hash with proper date formatting"""
    sorted_data = []
    for key in sorted(row_dict.keys()):
        value = row_dict[key]
        if key in date_columns:
            value = format_date(value)
        sorted_data.append(f"{key}={str(value).strip()}")
    return hashlib.md5("|".join(sorted_data).encode('utf-8')).hexdigest()

# Sync logic with date handling
def sync_table(cursor: pyodbc.Cursor, config: Dict):
    collection = chroma_client.get_or_create_collection(name=config["name"])

    # Get date columns for this table
    date_columns = config["date_columns"]

    # Fetch existing Chroma IDs
    existing_ids = set(collection.get(ids=None)["ids"])

    # Execute SQL query
    cursor.execute(config["query"])
    rows = cursor.fetchall()
    col_names = [col[0] for col in cursor.description]

    current_ids = set()
    to_add = []

    for row in rows:
        row_dict = {}
        for col_name, value in zip(col_names, row):
            if col_name in date_columns:
                row_dict[col_name] = format_date(value)
            else:
                row_dict[col_name] = value

        unique_id = f"{config['name']}_{generate_hash(row_dict, date_columns)}"
        current_ids.add(unique_id)

        if unique_id not in existing_ids:
            # Combine text fields
            text_parts = []
            for field in config["text_fields"]:
                value = row_dict.get(field, '')
                if field in date_columns:
                    value = format_date(value)
                text_parts.append(str(value))

            combined_text = " | ".join(text_parts)
            embedding = embedder.encode(combined_text)
            
            # Clean metadata values
            cleaned_metadata = {k: clean_metadata_value(v) for k, v in row_dict.items()}
            to_add.append((unique_id, combined_text, embedding, cleaned_metadata))

    # Add new items
    if to_add:
        collection.add(
            ids=[id for id, _, _, _ in to_add],
            documents=[doc for _, doc, _, _ in to_add],
            embeddings=[emb.tolist() for _, _, emb, _ in to_add],
            metadatas=[meta for _, _, _, meta in to_add]
        )

    # Remove deleted items
    to_delete = list(existing_ids - current_ids)
    if to_delete:
        collection.delete(ids=to_delete)

    # Persist changes to disk
    #collection.persist()

    print(f"✅ Synced {config['name']}: +{len(to_add)}/-{len(to_delete)}")

# Table configurations with date columns
TABLES = [
    {
        "name": "Activities",
        "query": """SELECT Title, Description, Address, StartDate, EndDate, 
                    DeadlineDate, IsOpened, NumberOfSeats, ActivityType, 
                    StudentActivityId, ActivityCategory, Latitude, Longitude 
                    FROM [db16870].[dbo].[Activities]""",
        "text_fields": ["Title", "Description", "Address", "ActivityType", "ActivityCategory"],
        "date_columns": ["StartDate", "EndDate", "DeadlineDate"],
        "id_keys": ["Title", "StartDate", "Address"]
    },
    {
        "name": "Organization",
        "query": """SELECT Name, Biography, FoundingDate, Address, JoinFormUrl,
                    WebsiteUrl, ContactEmail, ContactPhoneNumber, University,
                    Faculty, Latitude, Longitude 
                    FROM [db16870].[dbo].[StudentActivities]""",
        "text_fields": ["Name", "Biography", "Address", "University", "Faculty"],
        "date_columns": ["FoundingDate"],
        "id_keys": ["Name", "Address", "University"]
    },
    {
        "name": "InternShips",
        "query": """SELECT Id, Address, JobUrl, Workplace, CareerLevel,
                    Category, Company, Country, JobDescription, JobRequirements,
                    JobTitle, JobType, YearsOfExperience 
                    FROM [db16870].[dbo].[InternShips]""",
        "text_fields": ["JobTitle", "JobDescription", "JobRequirements", "Company", "Workplace", "Category"],
        "date_columns": [],
        "id_keys": ["Id"]
    }
]

def main_loop():
    while True:
        try:
            conn = connect_db()
            cursor = conn.cursor()

            for table_config in TABLES:
                sync_table(cursor, table_config)

            cursor.close()
            conn.close()

            print("⏳ Next sync in 60 minutes...")
            time.sleep(3600)  # 60 minutes

        except pyodbc.Error as e:
            print(f"⚠️ Database error: {str(e)}")
            time.sleep(300)  # Retry in 5 minutes

        except KeyboardInterrupt:
            print("\n🛑 Sync stopped by user")
            break

        except Exception as e:
            print(f"🚨 Critical error: {str(e)}")
            raise

if __name__ == "__main__":
    main_loop()


