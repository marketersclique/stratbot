import logging
import os
import sys

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from app.api.generate import router as generate_router
from app.api.auth import router as auth_router
from app.api.pdf import router as pdf_router
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

# Configure CORS
# In production, replace with specific origins
allowed_origins = [
    "http://localhost:3000",  # Next.js dev
    "https://marketersclique.com",  # Production frontend
    "https://www.marketersclique.com",  # Production frontend with www
]

# Allow environment variable override for additional origins
env_origins = os.getenv("ALLOWED_ORIGINS", "").split(",")
if env_origins and env_origins[0]:
    allowed_origins.extend([origin.strip() for origin in env_origins if origin.strip()])

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger.info(f"Starting {settings.app_name}")


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Global exception handler for Pydantic validation errors.
    Returns detailed field-level validation errors for 422 responses.
    """
    # Pydantic v2 stores the raw ValueError inside ctx['error'], which is not
    # JSON-serializable. Sanitize ctx values to strings before returning.
    sanitized_errors = []
    for error in exc.errors():
        sanitized = {k: v for k, v in error.items()}
        if "ctx" in sanitized and isinstance(sanitized["ctx"], dict):
            sanitized["ctx"] = {k: str(v) for k, v in sanitized["ctx"].items()}
        sanitized_errors.append(sanitized)

    return JSONResponse(
        status_code=422,
        content={
            "error": "Validation Error",
            "details": sanitized_errors,
            "message": "Request validation failed. Check 'details' field for specific field errors.",
        },
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Global exception handler to catch all unhandled exceptions.
    Logs the full traceback and returns a user-friendly error message.
    """
    import traceback
    logger.error(
        f"Unhandled exception: {type(exc).__name__}: {exc}",
        exc_info=True,
        extra={
            "path": request.url.path,
            "method": request.method,
        }
    )
    
    # Log full traceback
    tb_str = "".join(traceback.format_exception(type(exc), exc, exc.__traceback__))
    logger.debug(f"Full traceback:\n{tb_str}")
    
    return JSONResponse(
        status_code=500,
        content={
            "detail": str(exc),
            "type": type(exc).__name__,
            "message": "An internal server error occurred. Please check the server logs for details.",
        },
    )

# Mount static assets
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
app.include_router(auth_router)
app.include_router(pdf_router)


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
