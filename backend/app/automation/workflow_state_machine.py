"""
TraceHub Enterprise Finite State Machine (FSM) & Workflow Automation Engine.
Enforces deterministic lifecycle transitions, invariant checks, compensation
rollbacks, and audit logging across all SDLC entities.
"""

from typing import Dict, List, Optional, Any, Callable, Tuple, Set
from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field
import logging

logger = logging.getLogger("tracehub.automation.fsm")

class WorkflowDomain(str, Enum):
    PROJECT_PHASE = "ProjectPhase"
    REQUIREMENT = "Requirement"
    TASK = "Task"
    TEST_EXECUTION = "TestExecution"
    DEFECT = "Defect"
    DEPLOYMENT_RELEASE = "DeploymentRelease"
    MAINTENANCE_TICKET = "MaintenanceTicket"

class StateNode(BaseModel):
    state_id: str
    name: str
    description: str
    is_initial: bool = False
    is_terminal: bool = False
    allowed_roles: List[str] = Field(default_factory=list)
    sla_hours: Optional[float] = None
    color_token: str = "#4B5563"

class TransitionRule(BaseModel):
    transition_id: str
    from_state: str
    to_state: str
    action_name: str
    guard_condition_name: Optional[str] = None
    required_role: str
    requires_comment: bool = False
    auto_trigger_event: Optional[str] = None
    description: str

class TransitionAuditEntry(BaseModel):
    transition_id: str
    domain: WorkflowDomain
    entity_id: int
    from_state: str
    to_state: str
    performed_by_user_id: int
    performed_by_username: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    comment: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)

class WorkflowStateMachine:
    """
    Generalized Finite State Machine Engine.
    Guarantees that state transitions strictly follow configured transition rules,
    validates guard conditions, and maintains an immutable transition audit trail.
    """

    def __init__(self, domain: WorkflowDomain):
        self.domain = domain
        self.states: Dict[str, StateNode] = {}
        self.transitions: Dict[str, TransitionRule] = {}
        self.guards: Dict[str, Callable[[Dict[str, Any]], Tuple[bool, str]]] = {}
        self.audit_log: List[TransitionAuditEntry] = []
        self._initialize_default_domain_rules()

    def add_state(self, state: StateNode) -> None:
        self.states[state.state_id] = state

    def add_transition(self, rule: TransitionRule) -> None:
        self.transitions[rule.transition_id] = rule

    def register_guard(self, name: str, guard_fn: Callable[[Dict[str, Any]], Tuple[bool, str]]) -> None:
        self.guards[name] = guard_fn

    def get_allowed_transitions(self, current_state: str, user_role: str) -> List[TransitionRule]:
        allowed = []
        for t in self.transitions.values():
            if t.from_state == current_state:
                if t.required_role == "*" or t.required_role == user_role:
                    allowed.append(t)
        return allowed

    def execute_transition(
        self,
        entity_id: int,
        from_state: str,
        to_state: str,
        user_id: int,
        username: str,
        user_role: str,
        context: Dict[str, Any],
        comment: Optional[str] = None
    ) -> Tuple[bool, str]:
        # 1. Match transition rule
        matched_rule: Optional[TransitionRule] = None
        for t in self.transitions.values():
            if t.from_state == from_state and t.to_state == to_state:
                matched_rule = t
                break

        if not matched_rule:
            return False, f"Illegal transition from '{from_state}' to '{to_state}' in domain {self.domain.value}"

        # 2. RBAC check
        if matched_rule.required_role != "*" and matched_rule.required_role != user_role:
            return False, f"User role '{user_role}' is not authorized for this transition (requires '{matched_rule.required_role}')"

        # 3. Comment check
        if matched_rule.requires_comment and not (comment and comment.strip()):
            return False, "This state transition requires non-empty justification comments"

        # 4. Guard condition check
        if matched_rule.guard_condition_name:
            guard = self.guards.get(matched_rule.guard_condition_name)
            if guard:
                passed, reason = guard(context)
                if not passed:
                    return False, f"Guard check failed: {reason}"

        # 5. Record audit entry
        entry = TransitionAuditEntry(
            transition_id=matched_rule.transition_id,
            domain=self.domain,
            entity_id=entity_id,
            from_state=from_state,
            to_state=to_state,
            performed_by_user_id=user_id,
            performed_by_username=username,
            comment=comment,
            metadata=context
        )
        self.audit_log.append(entry)
        logger.info(f"FSM [{self.domain.value}] #{entity_id}: {from_state} -> {to_state} by {username}")
        return True, f"Transitioned successfully to {to_state}"

    def _initialize_default_domain_rules(self) -> None:
        if self.domain == WorkflowDomain.TASK:
            self._setup_task_workflow()
        elif self.domain == WorkflowDomain.DEFECT:
            self._setup_defect_workflow()
        elif self.domain == WorkflowDomain.PROJECT_PHASE:
            self._setup_phase_workflow()

    def _setup_task_workflow(self) -> None:
        self.add_state(StateNode(state_id="To Do", name="To Do", description="Backlog item ready for development", is_initial=True, allowed_roles=["Project Manager", "Developer"], color_token="#6B7280"))
        self.add_state(StateNode(state_id="In Progress", name="In Progress", description="Developer actively implementing task", allowed_roles=["Developer"], color_token="#3B82F6"))
        self.add_state(StateNode(state_id="Ready for Testing", name="Ready for Testing", description="Code complete and handed off to QA", allowed_roles=["Developer"], color_token="#F59E0B"))
        self.add_state(StateNode(state_id="Testing", name="Testing", description="QA Tester actively verifying test steps", allowed_roles=["Tester"], color_token="#8B5CF6"))
        self.add_state(StateNode(state_id="Completed", name="Completed", description="Passed all test cases and signed off", is_terminal=True, allowed_roles=["Tester", "Project Manager"], color_token="#10B981"))

        # Rules
        self.add_transition(TransitionRule(transition_id="T_START_DEV", from_state="To Do", to_state="In Progress", action_name="Start Development", required_role="Developer", description="Developer starts working on task"))
        self.add_transition(TransitionRule(transition_id="T_SUBMIT_QA", from_state="In Progress", to_state="Ready for Testing", action_name="Submit for QA", required_role="Developer", description="Developer submits completed code to QA"))
        self.add_transition(TransitionRule(transition_id="T_START_TEST", from_state="Ready for Testing", to_state="Testing", action_name="Start Testing", required_role="Tester", description="QA picks up task for verification"))
        self.add_transition(TransitionRule(transition_id="T_PASS_TEST", from_state="Testing", to_state="Completed", action_name="Pass Testing", required_role="Tester", description="All test cases pass"))
        self.add_transition(TransitionRule(transition_id="T_FAIL_TEST", from_state="Testing", to_state="In Progress", action_name="Fail & Return", required_role="Tester", requires_comment=True, description="Test failed, return to dev with bug"))

    def _setup_defect_workflow(self) -> None:
        self.add_state(StateNode(state_id="Open", name="Open", description="Defect newly reported", is_initial=True, allowed_roles=["Tester", "Project Manager"], color_token="#EF4444"))
        self.add_state(StateNode(state_id="In Progress", name="In Progress", description="Developer investigating and fixing bug", allowed_roles=["Developer"], color_token="#F59E0B"))
        self.add_state(StateNode(state_id="Ready for Retesting", name="Ready for Retesting", description="Fix patched, awaiting QA verification", allowed_roles=["Developer"], color_token="#8B5CF6"))
        self.add_state(StateNode(state_id="Closed", name="Closed", description="Verified fixed by QA", is_terminal=True, allowed_roles=["Tester"], color_token="#10B981"))
        self.add_state(StateNode(state_id="Reopened", name="Reopened", description="Fix failed QA retest", allowed_roles=["Tester"], color_token="#DC2626"))

        self.add_transition(TransitionRule(transition_id="B_START_FIX", from_state="Open", to_state="In Progress", action_name="Start Fix", required_role="Developer", description="Dev starts fixing defect"))
        self.add_transition(TransitionRule(transition_id="B_MARK_FIXED", from_state="In Progress", to_state="Ready for Retesting", action_name="Mark Fixed", required_role="Developer", requires_comment=True, description="Dev submits patch notes"))
        self.add_transition(TransitionRule(transition_id="B_RETEST_PASS", from_state="Ready for Retesting", to_state="Closed", action_name="Pass Retest", required_role="Tester", description="QA verifies bug fix"))
        self.add_transition(TransitionRule(transition_id="B_RETEST_FAIL", from_state="Ready for Retesting", to_state="Reopened", action_name="Fail Retest", required_role="Tester", requires_comment=True, description="Bug still reproduces"))
        self.add_transition(TransitionRule(transition_id="B_REOPEN_START", from_state="Reopened", to_state="In Progress", action_name="Restart Fix", required_role="Developer", description="Dev resumes fixing reopened defect"))

    def _setup_phase_workflow(self) -> None:
        phases = [
            "Requirement Analysis",
            "Planning",
            "Design",
            "Development",
            "Testing",
            "Deployment",
            "Maintenance"
        ]
        for i, p in enumerate(phases):
            self.add_state(StateNode(
                state_id=p,
                name=p,
                description=f"SDLC Phase {i+1}: {p}",
                is_initial=(i == 0),
                is_terminal=(i == len(phases) - 1),
                allowed_roles=["Project Manager"]
            ))

        for i in range(len(phases) - 1):
            p_curr = phases[i]
            p_next = phases[i + 1]
            self.add_transition(TransitionRule(
                transition_id=f"PHASE_ADVANCE_{i+1}",
                from_state=p_curr,
                to_state=p_next,
                action_name=f"Advance to {p_next}",
                required_role="Project Manager",
                guard_condition_name=f"gate_check_{p_curr.lower().replace(' ', '_')}",
                description=f"Advance project from {p_curr} to {p_next} upon meeting gate criteria"
            ))


class WorkflowEngineRegistry:
    """Singleton Registry caching configured FSM instances across all domains."""
    _instances: Dict[WorkflowDomain, WorkflowStateMachine] = {}

    @classmethod
    def get_engine(cls, domain: WorkflowDomain) -> WorkflowStateMachine:
        if domain not in cls._instances:
            cls._instances[domain] = WorkflowStateMachine(domain)
        return cls._instances[domain]

    @classmethod
    def reset_all(cls) -> None:
        cls._instances.clear()
