import math
import logging
from datetime import datetime, date, timedelta
from typing import Dict, List, Optional, Any, Tuple, Union
from enum import Enum
from pydantic import BaseModel, Field

logger = logging.getLogger("tracehub.agile.sprint")

class SprintStatus(str, Enum):
    PLANNING = "Planning"
    ACTIVE = "Active"
    REVIEW = "Review"
    RETROSPECTIVE = "Retrospective"
    COMPLETED = "Completed"
    CANCELLED = "Cancelled"

class SprintCadence(str, Enum):
    ONE_WEEK = "1_Week"
    TWO_WEEKS = "2_Weeks"
    THREE_WEEKS = "3_Weeks"
    FOUR_WEEKS = "4_Weeks"
    CUSTOM = "Custom"

class CommitmentHealth(str, Enum):
    ON_TRACK = "On Track"
    AT_RISK = "At Risk"
    OFF_TRACK = "Off Track"
    CRITICAL = "Critical"

class TaskCommitment(BaseModel):
    task_id: int
    task_code: str
    title: str
    story_points: float = Field(default=1.0, ge=0.0)
    original_estimate_hours: float = Field(default=8.0, ge=0.0)
    remaining_hours: float = Field(default=8.0, ge=0.0)
    completed_hours: float = Field(default=0.0, ge=0.0)
    assigned_user_id: Optional[int] = None
    status: str = "To Do"
    is_completed: bool = False
    added_after_start: bool = False
    completed_at: Optional[datetime] = None

class TeamCapacityMember(BaseModel):
    user_id: int
    user_name: str
    role: str
    daily_available_hours: float = 6.0
    days_off_count: int = 0
    focus_factor: float = 0.8  # Real productivity multiplier
    allocated_points: float = 0.0

    @property
    def net_working_days(self, sprint_working_days: int = 10) -> int:
        return max(0, sprint_working_days - self.days_off_count)

    def total_capacity_hours(self, sprint_working_days: int = 10) -> float:
        return self.net_working_days * self.daily_available_hours * self.focus_factor

class SprintMetrics(BaseModel):
    total_committed_points: float = 0.0
    completed_points: float = 0.0
    incomplete_points: float = 0.0
    scope_change_points: float = 0.0
    completion_rate_percent: float = 0.0
    velocity: float = 0.0
    planned_hours: float = 0.0
    actual_hours: float = 0.0
    effort_variance_percent: float = 0.0
    health: CommitmentHealth = CommitmentHealth.ON_TRACK
    days_remaining: int = 0
    working_days_elapsed: int = 0
    ideal_daily_burn_rate: float = 0.0
    actual_daily_burn_rate: float = 0.0

class SprintManager:
    """
    Comprehensive Enterprise Sprint Governance Engine.
    Handles sprint lifecycle state transitions, velocity moving averages,
    team capacity budgeting, scope churn tracking, and backlog rollover policies.
    """

    def __init__(self, sprint_id: int, name: str, project_id: int, start_date: date, end_date: date):
        self.sprint_id = sprint_id
        self.name = name
        self.project_id = project_id
        self.start_date = start_date
        self.end_date = end_date
        self.status = SprintStatus.PLANNING
        self.goal: str = ""
        self.tasks: Dict[int, TaskCommitment] = {}
        self.team_members: Dict[int, TeamCapacityMember] = {}
        self.daily_snapshots: List[Dict[str, Any]] = []
        self.history_log: List[Dict[str, Any]] = []
        self.created_at = datetime.utcnow()
        self.started_at: Optional[datetime] = None
        self.completed_at: Optional[datetime] = None

    @property
    def duration_days(self) -> int:
        delta = (self.end_date - self.start_date).days + 1
        return max(1, delta)

    @property
    def working_days_count(self) -> int:
        """Count business days excluding weekends (Monday-Friday)."""
        cur = self.start_date
        count = 0
        while cur <= self.end_date:
            if cur.weekday() < 5:
                count += 1
            cur += timedelta(days=1)
        return max(1, count)

    def set_goal(self, goal: str) -> None:
        self.goal = goal.strip()
        self._record_event("GOAL_UPDATED", {"goal": self.goal})

    def add_team_member(self, user_id: int, name: str, role: str, daily_hours: float = 6.0, focus: float = 0.8) -> None:
        member = TeamCapacityMember(
            user_id=user_id,
            user_name=name,
            role=role,
            daily_available_hours=daily_hours,
            focus_factor=focus
        )
        self.team_members[user_id] = member
        self._record_event("MEMBER_ADDED", {"user_id": user_id, "name": name, "role": role})

    def remove_team_member(self, user_id: int) -> bool:
        if user_id in self.team_members:
            del self.team_members[user_id]
            self._record_event("MEMBER_REMOVED", {"user_id": user_id})
            return True
        return False

    def get_total_team_capacity_hours(self) -> float:
        working_days = self.working_days_count
        return sum(m.total_capacity_hours(working_days) for m in self.team_members.values())

    def commit_task(self, task_id: int, task_code: str, title: str, story_points: float, hours: float, assigned_to: Optional[int] = None) -> TaskCommitment:
        is_late = (self.status == SprintStatus.ACTIVE)
        task = TaskCommitment(
            task_id=task_id,
            task_code=task_code,
            title=title,
            story_points=max(0.0, story_points),
            original_estimate_hours=max(0.0, hours),
            remaining_hours=max(0.0, hours),
            assigned_user_id=assigned_to,
            added_after_start=is_late
        )
        self.tasks[task_id] = task

        if assigned_to and assigned_to in self.team_members:
            self.team_members[assigned_to].allocated_points += story_points

        self._record_event("TASK_COMMITTED", {
            "task_id": task_id,
            "code": task_code,
            "points": story_points,
            "added_after_start": is_late
        })
        return task

    def remove_task(self, task_id: int) -> bool:
        if task_id in self.tasks:
            t = self.tasks.pop(task_id)
            if t.assigned_user_id and t.assigned_user_id in self.team_members:
                self.team_members[t.assigned_user_id].allocated_points -= t.story_points
            self._record_event("TASK_REMOVED", {"task_id": task_id, "points": t.story_points})
            return True
        return False

    def start_sprint(self) -> Tuple[bool, str]:
        if self.status != SprintStatus.PLANNING:
            return False, f"Cannot start sprint in status {self.status.value}"
        if not self.tasks:
            return False, "Cannot start sprint with empty backlog commitment"

        self.status = SprintStatus.ACTIVE
        self.started_at = datetime.utcnow()
        self._record_event("SPRINT_STARTED", {
            "tasks_count": len(self.tasks),
            "total_points": sum(t.story_points for t in self.tasks.values()),
            "capacity_hours": self.get_total_team_capacity_hours()
        })
        return True, "Sprint started successfully"

    def update_task_progress(self, task_id: int, remaining_hours: float, completed_hours: float, is_completed: bool, status: str) -> bool:
        if task_id not in self.tasks:
            return False
        task = self.tasks[task_id]
        task.remaining_hours = max(0.0, remaining_hours)
        task.completed_hours = max(0.0, completed_hours)
        task.is_completed = is_completed
        task.status = status
        if is_completed and not task.completed_at:
            task.completed_at = datetime.utcnow()
        elif not is_completed:
            task.completed_at = None

        self._record_event("TASK_PROGRESS_UPDATED", {
            "task_id": task_id,
            "remaining": remaining_hours,
            "completed": completed_hours,
            "is_completed": is_completed,
            "status": status
        })
        return True

    def calculate_metrics(self, current_eval_date: Optional[date] = None) -> SprintMetrics:
        if current_eval_date is None:
            current_eval_date = date.today()

        total_pts = sum(t.story_points for t in self.tasks.values())
        done_pts = sum(t.story_points for t in self.tasks.values() if t.is_completed)
        incomplete_pts = total_pts - done_pts
        scope_change_pts = sum(t.story_points for t in self.tasks.values() if t.added_after_start)

        planned_hrs = sum(t.original_estimate_hours for t in self.tasks.values())
        actual_hrs = sum(t.completed_hours for t in self.tasks.values())

        rate = (done_pts / total_pts * 100.0) if total_pts > 0 else 0.0
        variance = ((actual_hrs - planned_hrs) / planned_hrs * 100.0) if planned_hrs > 0 else 0.0

        # Remaining business days
        days_rem = 0
        cur = current_eval_date
        while cur <= self.end_date:
            if cur.weekday() < 5:
                days_rem += 1
            cur += timedelta(days=1)

        # Elapsed business days
        elapsed = 0
        cur = self.start_date
        while cur < current_eval_date and cur <= self.end_date:
            if cur.weekday() < 5:
                elapsed += 1
            cur += timedelta(days=1)

        total_work_days = self.working_days_count
        ideal_burn = total_pts / total_work_days if total_work_days > 0 else 0.0
        actual_burn = done_pts / elapsed if elapsed > 0 else 0.0

        # Health determination
        expected_pts = ideal_burn * elapsed
        lag = expected_pts - done_pts
        if lag <= 0:
            health = CommitmentHealth.ON_TRACK
        elif lag < (total_pts * 0.15):
            health = CommitmentHealth.AT_RISK
        elif lag < (total_pts * 0.35):
            health = CommitmentHealth.OFF_TRACK
        else:
            health = CommitmentHealth.CRITICAL

        return SprintMetrics(
            total_committed_points=round(total_pts, 2),
            completed_points=round(done_pts, 2),
            incomplete_points=round(incomplete_pts, 2),
            scope_change_points=round(scope_change_pts, 2),
            completion_rate_percent=round(rate, 2),
            velocity=round(done_pts, 2),
            planned_hours=round(planned_hrs, 2),
            actual_hours=round(actual_hrs, 2),
            effort_variance_percent=round(variance, 2),
            health=health,
            days_remaining=days_rem,
            working_days_elapsed=elapsed,
            ideal_daily_burn_rate=round(ideal_burn, 2),
            actual_daily_burn_rate=round(actual_burn, 2)
        )

    def close_sprint(self, next_sprint_id: Optional[int] = None) -> Dict[str, Any]:
        """Concludes active sprint, generates retrospective analytics and identifies rollover tasks."""
        self.status = SprintStatus.COMPLETED
        self.completed_at = datetime.utcnow()
        metrics = self.calculate_metrics(self.end_date)

        rollover_tasks = [
            {
                "task_id": t.task_id,
                "code": t.task_code,
                "title": t.title,
                "story_points": t.story_points,
                "remaining_hours": t.remaining_hours,
                "status": t.status
            }
            for t in self.tasks.values() if not t.is_completed
        ]

        summary = {
            "sprint_id": self.sprint_id,
            "name": self.name,
            "metrics": metrics.model_dump(),
            "completed_tasks_count": len([t for t in self.tasks.values() if t.is_completed]),
            "rollover_tasks_count": len(rollover_tasks),
            "rollover_tasks": rollover_tasks,
            "target_next_sprint_id": next_sprint_id,
            "closed_at": self.completed_at.isoformat()
        }
        self._record_event("SPRINT_CLOSED", summary)
        return summary

    def _record_event(self, action: str, data: Dict[str, Any]) -> None:
        self.history_log.append({
            "timestamp": datetime.utcnow().isoformat(),
            "action": action,
            "data": data
        })

    def to_dict(self) -> Dict[str, Any]:
        return {
            "sprint_id": self.sprint_id,
            "name": self.name,
            "project_id": self.project_id,
            "goal": self.goal,
            "status": self.status.value,
            "start_date": self.start_date.isoformat(),
            "end_date": self.end_date.isoformat(),
            "duration_days": self.duration_days,
            "working_days": self.working_days_count,
            "team_capacity_hours": self.get_total_team_capacity_hours(),
            "tasks_count": len(self.tasks),
            "members_count": len(self.team_members),
            "metrics": self.calculate_metrics().model_dump()
        }
