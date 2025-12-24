# app/llm/bedrock_client.py
"""
Thin Bedrock runtime client wrapper.

Notes:
- No client is initialized at import time.
- Credentials are pulled from Settings, not directly from the environment.
"""

import json
from typing import Optional

import boto3
from botocore.config import Config
from botocore.exceptions import BotoCoreError, ClientError

from app.config import Settings


class BedrockClient:
    def __init__(self, settings: Settings):
        self.settings = settings
        self._client = None

    def _get_client(self):
        if self._client:
            return self._client

        if not (self.settings.aws_access_key_id and self.settings.aws_secret_access_key):
            raise RuntimeError("Missing AWS credentials. Set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY.")

        try:
            retry_config = Config(
                region_name=self.settings.aws_region,
                retries={"max_attempts": 10, "mode": "standard"},
            )

            self._client = boto3.client(
                "bedrock-runtime",
                region_name=self.settings.aws_region,
                config=retry_config,
                aws_access_key_id=self.settings.aws_access_key_id,
                aws_secret_access_key=self.settings.aws_secret_access_key,
            )
        except Exception as exc:  # pragma: no cover - defensive
            raise RuntimeError(f"Failed to create Bedrock client: {exc}") from exc

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
            response = client.invoke_model(
                modelId=self.settings.bedrock_model_id,
                contentType="application/json",
                accept="application/json",
                body=json.dumps(body),
            )
        except (ClientError, BotoCoreError) as exc:
            raise RuntimeError(f"Bedrock invocation failed: {exc}") from exc

        raw_body = response.get("body")
        text = raw_body.read().decode("utf-8") if hasattr(raw_body, "read") else str(raw_body)

        try:
            parsed = json.loads(text)
            return parsed.get("output_text") or parsed.get("content", [{}])[0].get("text") or json.dumps(parsed)
        except Exception:
            return text
