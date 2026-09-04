import asyncio
import logging
from datetime import datetime
from typing import Dict, List, Callable, Any, Optional
from collections import defaultdict

logger = logging.getLogger("tracehub.integrations.events")

class EventDispatcher:
    """
    Enterprise In-Memory Asynchronous Pub/Sub Event Bus.
    Decouples task lifecycle state updates, notifications, webhooks, and audit logging.
    """

    _subscribers: Dict[str, List[Callable[[Dict[str, Any]], None]]] = defaultdict(list)
    _event_history: List[Dict[str, Any]] = []

    @classmethod
    def subscribe(cls, topic: str, handler: Callable[[Dict[str, Any]], None]) -> None:
        cls._subscribers[topic].append(handler)
        logger.info(f"Subscribed handler {handler.__name__} to topic '{topic}'")

    @classmethod
    def publish(cls, topic: str, payload: Dict[str, Any]) -> None:
        event_record = {
            "topic": topic,
            "timestamp": datetime.utcnow().isoformat(),
            "payload": payload
        }
        cls._event_history.append(event_record)
        if len(cls._event_history) > 1000:
            cls._event_history.pop(0)

        handlers = cls._subscribers.get(topic, [])
        wildcard_handlers = cls._subscribers.get("*", [])

        for h in handlers + wildcard_handlers:
            try:
                h(event_record)
            except Exception as e:
                logger.error(f"Error executing event handler {h.__name__} on topic {topic}: {e}")

    @classmethod
    def get_recent_events(cls, limit: int = 50) -> List[Dict[str, Any]]:
        return cls._event_history[-limit:]
