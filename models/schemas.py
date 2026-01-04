# app/models/schemas.py
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field, validator


class StrategyRequest(BaseModel):
    """
    User-provided inputs from the multi-step form.
    
    Schema contract:
    - platforms: List of platform names (e.g., ["Instagram", "Facebook"])
    - insights: Nested dict with platform keys containing platform-specific metrics
      Format: {"instagram": {"followers": "1200", ...}, "facebook": {...}}
    - duration_days: Must be one of {15, 30, 45, 60, 90}
    - goal: Optional primary objective
    - audience: Optional audience/niche description
    """

    platforms: List[str] = Field(..., description="Selected social platforms")
    insights: Dict[str, Any] = Field(
        default_factory=dict,
        description="Platform-specific insights. Can be nested: {platform: {field: value}} or flat: {field: value}"
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
            raise ValueError("At least one platform is required")
        return value


class StrategyResponse(BaseModel):
    """
    Structured response returned to the UI / API consumer.
    """

    strategy_text: str = Field(..., description="Formatted strategy following required sections")
    raw_prompt: str = Field(..., description="Prompt sent to the model for debugging/traceability")


class CalendarRequest(BaseModel):
    """
    Request for generating a personalized content calendar based on a strategy.
    """
    strategy_text: str = Field(..., description="The generated strategy text to base the calendar on")
    platforms: List[str] = Field(..., description="Selected social platforms")
    duration_days: int = Field(..., description="Plan duration: 15/30/45/60/90 days")
    goal: Optional[str] = Field(default=None, description="Primary outcome user wants")
    audience: Optional[str] = Field(default=None, description="Optional audience or niche description")

    @validator("duration_days")
    def validate_duration(cls, value: int) -> int:
        if value not in {15, 30, 45, 60, 90}:
            raise ValueError("duration_days must be one of 15, 30, 45, 60, 90")
        return value


class CalendarResponse(BaseModel):
    """
    Structured response for the content calendar.
    """
    calendar_text: str = Field(..., description="Formatted weekly and day-wise content calendar")
    raw_prompt: str = Field(..., description="Prompt sent to the model for debugging/traceability")
