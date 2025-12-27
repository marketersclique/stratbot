import logging

from fastapi import APIRouter, HTTPException
from app.config import get_settings
from app.models.schemas import StrategyRequest, StrategyResponse
from app.services.strategy_service import StrategyService

logger = logging.getLogger(__name__)
router = APIRouter()


@router.post("/generate-strategy", response_model=StrategyResponse)
async def generate_strategy(payload: StrategyRequest):
    """
    Generate marketing strategy using AWS Bedrock Claude model.
    """
    logger.info(f"Received strategy request: platforms={payload.platforms}, duration={payload.duration_days} days")
    
    settings = get_settings()
    service = StrategyService(settings)

    try:
        logger.debug("Calling StrategyService.generate_strategy")
        result = service.generate_strategy(payload)
        logger.info("Strategy generated successfully")
        return result
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
