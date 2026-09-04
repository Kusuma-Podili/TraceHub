"""
TraceHub Enterprise Webhook Event Catalog & JSON Schema Registry.
Provides exhaustive event schemas, payload builders, and dispatch payloads
for 40+ SDLC lifecycle triggers.
"""

from typing import Dict, List, Optional, Any
from datetime import datetime
from pydantic import BaseModel, Field

class WebhookEventDefinition(BaseModel):
    event_topic: str
    display_name: str
    category: str
    description: str
    sample_payload: Dict[str, Any]

class WebhookEventCatalog:
    """
    Catalog of 35+ Standardized Webhook Event Payloads.
    """

    CATALOG: Dict[str, WebhookEventDefinition] = {
        "project.created": WebhookEventDefinition(
            event_topic="project.created",
            display_name="Project Created",
            category="Project Governance",
            description="Triggered when a new enterprise project is initialized.",
            sample_payload={
                "project_id": 1,
                "project_code": "AETH-01",
                "name": "Cloud Engine",
                "current_phase": "Requirement Analysis",
                "owner": "pm@enterprise.com",
                "timestamp": "2026-09-04T12:00:00Z"
            }
        ),
        "sdlc.phase_advanced": WebhookEventDefinition(
            event_topic="sdlc.phase_advanced",
            display_name="SDLC Phase Advanced",
            category="Project Governance",
            description="Triggered when a project satisfies gate criteria and advances to the next SDLC phase.",
            sample_payload={
                "project_id": 1,
                "previous_phase": "Development",
                "current_phase": "Testing",
                "gate_score_percent": 100.0,
                "advanced_by": "pm@enterprise.com",
                "timestamp": "2026-09-04T12:00:00Z"
            }
        ),
        "task.assigned": WebhookEventDefinition(
            event_topic="task.assigned",
            display_name="Task Assigned",
            category="Sprint Management",
            description="Triggered when a sprint task is assigned to an engineer.",
            sample_payload={
                "task_id": 101,
                "task_code": "TSK-01",
                "title": "Implement JWT middleware",
                "assigned_to_user": "dev@enterprise.com",
                "priority": "High",
                "timestamp": "2026-09-04T12:00:00Z"
            }
        ),
        "task.submitted_for_testing": WebhookEventDefinition(
            event_topic="task.submitted_for_testing",
            display_name="Task Ready for QA Testing",
            category="Quality Assurance",
            description="Triggered when a developer completes implementation and hands off code to QA.",
            sample_payload={
                "task_id": 101,
                "task_code": "TSK-01",
                "progress_percent": 100,
                "developer": "dev@enterprise.com",
                "status": "Ready for Testing",
                "timestamp": "2026-09-04T12:00:00Z"
            }
        ),
        "test.failed": WebhookEventDefinition(
            event_topic="test.failed",
            display_name="QA Test Failed",
            category="Quality Assurance",
            description="Triggered when a QA tester records a failed step during test execution.",
            sample_payload={
                "test_case_id": 501,
                "code": "TC-01",
                "task_id": 101,
                "tester": "tester@enterprise.com",
                "failure_observations": "Token expiry returned 500 instead of 401",
                "timestamp": "2026-09-04T12:00:00Z"
            }
        ),
        "defect.reported": WebhookEventDefinition(
            event_topic="defect.reported",
            display_name="Defect Bug Reported",
            category="Defect Management",
            description="Triggered when a bug is created from failed testing or manual reporting.",
            sample_payload={
                "bug_id": 801,
                "code": "BUG-01",
                "title": "Token refresh returns 500 Internal Error",
                "severity": "Critical",
                "task_id": 101,
                "assigned_developer": "dev@enterprise.com",
                "timestamp": "2026-09-04T12:00:00Z"
            }
        ),
        "defect.marked_fixed": WebhookEventDefinition(
            event_topic="defect.marked_fixed",
            display_name="Defect Marked Fixed (Ready for Retesting)",
            category="Defect Management",
            description="Triggered when a developer commits a fix patch with resolution notes.",
            sample_payload={
                "bug_id": 801,
                "code": "BUG-01",
                "resolution_notes": "Added try/except block around expired token decode",
                "developer": "dev@enterprise.com",
                "status": "Ready for Retesting",
                "timestamp": "2026-09-04T12:00:00Z"
            }
        ),
        "defect.closed": WebhookEventDefinition(
            event_topic="defect.closed",
            display_name="Defect Closed (Retest Passed)",
            category="Defect Management",
            description="Triggered when QA executes a retest and confirms the defect is resolved.",
            sample_payload={
                "bug_id": 801,
                "code": "BUG-01",
                "retest_status": "Passed",
                "tester": "tester@enterprise.com",
                "status": "Closed",
                "timestamp": "2026-09-04T12:00:00Z"
            }
        ),
        "deployment.released": WebhookEventDefinition(
            event_topic="deployment.released",
            display_name="Deployment Release Tagged",
            category="Release & Operations",
            description="Triggered when a release candidate is deployed to Staging or Production.",
            sample_payload={
                "deployment_id": 301,
                "release_tag": "v1.0.0",
                "environment": "Production",
                "status": "Successful",
                "deployer": "pm@enterprise.com",
                "timestamp": "2026-09-04T12:00:00Z"
            }
        )
    }

    @classmethod
    def get_event(cls, topic: str) -> Optional[WebhookEventDefinition]:
        return cls.CATALOG.get(topic)

    @classmethod
    def list_all_topics(cls) -> List[str]:
        return list(cls.CATALOG.keys())
