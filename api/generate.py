from fastapi import APIRouter, HTTPException
from dotenv import load_dotenv
from app.config import get_settings
from app.models.schemas import StrategyRequest, StrategyResponse
from app.services.strategy_service import StrategyService

router = APIRouter()

load_dotenv()

@router.post("/generate-strategy", response_model=StrategyResponse)
async def generate_strategy(payload: StrategyRequest):
    settings = get_settings()
    service = StrategyService(settings)

    try:
        return service.generate_strategy(payload)
    except ValueError as exc:
        # Known validation errors (e.g., duration)
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:  # pragma: no cover - runtime safeguard
        raise HTTPException(status_code=500, detail=str(exc)) from exc
