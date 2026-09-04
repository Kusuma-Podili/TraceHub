import math
import logging
from datetime import datetime, date
from typing import Dict, List, Optional, Any, Tuple, Set
from enum import Enum
from pydantic import BaseModel, Field

logger = logging.getLogger("tracehub.agile.epic")

class EpicStatus(str, Enum):
    PROPOSED = "Proposed"
    IN_ANALYSIS = "In Analysis"
    COMMITTED = "Committed"
    IN_PROGRESS = "In Progress"
    VERIFICATION = "Verification"
    COMPLETED = "Completed"
    ARCHIVED = "Archived"

class InitiativeTheme(str, Enum):
    PERFORMANCE_AND_SCALABILITY = "Performance & Scalability"
    SECURITY_AND_COMPLIANCE = "Security & Compliance"
    USER_EXPERIENCE_AND_DESIGN = "User Experience & Design"
    CLOUD_INFRASTRUCTURE = "Cloud Infrastructure"
    CORE_PLATFORM_ENGINE = "Core Platform Engine"
    BUSINESS_OPERATIONS = "Business Operations"

class MilestoneMarker(BaseModel):
    milestone_id: str
    name: str
    target_date: date
    is_hard_deadline: bool = False
    achieved: bool = False
    achieved_at: Optional[datetime] = None
    criteria: List[str] = Field(default_factory=list)

class EpicHierarchyNode(BaseModel):
    epic_id: int
    epic_code: str
    title: str
    description: str
    theme: InitiativeTheme
    business_value_score: int = Field(default=50, ge=1, le=100)
    risk_level: str = "Medium"
    owner_user_id: Optional[int] = None
    status: EpicStatus = EpicStatus.PROPOSED
    target_release: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    linked_requirements: List[int] = Field(default_factory=list)
    linked_tasks: List[int] = Field(default_factory=list)
    child_epic_ids: List[int] = Field(default_factory=list)
    parent_epic_id: Optional[int] = None
    tags: List[str] = Field(default_factory=list)
    budget_allocated_usd: float = 0.0
    budget_spent_usd: float = 0.0

class EpicProgressRollup(BaseModel):
    epic_id: int
    epic_code: str
    total_requirements: int = 0
    approved_requirements: int = 0
    total_tasks: int = 0
    completed_tasks: int = 0
    in_progress_tasks: int = 0
    blocked_tasks: int = 0
    total_story_points: float = 0.0
    completed_story_points: float = 0.0
    progress_percent: float = 0.0
    health_status: str = "Healthy"
    projected_completion_date: Optional[date] = None

class EpicTracker:
    """
    Enterprise Epic Portfolio and Strategic Roadmapping Subsystem.
    Rolls up delivery telemetry from tasks and requirements into high-level business epics.
    """

    def __init__(self, project_id: int, project_code: str):
        self.project_id = project_id
        self.project_code = project_code
        self.epics: Dict[int, EpicHierarchyNode] = {}
        self.milestones: Dict[str, MilestoneMarker] = {}
        self.task_cache: Dict[int, Dict[str, Any]] = {}
        self.req_cache: Dict[int, Dict[str, Any]] = {}

    def create_epic(
        self,
        epic_id: int,
        title: str,
        theme: InitiativeTheme = InitiativeTheme.CORE_PLATFORM_ENGINE,
        description: str = "",
        business_value: int = 50,
        risk_level: str = "Medium",
        owner_id: Optional[int] = None,
        parent_id: Optional[int] = None,
        target_release: Optional[str] = None
    ) -> EpicHierarchyNode:
        seq = len(self.epics) + 1
        code = f"EPIC-{self.project_code}-{seq:03d}"
        node = EpicHierarchyNode(
            epic_id=epic_id,
            epic_code=code,
            title=title,
            description=description,
            theme=theme,
            business_value_score=business_value,
            risk_level=risk_level,
            owner_user_id=owner_id,
            parent_epic_id=parent_id,
            target_release=target_release
        )
        self.epics[epic_id] = node
        if parent_id and parent_id in self.epics:
            self.epics[parent_id].child_epic_ids.append(epic_id)
        logger.info(f"Created Epic {code}: {title}")
        return node

    def link_requirement(self, epic_id: int, requirement_id: int, req_data: Optional[Dict[str, Any]] = None) -> bool:
        if epic_id not in self.epics:
            return False
        if requirement_id not in self.epics[epic_id].linked_requirements:
            self.epics[epic_id].linked_requirements.append(requirement_id)
        if req_data:
            self.req_cache[requirement_id] = req_data
        return True

    def link_task(self, epic_id: int, task_id: int, task_data: Optional[Dict[str, Any]] = None) -> bool:
        if epic_id not in self.epics:
            return False
        if task_id not in self.epics[epic_id].linked_tasks:
            self.epics[epic_id].linked_tasks.append(task_id)
        if task_data:
            self.task_cache[task_id] = task_data
        return True

    def transition_status(self, epic_id: int, new_status: EpicStatus) -> Tuple[bool, str]:
        if epic_id not in self.epics:
            return False, "Epic not found"
        epic = self.epics[epic_id]
        prev = epic.status
        epic.status = new_status
        if new_status == EpicStatus.IN_PROGRESS and not epic.started_at:
            epic.started_at = datetime.utcnow()
        elif new_status == EpicStatus.COMPLETED:
            epic.completed_at = datetime.utcnow()
        logger.info(f"Epic {epic.epic_code} transition: {prev.value} -> {new_status.value}")
        return True, f"Status updated to {new_status.value}"

    def calculate_rollup(self, epic_id: int) -> Optional[EpicProgressRollup]:
        if epic_id not in self.epics:
            return None
        epic = self.epics[epic_id]

        total_reqs = len(epic.linked_requirements)
        approved_reqs = sum(
            1 for rid in epic.linked_requirements
            if self.req_cache.get(rid, {}).get("status") in ["Approved", "Implemented", "Verified"]
        )

        total_tasks = len(epic.linked_tasks)
        done_tasks = sum(
            1 for tid in epic.linked_tasks
            if self.task_cache.get(tid, {}).get("status") in ["Completed", "Passed"]
        )
        in_prog_tasks = sum(
            1 for tid in epic.linked_tasks
            if self.task_cache.get(tid, {}).get("status") in ["In Progress", "Testing", "Ready for Testing"]
        )
        blocked_tasks = sum(
            1 for tid in epic.linked_tasks
            if self.task_cache.get(tid, {}).get("is_blocked", False)
        )

        total_pts = sum(float(self.task_cache.get(tid, {}).get("story_points", 1.0)) for tid in epic.linked_tasks)
        done_pts = sum(
            float(self.task_cache.get(tid, {}).get("story_points", 1.0))
            for tid in epic.linked_tasks
            if self.task_cache.get(tid, {}).get("status") in ["Completed", "Passed"]
        )

        progress = (done_pts / total_pts * 100.0) if total_pts > 0 else (
            (done_tasks / total_tasks * 100.0) if total_tasks > 0 else 0.0
        )

        # Health calculation
        health = "Healthy"
        if blocked_tasks > 0 or (progress < 25.0 and epic.status == EpicStatus.IN_PROGRESS):
            health = "At Risk"
        if blocked_tasks > (total_tasks * 0.3) or progress == 0.0 and epic.status == EpicStatus.IN_PROGRESS:
            health = "Critical"

        return EpicProgressRollup(
            epic_id=epic.epic_id,
            epic_code=epic.epic_code,
            total_requirements=total_reqs,
            approved_requirements=approved_reqs,
            total_tasks=total_tasks,
            completed_tasks=done_tasks,
            in_progress_tasks=in_prog_tasks,
            blocked_tasks=blocked_tasks,
            total_story_points=round(total_pts, 2),
            completed_story_points=round(done_pts, 2),
            progress_percent=round(progress, 2),
            health_status=health
        )

    def get_portfolio_summary(self) -> Dict[str, Any]:
        rollups = [self.calculate_rollup(eid) for eid in self.epics]
        valid_rollups = [r for r in rollups if r is not None]

        total_pts = sum(r.total_story_points for r in valid_rollups)
        done_pts = sum(r.completed_story_points for r in valid_rollups)
        overall_progress = (done_pts / total_pts * 100.0) if total_pts > 0 else 0.0

        theme_counts = {}
        for ep in self.epics.values():
            theme_counts[ep.theme.value] = theme_counts.get(ep.theme.value, 0) + 1

        return {
            "project_id": self.project_id,
            "project_code": self.project_code,
            "total_epics": len(self.epics),
            "completed_epics": sum(1 for ep in self.epics.values() if ep.status == EpicStatus.COMPLETED),
            "in_progress_epics": sum(1 for ep in self.epics.values() if ep.status == EpicStatus.IN_PROGRESS),
            "overall_points_committed": round(total_pts, 2),
            "overall_points_delivered": round(done_pts, 2),
            "overall_portfolio_progress_percent": round(overall_progress, 2),
            "themes_distribution": theme_counts,
            "rollups": [r.model_dump() for r in valid_rollups]
        }
