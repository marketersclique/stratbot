from functools import lru_cache
from dotenv import load_dotenv
from pydantic import BaseModel, Field

# Load env once
load_dotenv()


class Settings(BaseModel):
    app_name: str = "Clique Strategist API"
    aws_region: str = Field(default="us-east-1", alias="AWS_REGION")
    bedrock_model_id: str = Field(
        default="anthropic.claude-3-haiku-20240307-v1:0",
        alias="BEDROCK_MODEL_ID",
    )
    max_tokens: int = 4000
    temperature: float = 0.6

    class Config:
        allow_population_by_field_name = True
        extra = "ignore"


@lru_cache
def get_settings() -> Settings:
    return Settings()
