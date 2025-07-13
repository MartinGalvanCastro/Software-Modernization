import logging
from fastapi import Security, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import jwt
from jwt import PyJWKClient
import time

from config import settings


logger = logging.getLogger("product_service.auth")


bearer_scheme = HTTPBearer()

_jwk_client: PyJWKClient | None = None
_last_fetch = 0

def get_jwk_client() -> PyJWKClient:
    global _jwk_client, _last_fetch
    if not _jwk_client or time.time() - _last_fetch > 3600:
        _jwk_client = PyJWKClient(settings.cognito_jwks_url)
        _last_fetch = time.time()
    return _jwk_client

async def get_current_user(
    creds: HTTPAuthorizationCredentials = Security(bearer_scheme)
):
    """
    This now *is* a FastAPI Security dependency.
    """
    token = creds.credentials
    try:
        key = get_jwk_client().get_signing_key_from_jwt(token).key
        payload = jwt.decode(
            token,
            key,
            algorithms=["RS256"],
            audience=settings.COGNITO_APP_CLIENT_ID,
            issuer=settings.cognito_issuer,
        )
    except Exception as e:
        logger.warning("Invalid or expired token: %s", e)
        raise HTTPException(
            status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload