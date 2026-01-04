import logging
from typing import Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.config import get_settings

logger = logging.getLogger(__name__)
router = APIRouter()


class VerifyAuthRequest(BaseModel):
    token: str


class VerifyAuthResponse(BaseModel):
    authenticated: bool
    profile: Optional[dict] = None
    message: Optional[str] = None


@router.post("/verify-auth", response_model=VerifyAuthResponse)
async def verify_auth(payload: VerifyAuthRequest):
    """
    Verify user authentication token and return profile information.
    Step 2 of calendar generation flow - backend authentication verification.
    """
    try:
        settings = get_settings()
        
        # If Supabase is not configured, do basic token validation
        if not settings.supabase_url or not settings.supabase_key:
            logger.warning("Supabase not configured, performing basic token validation")
            # Basic validation: check if token exists and has minimum structure
            if payload.token and len(payload.token) > 20:
                # Return authenticated but no profile (will be checked by frontend)
                return VerifyAuthResponse(
                    authenticated=True,
                    profile=None,
                    message="Basic token validation passed (Supabase not configured)"
                )
            else:
                return VerifyAuthResponse(
                    authenticated=False,
                    message="Invalid token format"
                )
        
        # Full Supabase verification
        try:
            from supabase import create_client, Client
            
            supabase: Client = create_client(settings.supabase_url, settings.supabase_key)
            
            # Verify token by getting user
            user_response = supabase.auth.get_user(payload.token)
            
            if not user_response or not user_response.user:
                return VerifyAuthResponse(
                    authenticated=False,
                    message="Invalid or expired token"
                )
            
            user = user_response.user
            
            # Get user profile from database
            profile = None
            try:
                profile_response = supabase.table("Profiles").select("*").eq("id", user.id).execute()
                if profile_response.data and len(profile_response.data) > 0:
                    profile = profile_response.data[0]
            except Exception as profile_error:
                logger.warning(f"Could not fetch profile: {profile_error}")
                # Continue without profile - frontend will handle
            
            return VerifyAuthResponse(
                authenticated=True,
                profile=profile,
                message="Authentication verified"
            )
            
        except ImportError:
            logger.error("Supabase Python client not installed. Install with: pip install supabase")
            # Fallback to basic validation
            if payload.token and len(payload.token) > 20:
                return VerifyAuthResponse(
                    authenticated=True,
                    profile=None,
                    message="Basic validation (Supabase client not available)"
                )
            else:
                return VerifyAuthResponse(
                    authenticated=False,
                    message="Invalid token"
                )
        except Exception as supabase_error:
            logger.error(f"Supabase verification error: {supabase_error}")
            return VerifyAuthResponse(
                authenticated=False,
                message=f"Authentication verification failed: {str(supabase_error)}"
            )
            
    except Exception as exc:
        logger.error(f"Error in verify_auth: {exc}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Authentication verification error: {str(exc)}"
        )

