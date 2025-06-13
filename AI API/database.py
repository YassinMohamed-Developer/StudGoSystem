import pymssql
import logging
import threading
from contextlib import contextmanager
from config import DB_CONFIG
from functools import lru_cache

logger = logging.getLogger(__name__)

class DatabaseConnectionPool:
    def __init__(self, max_connections=5):
        self.max_connections = max_connections
        self._pool = []
        self._lock = threading.Lock()
        self._active_connections = 0

    def _create_connection(self):
        """Create a new database connection."""
        try:
            return pymssql.connect(
                server=DB_CONFIG['server'],
                user=DB_CONFIG['username'],
                password=DB_CONFIG['password'],
                database=DB_CONFIG['database']
            )
        except Exception as e:
            logger.error(f"Database connection error: {str(e)}")
            raise

    @contextmanager
    def get_connection(self):
        """Get a connection from the pool."""
        conn = None
        try:
            with self._lock:
                if self._pool:
                    conn = self._pool.pop()
                elif self._active_connections < self.max_connections:
                    conn = self._create_connection()
                    self._active_connections += 1
                else:
                    raise Exception("Maximum number of connections reached")
            
            yield conn
        except Exception as e:
            logger.error(f"Error getting connection from pool: {str(e)}")
            raise
        finally:
            if conn:
                with self._lock:
                    self._pool.append(conn)

    @contextmanager
    def get_cursor(self):
        """Get a database cursor with proper connection management."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            try:
                yield cursor
                conn.commit()
            except Exception as e:
                conn.rollback()
                logger.error(f"Database operation failed: {str(e)}")
                raise
            finally:
                cursor.close()

# Create a global connection pool instance
connection_pool = DatabaseConnectionPool()

# FastAPI dependency for database connection pool
@lru_cache()
def get_db_pool() -> DatabaseConnectionPool:
    """Get the database connection pool singleton."""
    return connection_pool 