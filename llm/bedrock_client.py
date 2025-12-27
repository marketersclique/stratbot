# app/llm/bedrock_client.py
"""
Thin Bedrock runtime client wrapper.

Notes:
- No client is initialized at import time.
- Uses IAM Role authentication (no explicit credentials).
"""

import json
import logging
from typing import Optional

import boto3
from botocore.config import Config
from botocore.exceptions import BotoCoreError, ClientError

from app.config import Settings

logger = logging.getLogger(__name__)


class BedrockClient:
    def __init__(self, settings: Settings):
        self.settings = settings
        self._client = None

    def _get_client(self):
        """
        Get or create Bedrock client using IAM Role authentication.
        
        For IAM Role-based auth (EC2, ECS, Lambda):
        - boto3 automatically uses IAM role credentials from the environment
        - No explicit credentials needed in code
        - Falls back to default credential chain (env vars, ~/.aws/credentials, IAM role)
        """
        if self._client:
            return self._client

        try:
            retry_config = Config(
                region_name=self.settings.aws_region,
                retries={"max_attempts": 10, "mode": "standard"},
            )

            # Create client without explicit credentials - uses IAM role or default credential chain
            self._client = boto3.client(
                "bedrock-runtime",
                region_name=self.settings.aws_region,
                config=retry_config,
                # No aws_access_key_id or aws_secret_access_key - uses IAM role
            )
        except Exception as exc:  # pragma: no cover - defensive
            raise RuntimeError(
                f"Failed to create Bedrock client: {exc}. "
                "Ensure IAM role has bedrock:InvokeModel permission and region is correct."
            ) from exc

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
        Invoke Anthropic Claude model on Bedrock with the given prompts.
        Returns the model text output. Raises RuntimeError on any Bedrock issues.
        """
        logger.debug(f"Invoking Claude model: {self.settings.bedrock_model_id}")
        
        client = self._get_client()
        body = {
            "anthropic_version": "bedrock-2023-05-31",
            "max_tokens": max_tokens or self.settings.max_tokens,
            "temperature": temperature if temperature is not None else self.settings.temperature,
            "system": system_prompt,
            "messages": [
                {"role": "user", "content": [{"type": "text", "text": user_prompt}]},
            ],
        }

        try:
            logger.debug(f"Sending request to Bedrock: model={self.settings.bedrock_model_id}, max_tokens={body['max_tokens']}")
            response = client.invoke_model(
                modelId=self.settings.bedrock_model_id,
                contentType="application/json",
                accept="application/json",
                body=json.dumps(body),
            )
            logger.debug("Received response from Bedrock")
        except (ClientError, BotoCoreError) as exc:
            logger.error(f"Bedrock API error: {type(exc).__name__}: {exc}", exc_info=True)
            raise RuntimeError(f"Bedrock invocation failed: {exc}") from exc

        # Read response body
        raw_body = response.get("body")
        if raw_body is None:
            logger.error("Bedrock response missing 'body' field")
            raise RuntimeError("Bedrock response missing 'body' field")
        
        try:
            if hasattr(raw_body, "read"):
                text = raw_body.read().decode("utf-8")
            else:
                text = str(raw_body)
            logger.debug(f"Response body length: {len(text)} characters")
        except Exception as exc:
            logger.error(f"Failed to read response body: {exc}", exc_info=True)
            raise RuntimeError(f"Failed to decode Bedrock response: {exc}") from exc

        # Parse JSON response
        try:
            parsed = json.loads(text)
            logger.debug(f"Parsed response keys: {list(parsed.keys())}")
        except json.JSONDecodeError as exc:
            logger.error(f"Failed to parse JSON response: {exc}, raw text: {text[:200]}")
            raise RuntimeError(f"Invalid JSON response from Bedrock: {exc}") from exc

        # Extract text from Claude response format
        # Claude 3 format: {"content": [{"type": "text", "text": "..."}], ...}
        strategy_text = None
        
        if "content" in parsed and isinstance(parsed["content"], list):
            # Claude 3 format
            for item in parsed["content"]:
                if isinstance(item, dict) and item.get("type") == "text":
                    strategy_text = item.get("text")
                    if strategy_text:
                        break
        elif "output_text" in parsed:
            # Legacy format
            strategy_text = parsed.get("output_text")
        elif "text" in parsed:
            # Alternative format
            strategy_text = parsed.get("text")
        
        if not strategy_text:
            logger.error(f"Could not extract text from response. Parsed keys: {list(parsed.keys())}, content structure: {parsed.get('content', 'N/A')}")
            # Fallback: return full JSON as string for debugging
            strategy_text = json.dumps(parsed, indent=2)
            logger.warning("Using full JSON response as fallback")
        
        if not isinstance(strategy_text, str):
            logger.error(f"Extracted strategy_text is not a string: {type(strategy_text)}")
            strategy_text = str(strategy_text)
        
        logger.info(f"Successfully extracted strategy text, length: {len(strategy_text)} characters")
        return strategy_text
