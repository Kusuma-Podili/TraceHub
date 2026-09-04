import re
import logging
from typing import Dict, List, Optional, Any, Tuple
from enum import Enum
from pydantic import BaseModel, Field

logger = logging.getLogger("tracehub.automation.rules")

class TriggerEvent(str, Enum):
    TASK_STATUS_CHANGED = "task.status_changed"
    TASK_PROGRESS_UPDATED = "task.progress_updated"
    TEST_CASE_FAILED = "test.execution_failed"
    BUG_REPORTED = "bug.reported"
    BUG_MARKED_FIXED = "bug.marked_fixed"
    SDLC_PHASE_ADVANCED = "sdlc.phase_advanced"

class ActionType(str, Enum):
    ASSIGN_TASK = "assign_task"
    SEND_NOTIFICATION = "send_notification"
    SET_PRIORITY = "set_priority"
    CREATE_DEFECT = "create_defect"
    TRIGGER_WEBHOOK = "trigger_webhook"
    ESCALATE_TO_PM = "escalate_to_pm"

class AutomationRule(BaseModel):
    rule_id: int
    name: str
    is_active: bool = True
    trigger_event: TriggerEvent
    condition_field: str
    condition_operator: str  # "==", "!=", ">=", "<=", "contains", "in"
    condition_value: str
    action_type: ActionType
    action_payload: Dict[str, Any] = Field(default_factory=dict)
    execution_count: int = 0

class RuleEvaluator:
    """
    Trigger-Condition-Action Workflow Automation Engine.
    Executes business rules on task handoffs, SLA breaches, and quality gates.
    """

    @classmethod
    def evaluate_condition(cls, item_value: Any, operator: str, target_value: str) -> bool:
        if item_value is None:
            return False

        s_val = str(item_value).strip().lower()
        t_val = str(target_value).strip().lower()

        try:
            if operator == "==":
                return s_val == t_val
            elif operator == "!=":
                return s_val != t_val
            elif operator == "contains":
                return t_val in s_val
            elif operator == "in":
                options = [x.strip() for x in t_val.split(",")]
                return s_val in options
            elif operator in [">=", "<=", ">", "<"]:
                n_item = float(item_value)
                n_target = float(target_value)
                if operator == ">=":
                    return n_item >= n_target
                elif operator == "<=":
                    return n_item <= n_target
                elif operator == ">":
                    return n_item > n_target
                elif operator == "<":
                    return n_item < n_target
        except Exception:
            return False

        return False

    @classmethod
    def process_event(
        cls,
        event: TriggerEvent,
        event_payload: Dict[str, Any],
        active_rules: List[AutomationRule]
    ) -> List[Dict[str, Any]]:
        triggered_actions: List[Dict[str, Any]] = []

        for rule in active_rules:
            if not rule.is_active or rule.trigger_event != event:
                continue

            field_val = event_payload.get(rule.condition_field)
            if cls.evaluate_condition(field_val, rule.condition_operator, rule.condition_value):
                rule.execution_count += 1
                logger.info(f"Automation Rule Triggered: '{rule.name}' for event {event.value}")
                triggered_actions.append({
                    "rule_id": rule.rule_id,
                    "rule_name": rule.name,
                    "action_type": rule.action_type.value,
                    "action_payload": rule.action_payload,
                    "source_event": event.value
                })

        return triggered_actions
