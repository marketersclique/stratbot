"""
Service layer responsible for building prompts and invoking Bedrock.
"""

from typing import Dict, List, Optional

from app.config import Settings
from app.llm.bedrock_client import BedrockClient
from app.models.schemas import StrategyRequest, StrategyResponse
from app.prompt.system_prompt import SYSTEM_PROMPT


class StrategyService:
    # Mapping of platform to its expected/allowed insight keys
    PLATFORM_SCHEMA_MAP: Dict[str, List[str]] = {
        "instagram": [
            "followers",
            "average_reach",
            "average_reel_views",
            "engagement_rate",
            "posting_frequency",
        ],
        "facebook": [
            "page_likes",
            "average_post_reach",
            "ad_usage",
            "content_type_mix",
        ],
        "twitter": [
            "followers",
            "impressions_last_28_days",
            "engagement_rate",
            "posting_frequency",
        ],
        "x": [  # alias for twitter
            "followers",
            "impressions_last_28_days",
            "engagement_rate",
            "posting_frequency",
        ],
        "linkedin": [
            "followers",
            "profile_type",
            "impressions_last_30_days",
            "lead_goal",
        ],
        "youtube": [
            "subscribers",
            "average_views",
            "watch_time_hours",
            "posting_frequency",
        ],
        "tiktok": [
            "followers",
            "average_views",
            "viral_hits",
            "posting_frequency",
        ],
    }

    def __init__(self, settings: Settings):
        self.settings = settings
        self.client = BedrockClient(settings)

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
            allowed = self.PLATFORM_SCHEMA_MAP.get(key)
            if not allowed:
                continue

            platform_payload: Dict[str, Optional[str]] = {}
            # Prefer nested object per platform if present
            nested = insights.get(platform) or insights.get(platform.lower()) if isinstance(insights, dict) else None
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
        user_prompt = self._build_user_prompt(payload)
        strategy_text = self.client.invoke_claude(
            system_prompt=SYSTEM_PROMPT,
            user_prompt=user_prompt,
            max_tokens=self.settings.max_tokens,
            temperature=self.settings.temperature,
        )
        return StrategyResponse(strategy_text=strategy_text, raw_prompt=user_prompt)


