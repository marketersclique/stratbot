import logging

from fastapi import APIRouter, HTTPException, Depends
from app.config import get_settings
from app.models.schemas import StrategyRequest, StrategyResponse, CalendarRequest, CalendarResponse
from app.services.strategy_service import StrategyService
from app.dependencies.auth import get_current_user, AuthenticatedUser

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/generate-strategy", response_model=StrategyResponse)
async def generate_strategy(payload: StrategyRequest):
    """
    Generate marketing strategy using OpenRouter LLM API.
    """
    logger.info(f"Received strategy request: platforms={payload.platforms}, duration={payload.duration_days} days")
    
    settings = get_settings()
    service = StrategyService(settings)

    try:
        logger.debug("Calling StrategyService.generate_strategy")
        result = service.generate_strategy(payload)
        logger.info("Strategy generated successfully")
        return result
    except AttributeError as exc:
        logger.error(f"Attribute error (likely missing import or method): {exc}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Configuration error: {str(exc)}"
        ) from exc
    except ImportError as exc:
        logger.error(f"Import error: {exc}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Module import error: {str(exc)}"
        ) from exc
    except ValueError as exc:
        logger.warning(f"Validation error: {exc}")
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except RuntimeError as exc:
        logger.error(f"Runtime error during strategy generation: {exc}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Strategy generation failed: {str(exc)}"
        ) from exc
    except Exception as exc:
        logger.error(f"Unexpected error during strategy generation: {type(exc).__name__}: {exc}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(exc)}"
        ) from exc


@router.post("/generate-calendar", response_model=CalendarResponse)
async def generate_calendar(
    payload: CalendarRequest,
    user: AuthenticatedUser = Depends(get_current_user)
):
    """
    Generate personalized content calendar based on a strategy.
    Requires authentication via JWT token in Authorization header.
    
    The token is validated using Supabase, and user information is extracted
    from the validated token. The route will return 401 if the token is missing,
    invalid, or expired.
    """
    logger.info(
        f"Received calendar request from user {user.user_id} ({user.email}): "
        f"platforms={payload.platforms}, duration={payload.duration_days} days"
    )
    
    settings = get_settings()
    service = StrategyService(settings)

    try:
        logger.debug("Calling StrategyService.generate_calendar")
        result = service.generate_calendar(payload)
        logger.info("Calendar generated successfully")
        return result
    except ValueError as exc:
        logger.warning(f"Validation error: {exc}")
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except RuntimeError as exc:
        logger.error(f"Runtime error during calendar generation: {exc}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Calendar generation failed: {str(exc)}"
        ) from exc
    except Exception as exc:
        logger.error(f"Unexpected error during calendar generation: {type(exc).__name__}: {exc}", exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Internal server error: {str(exc)}"
        ) from exc
