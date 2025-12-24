"""
Configuration and environment loading.

Rules:
- .env is loaded exactly once here.
- No clients are initialized at import time; we only read configuration.
"""

import os
from functools import lru_cache
from typing import Optional

from dotenv import load_dotenv
from pydantic import BaseModel, Field

# Load environment variables once on import
load_dotenv()


class Settings(BaseModel):
    app_name: str = "Clique Strategist API"
    aws_access_key_id: Optional[str] = Field(default=None, alias="AWS_ACCESS_KEY_ID")
    aws_secret_access_key: Optional[str] = Field(default=None, alias="AWS_SECRET_ACCESS_KEY")
    aws_region: str = Field(default="us-east-1", alias="AWS_REGION")
    bedrock_model_id: str = Field(
        default="anthropic.claude-3-haiku-20240307-v1:0",
        alias="BEDROCK_MODEL_ID",
    )
    # Raise the default token limit so responses are not truncated mid-output.
    max_tokens: int = 4000
    temperature: float = 0.6

    class Config:
        allow_population_by_field_name = True
        extra = "ignore"


@lru_cache
def get_settings() -> Settings:
    """
    Cached settings accessor so config is read once per process.
    """
    return Settings(**{k: v for k, v in os.environ.items()})


