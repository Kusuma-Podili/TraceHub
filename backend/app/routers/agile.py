from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Dict, Any, Optional
from datetime import date, datetime

from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.project import Project
from backend.app.models.task import Task
from backend.app.routers.auth import get_current_user
from backend.app.agile.sprint_manager import SprintManager, SprintCadence
from backend.app.agile.epic_tracker import EpicTracker, InitiativeTheme
from backend.app.agile.story_point_estimator import StoryPointEstimator, EstimatorVote
from backend.app.agile.backlog_prioritizer import BacklogPrioritizer, BacklogItem, PrioritizationFramework

router = APIRouter(prefix="/api/agile", tags=["agile"])

@router.get("/projects/{project_id}/sprints/current")
def get_current_sprint(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Retrieve or compute current active sprint telemetry for a project."""
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")

    tasks = db.query(Task).filter(Task.project_id == project_id).all()
    mgr = SprintManager(
        sprint_id=1,
        name=f"{project.code} Sprint 1",
        project_id=project_id,
        start_date=date.today(),
        end_date=date.today()
    )

    for t in tasks:
        mgr.commit_task(
            task_id=t.id,
            task_code=t.code or f"TSK-{t.id}",
            title=t.title,
            story_points=3.0,
            hours=t.estimated_hours or 8.0,
            assigned_to=t.assigned_to
        )

    return mgr.to_dict()

@router.post("/estimate/poker")
def calculate_planning_poker(
    votes: List[Dict[str, Any]],
    current_user: User = Depends(get_current_user)
):
    """Calculate statistical consensus for Planning Poker session."""
    estimator = StoryPointEstimator()
    vote_objs = [
        EstimatorVote(
            user_id=v.get("user_id", 0),
            user_name=v.get("user_name", "Anonymous"),
            role=v.get("role", "Developer"),
            voted_points=float(v.get("points", 1.0)),
            confidence_level=float(v.get("confidence", 0.8))
        )
        for v in votes
    ]
    res = estimator.calculate_fibonacci_consensus(vote_objs)
    return res.model_dump()

@router.post("/prioritize/wsjf")
def prioritize_backlog_wsjf(
    items: List[Dict[str, Any]],
    current_user: User = Depends(get_current_user)
):
    """Rank backlog items using SAFe Weighted Shortest Job First (WSJF) formula."""
    prioritizer = BacklogPrioritizer()
    backlog_items = [
        BacklogItem(
            item_id=it.get("id", i),
            item_type=it.get("type", "Task"),
            code=it.get("code", f"ITEM-{i}"),
            title=it.get("title", ""),
            user_business_value=float(it.get("business_value", 5.0)),
            time_criticality=float(it.get("time_criticality", 5.0)),
            risk_reduction_or_opportunity=float(it.get("risk_reduction", 5.0)),
            job_size_or_duration=float(it.get("job_size", 5.0))
        )
        for i, it in enumerate(items, 1)
    ]
    ranked = prioritizer.rank_backlog(backlog_items, PrioritizationFramework.WSJF)
    return [r.model_dump() for r in ranked]
