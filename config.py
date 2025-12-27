import os
from functools import lru_cache
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from pydantic import BaseModel, Field

# Load .env file from app directory (where this file is located)
env_path = Path(__file__).parent / ".env"
if env_path.exists():
    load_dotenv(dotenv_path=env_path, override=True)
else:
    # Fallback: try loading from current directory
    load_dotenv(override=True)


class Settings(BaseModel):
    app_name: str = "Clique Strategist API"
    openrouter_api_key: Optional[str] = Field(default=None, alias="OPENROUTER_API_KEY")
    openrouter_model: str = Field(
        default="openai/gpt-4o-mini",
        alias="OPENROUTER_MODEL",
    )
    openrouter_site_url: Optional[str] = Field(default=None, alias="OPENROUTER_SITE_URL")
    openrouter_site_name: Optional[str] = Field(default=None, alias="OPENROUTER_SITE_NAME")
    max_tokens: int = 4000
    temperature: float = 0.6

    class Config:
        allow_population_by_field_name = True
        extra = "ignore"


@lru_cache
def get_settings() -> Settings:
    """
    Get settings instance, reading from environment variables.
    Pydantic will automatically read from os.environ when using Field aliases.
    """
    # Create dict from environment variables for explicit population
    env_vars = {
        "OPENROUTER_API_KEY": os.getenv("OPENROUTER_API_KEY"),
        "OPENROUTER_MODEL": os.getenv("OPENROUTER_MODEL", "openai/gpt-4o-mini"),
        "OPENROUTER_SITE_URL": os.getenv("OPENROUTER_SITE_URL"),
        "OPENROUTER_SITE_NAME": os.getenv("OPENROUTER_SITE_NAME"),
    }
    return Settings(**env_vars)
