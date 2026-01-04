"""
Authentication dependencies for FastAPI routes.
Validates JWT tokens from Supabase and extracts user information.
"""
import logging
from typing import Optional
from fastapi import Depends, HTTPException, Header, status
from pydantic import BaseModel

from app.config import get_settings

logger = logging.getLogger(__name__)


class AuthenticatedUser(BaseModel):
    """User information extracted from validated JWT token."""
    user_id: str
    email: Optional[str] = None
    profile: Optional[dict] = None


async def get_auth_token(
    authorization: Optional[str] = Header(None, alias="Authorization")
) -> str:
    """
    Extract JWT token from Authorization header.
    
    Expected format: "Bearer <token>"
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Check if it's a Bearer token
    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format. Expected: 'Bearer <token>'",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    token = parts[1]
    if not token or len(token) < 20:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token format",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    return token


def verify_token_with_supabase(token: str) -> AuthenticatedUser:
    """
    Verify JWT token with Supabase and return user information.
    
    Args:
        token: JWT token string
        
    Returns:
        AuthenticatedUser with user_id, email, and profile
        
    Raises:
        HTTPException: If token is invalid or verification fails
    """
    settings = get_settings()
    
    # If Supabase is not configured, raise error (we need it for production)
    if not settings.supabase_url or not settings.supabase_key:
        logger.warning("Supabase not configured - authentication cannot be verified")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication service not configured. Please configure Supabase credentials.",
        )
    
    try:
        from supabase import create_client, Client
        
        supabase: Client = create_client(settings.supabase_url, settings.supabase_key)
        
        # Verify token by getting user
        user_response = supabase.auth.get_user(token)
        
        if not user_response or not user_response.user:
            logger.warning(f"Token verification failed: invalid or expired token")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        user = user_response.user
        
        # Get user profile from database (optional - continue if not found)
        profile = None
        try:
            profile_response = supabase.table("Profiles").select("*").eq("id", user.id).execute()
            if profile_response.data and len(profile_response.data) > 0:
                profile = profile_response.data[0]
        except Exception as profile_error:
            logger.warning(f"Could not fetch profile for user {user.id}: {profile_error}")
            # Continue without profile - not critical
        
        return AuthenticatedUser(
            user_id=user.id,
            email=user.email,
            profile=profile,
        )
        
    except ImportError:
        logger.error("Supabase Python client not installed. Install with: pip install supabase")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication service unavailable. Supabase client not installed.",
        )
    except HTTPException:
        # Re-raise HTTP exceptions (like 401)
        raise
    except Exception as supabase_error:
        logger.error(f"Supabase verification error: {supabase_error}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Authentication verification failed: {str(supabase_error)}",
        )


async def get_current_user(
    token: str = Depends(get_auth_token)
) -> AuthenticatedUser:
    """
    FastAPI dependency that validates JWT token and returns authenticated user.
    
    Use this dependency on routes that require authentication:
    
    Example:
        @router.post("/protected-route")
        async def protected_route(
            user: AuthenticatedUser = Depends(get_current_user),
            payload: MyRequest = None
        ):
            # user.user_id, user.email, user.profile are available
            ...
    """
    return verify_token_with_supabase(token)


async def get_optional_user(
    authorization: Optional[str] = Header(None, alias="Authorization")
) -> Optional[AuthenticatedUser]:
    """
    FastAPI dependency that optionally validates JWT token.
    
    Returns None if no token is provided, or AuthenticatedUser if valid token is present.
    Use this for routes that work both with and without authentication.
    
    Example:
        @router.post("/optional-auth-route")
        async def optional_route(
            user: Optional[AuthenticatedUser] = Depends(get_optional_user)
        ):
            if user:
                # User is authenticated
                ...
            else:
                # User is not authenticated
                ...
    """
    if not authorization:
        return None
    
    try:
        token = await get_auth_token(authorization)
        return verify_token_with_supabase(token)
    except HTTPException:
        # If token is invalid, return None (optional auth)
        return None

