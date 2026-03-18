"""
Service layer responsible for building prompts and invoking OpenRouter.
"""

import logging
from typing import Dict, List, Optional

from app.config import Settings
from app.llm.openrouter_client import OpenRouterClient
from app.models.schemas import StrategyRequest, StrategyResponse, CalendarRequest, CalendarResponse
from app.prompt.system_prompt import SYSTEM_PROMPT, CALENDAR_SYSTEM_PROMPT

logger = logging.getLogger(__name__)


class StrategyService:
    # Mapping of platform to its expected/allowed insight keys
    PLATFORM_SCHEMA_MAP: Dict[str, List[str]] = {
        "instagram": [
            "followers",
            "average_reel_views",
            "accounts_reached",
            "profile_visits",
            "posting_frequency",
            "primary_content_type",
        ],
        "facebook": [
            "page_followers",
            "average_reach",
            "engagement_level",
            "page_type",
        ],
        "twitter": [
            "followers",
            "average_impressions",
            "posting_frequency",
            "content_style",
            "profile_visits",
        ],
        "x": [  # alias for twitter
            "followers",
            "average_impressions",
            "posting_frequency",
            "content_style",
            "profile_visits",
        ],
        "linkedin": [
            "followers",
            "average_impressions",
            "profile_views",
            "content_type",
            "posting_frequency",
        ],
        "youtube": [
            "subscribers",
            "average_views",
            "average_watch_time",
            "upload_frequency",
            "post_shorts",
        ],
        "tiktok": [
            "followers",
            "average_views",
            "average_watch_time",
            "posting_frequency",
            "trend_usage",
        ],
        "pinterest": [
            "monthly_viewers",
            "average_pin_impressions",
            "link_clicks",
            "content_type",
            "posting_frequency",
        ],
    }

    def __init__(self, settings: Settings):
        self.settings = settings
        self.client = OpenRouterClient(settings)

    def _normalize_insights(self, platforms: List[str], insights: Dict) -> Dict[str, Dict[str, str]]:
        """
        Normalize incoming insights into a per-platform dict that only includes
        allowed keys for that platform. Supports two shapes:
        - insights = { "<platform>": {key: value, ...}, ... }
        - insights = flat dict with keys matching allowed keys (applied to all platforms)
        """
        normalized: Dict[str, Dict[str, str]] = {}
        flat_keys = set(insights.keys()) if insights else set()

        for platform in platforms:
            key = platform.lower()
            # Handle Twitter/X alias - both map to twitter schema
            if key == "x":
                key = "twitter"
            
            allowed = self.PLATFORM_SCHEMA_MAP.get(key)
            if not allowed:
                continue

            platform_payload: Dict[str, Optional[str]] = {}
            # Prefer nested object per platform if present
            # Check for original platform name, lowercase, and schema key
            nested = None
            if isinstance(insights, dict):
                nested = insights.get(platform) or insights.get(platform.lower()) or insights.get(key)
            if isinstance(nested, dict):
                for field in allowed:
                    value = nested.get(field)
                    if value not in (None, ""):
                        platform_payload[field] = str(value)
            else:
                # Fallback: use flat keys if provided (applied to this platform)
                for field in allowed:
                    if field in flat_keys and insights.get(field) not in (None, ""):
                        platform_payload[field] = str(insights.get(field))

            normalized[key] = platform_payload

        return normalized

    @staticmethod
    def _format_insights_block(normalized: Dict[str, Dict[str, str]]) -> str:
        if not normalized:
            return "No platform insights provided."

        lines: List[str] = []
        for platform, data in normalized.items():
            lines.append(f"{platform.capitalize()}:")
            if not data:
                lines.append("  - No metrics provided")
                continue
            for k, v in data.items():
                lines.append(f"  - {k}: {v}")
        return "\n".join(lines)

    def _build_user_prompt(self, payload: StrategyRequest) -> str:
        platforms = ", ".join(payload.platforms)
        normalized_insights = self._normalize_insights(payload.platforms, payload.insights)
        insights_text = self._format_insights_block(normalized_insights)
        audience = payload.audience or "Not specified"
        goal = payload.goal or "General growth / engagement"
        mode = "Advanced Multi-Platform Mode" if len(payload.platforms) > 1 else "Normal Strategy Mode"

        return f"""
Context
- Platforms: {platforms}
- Primary goal: {goal}
- Duration: {payload.duration_days} days
- Audience/niche: {audience}
- Mode: {mode}
- Insights:
{insights_text}

Output instructions
- Follow the mandatory output structure exactly (all 11 sections, in order).
- Never guarantee exact numbers; always provide ranges.
- Be specific to the selected platforms; if multi-platform, include integrated system plus platform-specific tactics.
- Provide 30/60/90-day phased plan (fold later checkpoints into stretch goals if duration is shorter).
- Keep sections concise, scannable, and execution-ready.
- Do not mix planner content unless explicitly asked.
"""

    def generate_strategy(self, payload: StrategyRequest) -> StrategyResponse:
        """
        Generate strategy by building prompt and invoking OpenRouter.
        Returns StrategyResponse with strategy text and raw prompt.
        """
        try:
            logger.debug("Building user prompt")
            user_prompt = self._build_user_prompt(payload)
            logger.debug(f"User prompt length: {len(user_prompt)} characters")
            
            logger.info(f"Invoking model via OpenRouter: {self.settings.openrouter_model}")
            strategy_text = self.client.invoke_claude(
                system_prompt=SYSTEM_PROMPT,
                user_prompt=user_prompt,
                max_tokens=self.settings.max_tokens,
                temperature=self.settings.temperature,
            )
            
            if not strategy_text or not isinstance(strategy_text, str):
                logger.error(f"Invalid strategy_text type: {type(strategy_text)}, value: {strategy_text}")
                raise RuntimeError("OpenRouter returned invalid or empty strategy text")
            
            logger.info(f"Strategy generated successfully, length: {len(strategy_text)} characters")
            
            return StrategyResponse(strategy_text=strategy_text, raw_prompt=user_prompt)
        except Exception as exc:
            logger.error(f"Error in generate_strategy: {type(exc).__name__}: {exc}", exc_info=True)
            raise

    def generate_calendar(self, payload: CalendarRequest) -> CalendarResponse:
        """
        Generate a personalized content calendar based on the provided strategy.
        Returns CalendarResponse with calendar text and raw prompt.
        """
        try:
            platforms = ", ".join(payload.platforms)
            audience = payload.audience or "Not specified"
            goal = payload.goal or "General growth / engagement"
            
            # Calculate number of weeks
            weeks = (payload.duration_days + 6) // 7  # Round up
            
            # Use full strategy text (not truncated) for better context
            user_prompt = f"""
Context
- Strategy to implement: {payload.strategy_text}
- Platforms: {platforms}
- Primary goal: {goal}
- Duration: {payload.duration_days} days ({weeks} weeks)
- Audience/niche: {audience}

Output instructions
- Generate a detailed weekly and day-wise content calendar for ALL {payload.duration_days} days
- Follow the mandatory output structure exactly
- For EACH DAY, provide:
  * Platform(s) to post on
  * Content Type (Reel, Post, Story, Carousel, etc.)
  * Specific Content Idea (be creative and specific)
  * Hook (attention-grabbing opening)
  * Script/Description (detailed content description or script)
  * CTA (call-to-action)
  * Optimization Tip (platform-specific best practice)
- Include platform-specific optimization tips for each day
- Ensure content variety - no repetitive ideas
- Align all content with the strategy's goals and audience
- Use markdown formatting with proper headings, subheadings, and bullet points
- Include emojis/icons for visual hierarchy and better readability
- Make it actionable and ready to execute

IMPORTANT: Generate content for EVERY SINGLE DAY ({payload.duration_days} days total). Do not skip any days.
"""
            
            logger.info(f"Generating calendar for {weeks} weeks across {platforms}")
            calendar_text = self.client.invoke_claude(
                system_prompt=CALENDAR_SYSTEM_PROMPT,
                user_prompt=user_prompt,
                max_tokens=self.settings.max_tokens,
                temperature=self.settings.temperature,
            )
            
            if not calendar_text or not isinstance(calendar_text, str):
                logger.error(f"Invalid calendar_text type: {type(calendar_text)}, value: {calendar_text}")
                raise RuntimeError("OpenRouter returned invalid or empty calendar text")
            
            logger.info(f"Calendar generated successfully, length: {len(calendar_text)} characters")
            
            return CalendarResponse(calendar_text=calendar_text, raw_prompt=user_prompt)
        except Exception as exc:
            logger.error(f"Error in generate_calendar: {type(exc).__name__}: {exc}", exc_info=True)
            raise


