from fastapi import HTTPException, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from datetime import datetime
import logging
from typing import Dict, Any
import base64
import json

logger = logging.getLogger(__name__)

# JWT Configuration
JWT_SECRET = "PRIVATEKEYINSTOREAPIFORJWTTOKENENCRYPTION"
JWT_ISSUER = "https://studgo.runasp.net"

class JWTBearer(HTTPBearer):
    def __init__(self, auto_error: bool = True):
        super(JWTBearer, self).__init__(auto_error=auto_error)

    async def __call__(self, request: Request):
        credentials: HTTPAuthorizationCredentials = await super(JWTBearer, self).__call__(request)
        if credentials:
            if credentials.scheme.lower() != "bearer":
                logger.warning(f"Invalid authentication scheme: {credentials.scheme}")
                raise HTTPException(status_code=403, detail="Invalid authentication scheme.")
            
            # Clean the token by removing any Bearer prefix
            token = credentials.credentials.strip()
            if token.lower().startswith("bearer "):
                token = token[7:].strip()
            
            payload = self.verify_jwt(token)
            if not payload:
                raise HTTPException(status_code=403, detail="Invalid token or expired token.")
            return payload
        else:
            raise HTTPException(status_code=403, detail="Invalid authorization code.")

    def verify_jwt(self, jwtoken: str) -> Dict[str, Any]:
        try:
            # First, try to decode the token parts to get better error information
            try:
                parts = jwtoken.split('.')
                if len(parts) != 3:
                    logger.warning("Invalid token format: not enough parts")
                    return None
                
                # Try to decode the header and payload for better error messages
                header = json.loads(base64.urlsafe_b64decode(parts[0] + '=' * (-len(parts[0]) % 4)).decode())
                payload = json.loads(base64.urlsafe_b64decode(parts[1] + '=' * (-len(parts[1]) % 4)).decode())
                
                logger.debug(f"Token header: {header}")
                logger.debug(f"Token payload: {payload}")
            except Exception as e:
                logger.warning(f"Error decoding token parts: {str(e)}")
                return None

            # Now try to verify the token
            payload = jwt.decode(
                jwtoken,
                JWT_SECRET,
                algorithms=["HS256"],
                issuer=JWT_ISSUER
            )
            
            # Check if token is expired
            if datetime.utcnow().timestamp() > payload.get("exp", 0):
                logger.warning("Token has expired")
                return None
                
            # Check if role is Student
            if payload.get("role") != "Student":
                logger.warning(f"Invalid role: {payload.get('role')}")
                return None
                
            return payload
            
        except jwt.ExpiredSignatureError:
            logger.warning("Token has expired")
            return None
        except jwt.InvalidTokenError as e:
            logger.warning(f"Invalid token: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Error verifying JWT: {str(e)}")
            return None 