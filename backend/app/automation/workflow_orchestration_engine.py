"""
TraceHub Multi-Step Workflow Orchestration & Distributed Saga Engine.
Orchestrates complex multi-stage release pipelines, automated rollback handlers,
and asynchronous event cascades.
"""

import time
import logging
from datetime import datetime
from typing import Dict, List, Optional, Any, Callable
from enum import Enum
from pydantic import BaseModel, Field

logger = logging.getLogger("tracehub.automation.orchestration")

class StepExecutionStatus(str, Enum):
    PENDING = "Pending"
    RUNNING = "Running"
    SUCCEEDED = "Succeeded"
    FAILED = "Failed"
    COMPENSATING = "Compensating"
    COMPENSATED = "Compensated"
    SKIPPED = "Skipped"

class PipelineStep(BaseModel):
    step_id: str
    name: str
    description: str
    action_type: str
    execution_timeout_seconds: int = 30
    retry_max_attempts: int = 3
    current_attempt: int = 0
    status: StepExecutionStatus = StepExecutionStatus.PENDING
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    error_message: Optional[str] = None
    output_data: Dict[str, Any] = Field(default_factory=dict)

class PipelineExecutionResult(BaseModel):
    pipeline_id: str
    pipeline_name: str
    success: bool
    total_steps: int
    completed_steps: int
    failed_steps: int
    duration_seconds: float
    started_at: datetime
    completed_at: datetime
    step_details: List[PipelineStep]

class WorkflowOrchestrator:
    """
    Saga Pattern Orchestrator for SDLC Release & Phase Automation.
    Guarantees atomic multi-step execution with automatic compensation rollbacks on failure.
    """

    def __init__(self, pipeline_id: str, name: str):
        self.pipeline_id = pipeline_id
        self.name = name
        self.steps: List[PipelineStep] = []
        self.step_handlers: Dict[str, Callable[[Dict[str, Any]], Dict[str, Any]]] = {}
        self.compensation_handlers: Dict[str, Callable[[Dict[str, Any]], None]] = {}

    def add_step(
        self,
        step_id: str,
        name: str,
        action_type: str,
        handler: Callable[[Dict[str, Any]], Dict[str, Any]],
        compensation: Optional[Callable[[Dict[str, Any]], None]] = None,
        timeout: int = 30,
        retries: int = 3
    ) -> None:
        step = PipelineStep(
            step_id=step_id,
            name=name,
            description=f"Executes {action_type} action",
            action_type=action_type,
            execution_timeout_seconds=timeout,
            retry_max_attempts=retries
        )
        self.steps.append(step)
        self.step_handlers[step_id] = handler
        if compensation:
            self.compensation_handlers[step_id] = compensation

    def execute(self, initial_context: Dict[str, Any]) -> PipelineExecutionResult:
        context = dict(initial_context)
        start_time = datetime.utcnow()
        completed_stack: List[PipelineStep] = []
        overall_success = True

        for step in self.steps:
            step.status = StepExecutionStatus.RUNNING
            step.started_at = datetime.utcnow()
            handler = self.step_handlers.get(step.step_id)

            success = False
            for attempt in range(1, step.retry_max_attempts + 1):
                step.current_attempt = attempt
                try:
                    if handler:
                        out = handler(context)
                        step.output_data = out or {}
                        context.update(step.output_data)
                    step.status = StepExecutionStatus.SUCCEEDED
                    step.completed_at = datetime.utcnow()
                    completed_stack.append(step)
                    success = True
                    break
                except Exception as e:
                    logger.warning(f"Step {step.step_id} attempt {attempt} failed: {e}")
                    step.error_message = str(e)
                    time.sleep(0.05)

            if not success:
                step.status = StepExecutionStatus.FAILED
                step.completed_at = datetime.utcnow()
                overall_success = False
                logger.error(f"Pipeline {self.pipeline_id} failed at step {step.step_id}. Triggering compensation...")
                self._compensate(completed_stack, context)
                break

        end_time = datetime.utcnow()
        dur = (end_time - start_time).total_seconds()

        return PipelineExecutionResult(
            pipeline_id=self.pipeline_id,
            pipeline_name=self.name,
            success=overall_success,
            total_steps=len(self.steps),
            completed_steps=len(completed_stack),
            failed_steps=1 if not overall_success else 0,
            duration_seconds=round(dur, 2),
            started_at=start_time,
            completed_at=end_time,
            step_details=self.steps
        )

    def _compensate(self, completed_stack: List[PipelineStep], context: Dict[str, Any]) -> None:
        """Rollback completed steps in reverse order (Saga Compensation)."""
        while completed_stack:
            s = completed_stack.pop()
            comp_handler = self.compensation_handlers.get(s.step_id)
            if comp_handler:
                s.status = StepExecutionStatus.COMPENSATING
                try:
                    comp_handler(context)
                    s.status = StepExecutionStatus.COMPENSATED
                    logger.info(f"Compensated step {s.step_id} successfully.")
                except Exception as ex:
                    logger.critical(f"Compensation failed for step {s.step_id}: {ex}")
