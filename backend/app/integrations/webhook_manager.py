import hmac
import hashlib
import json
import logging
import urllib.request
import urllib.error
from datetime import datetime
from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field

logger = logging.getLogger("tracehub.integrations.webhooks")

class WebhookDeliveryLog(BaseModel):
    delivery_id: str
    endpoint_url: str
    event_topic: str
    status_code: Optional[int] = None
    success: bool = False
    duration_ms: float = 0.0
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    error_message: Optional[str] = None

class WebhookManager:
    """
    HMAC-SHA256 Signed Outgoing Webhook Dispatcher.
    Delivers event payloads to external CI/CD, Slack, Teams, or third-party webhooks.
    """

    @staticmethod
    def compute_signature(payload_json: str, secret: str) -> str:
        return hmac.new(
            secret.encode("utf-8"),
            payload_json.encode("utf-8"),
            hashlib.sha256
        ).hexdigest()

    @classmethod
    def dispatch_webhook(
        cls,
        endpoint_url: str,
        secret: str,
        topic: str,
        payload: Dict[str, Any],
        timeout_seconds: int = 5
    ) -> WebhookDeliveryLog:
        raw_json = json.dumps(payload, default=str)
        signature = cls.compute_signature(raw_json, secret)

        headers = {
            "Content-Type": "application/json",
            "User-Agent": "TraceHub-Webhook-Dispatcher/1.0",
            "X-TraceHub-Event": topic,
            "X-TraceHub-Signature": f"sha256={signature}"
        }

        req = urllib.request.Request(endpoint_url, data=raw_json.encode("utf-8"), headers=headers, method="POST")
        start = datetime.utcnow()

        try:
            with urllib.request.urlopen(req, timeout=timeout_seconds) as resp:
                elapsed = (datetime.utcnow() - start).total_seconds() * 1000.0
                return WebhookDeliveryLog(
                    delivery_id=f"DELIV-{int(start.timestamp())}",
                    endpoint_url=endpoint_url,
                    event_topic=topic,
                    status_code=resp.status,
                    success=True,
                    duration_ms=round(elapsed, 2)
                )
        except urllib.error.HTTPError as e:
            elapsed = (datetime.utcnow() - start).total_seconds() * 1000.0
            return WebhookDeliveryLog(
                delivery_id=f"DELIV-{int(start.timestamp())}",
                endpoint_url=endpoint_url,
                event_topic=topic,
                status_code=e.code,
                success=False,
                duration_ms=round(elapsed, 2),
                error_message=f"HTTP {e.code}"
            )
        except Exception as e:
            elapsed = (datetime.utcnow() - start).total_seconds() * 1000.0
            return WebhookDeliveryLog(
                delivery_id=f"DELIV-{int(start.timestamp())}",
                endpoint_url=endpoint_url,
                event_topic=topic,
                status_code=None,
                success=False,
                duration_ms=round(elapsed, 2),
                error_message=str(e)
            )
