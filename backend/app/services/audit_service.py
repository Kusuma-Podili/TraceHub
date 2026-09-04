import logging
from datetime import datetime
from typing import Optional, Dict, Any

logger = logging.getLogger("tracehub.audit")

class AuditService:
    """Structured audit trail logging service for enterprise SDLC governance."""

    @staticmethod
    def log_event(
        action: str,
        entity_type: str,
        entity_id: int,
        user_id: Optional[int] = None,
        username: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """Record an audit trail entry with actor attribution and metadata."""
        entry = {
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "action": action,
            "entity_type": entity_type,
            "entity_id": entity_id,
            "user_id": user_id,
            "username": username or "system",
            "metadata": metadata or {}
        }
        logger.info(
            f"AUDIT_LOG | timestamp={entry['timestamp']} | user={entry['username']} | "
            f"action={entry['action']} | entity={entity_type}#{entity_id}"
        )
        return entry
