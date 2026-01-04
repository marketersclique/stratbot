# app/llm/openrouter_client.py
"""
OpenRouter client wrapper for LLM inference.

Notes:
- No client is initialized at import time.
- Uses OpenAI SDK compatible with OpenRouter API.
"""

import logging
from typing import Optional

from openai import OpenAI

from app.config import Settings

logger = logging.getLogger(__name__)


class OpenRouterClient:
    def __init__(self, settings: Settings):
        self.settings = settings
        self._client = None

    def _get_client(self) -> OpenAI:
        """
        Get or create OpenRouter client.
        
        Requires OPENROUTER_API_KEY environment variable.
        
        Note: OpenRouter identity headers (HTTP-Referer and X-Title) are attached
        at client initialization to ensure they are always present in all requests.
        This is required for proper authentication and prevents 401 "User not found" errors.
        """
        if self._client:
            return self._client

        if not self.settings.openrouter_api_key:
            raise RuntimeError(
                "Missing OpenRouter API key. Set OPENROUTER_API_KEY environment variable."
            )

        try:
            # OpenRouter requires identity headers on all requests for proper authentication.
            # Setting them as default_headers ensures they're included in every API call.
            default_headers = {
                "HTTP-Referer": self.settings.openrouter_site_url or "http://localhost",
                "X-Title": self.settings.openrouter_site_name or "Clique Strategist",
            }
            
            self._client = OpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=self.settings.openrouter_api_key,
                default_headers=default_headers,
            )
            logger.info("OpenRouter client initialized successfully")
        except Exception as exc:
            logger.error(f"Failed to create OpenRouter client: {exc}", exc_info=True)
            raise RuntimeError(f"Failed to create OpenRouter client: {exc}") from exc

        return self._client

    def invoke_claude(
        self,
        *,
        system_prompt: str,
        user_prompt: str,
        max_tokens: Optional[int] = None,
        temperature: Optional[float] = None,
    ) -> str:
        """
        Invoke LLM model via OpenRouter with the given prompts.
        Returns the model text output. Raises RuntimeError on any API issues.
        """
        logger.debug(f"Invoking model via OpenRouter: {self.settings.openrouter_model}")
        
        client = self._get_client()
        
        # Build messages for chat completion
        messages = []
        if system_prompt:
            messages.append({
                "role": "system",
                "content": system_prompt,
            })
        messages.append({
            "role": "user",
            "content": user_prompt,
        })

        try:
            logger.debug(
                f"Sending request to OpenRouter: model={self.settings.openrouter_model}, "
                f"max_tokens={max_tokens or self.settings.max_tokens}"
            )
            
            # Identity headers are set at client initialization (default_headers),
            # so they're automatically included in all requests.
            completion = client.chat.completions.create(
                model=self.settings.openrouter_model,
                messages=messages,
                max_tokens=max_tokens or self.settings.max_tokens,
                temperature=temperature if temperature is not None else self.settings.temperature,
            )
            
            logger.debug("Received response from OpenRouter")
            
            # Extract text from response
            if not completion.choices or len(completion.choices) == 0:
                logger.error("OpenRouter response has no choices")
                raise RuntimeError("OpenRouter returned empty response")
            
            message = completion.choices[0].message
            if not message or not message.content:
                logger.error("OpenRouter response message has no content")
                raise RuntimeError("OpenRouter returned message with no content")
            
            strategy_text = message.content
            
            if not isinstance(strategy_text, str):
                logger.error(f"OpenRouter returned non-string content: {type(strategy_text)}")
                strategy_text = str(strategy_text)
            
            logger.info(f"Successfully extracted strategy text, length: {len(strategy_text)} characters")
            return strategy_text
            
        except Exception as exc:
            logger.error(f"OpenRouter API error: {type(exc).__name__}: {exc}", exc_info=True)
            raise RuntimeError(f"OpenRouter invocation failed: {exc}") from exc

