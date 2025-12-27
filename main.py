import logging
import sys

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles

from app.api.generate import router as generate_router
from app.config import get_settings
from app.models.schemas import StrategyRequest

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)

logger = logging.getLogger(__name__)

settings = get_settings()

app = FastAPI(title=settings.app_name)

logger.info(f"Starting {settings.app_name}")


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Global exception handler for Pydantic validation errors.
    Returns detailed field-level validation errors for 422 responses.
    """
    body_str = None
    if exc.body:
        try:
            if isinstance(exc.body, bytes):
                body_str = exc.body.decode("utf-8")
            else:
                body_str = str(exc.body)
        except Exception:
            body_str = "<unable to decode body>"
    
    return JSONResponse(
        status_code=422,
        content={
            "detail": exc.errors(),
            "body": body_str,
            "message": "Request validation failed. Check 'detail' field for specific field errors.",
        },
    )

# Mount static assets
import os
static_dir = os.path.join(os.path.dirname(__file__), "static")
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Serve the simple demo UI
@app.get("/", include_in_schema=False)
async def serve_index():
    return FileResponse(os.path.join(static_dir, "index.html"))


# Serve the results page
@app.get("/result.html", include_in_schema=False)
async def serve_result():
    return FileResponse(os.path.join(static_dir, "result.html"))


# API routes (no prefix to keep /generate-strategy as requested)
app.include_router(generate_router)


@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/test-payload")
async def test_payload(payload: StrategyRequest):
    """
    Test endpoint to validate payload structure.
    Returns the parsed payload to confirm schema validation works.
    """
    return {
        "status": "valid",
        "payload": payload.dict(),
        "platforms_count": len(payload.platforms),
        "insights_keys": list(payload.insights.keys()) if payload.insights else [],
    }
