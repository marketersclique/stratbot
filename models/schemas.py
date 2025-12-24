# app/models/schemas.py
from typing import Dict, List, Optional

from pydantic import BaseModel, Field, validator


class StrategyRequest(BaseModel):
    """
    User-provided inputs from the multi-step form.
    """

    platforms: List[str] = Field(..., description="Selected social platforms")
    insights: Dict[str, Optional[str]] = Field(
        default_factory=dict, description="Free-form insight key/value pairs"
    )
    goal: Optional[str] = Field(default=None, description="Primary outcome user wants")
    duration_days: int = Field(..., description="Plan duration: 15/30/45/60/90 days")
    audience: Optional[str] = Field(default=None, description="Optional audience or niche description")

    @validator("duration_days")
    def validate_duration(cls, value: int) -> int:
        if value not in {15, 30, 45, 60, 90}:
            raise ValueError("duration_days must be one of 15, 30, 45, 60, 90")
        return value

    @validator("platforms")
    def validate_platforms(cls, value: List[str]) -> List[str]:
        if not value:
            raise ValueError("At least one platform is required.")
        return value


class StrategyResponse(BaseModel):
    """
    Structured response returned to the UI / API consumer.
    """

    strategy_text: str = Field(..., description="Formatted strategy following required sections")
    raw_prompt: str = Field(..., description="Prompt sent to the model for debugging/traceability")
