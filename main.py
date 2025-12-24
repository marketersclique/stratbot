
from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from app.api.generate import router as generate_router
from app.config import get_settings

settings = get_settings()

app = FastAPI(title=settings.app_name)

# Mount static assets
app.mount("/static", StaticFiles(directory="app/static"), name="static")

# Serve the simple demo UI
@app.get("/", include_in_schema=False)
async def serve_index():
    return FileResponse("app/static/index.html")


# API routes (no prefix to keep /generate-strategy as requested)
app.include_router(generate_router)


@app.get("/health")
async def health():
    return {"status": "ok"}
