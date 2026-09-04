from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.project import Project, ProjectMember, SDLCPhase
from backend.app.models.requirement import Requirement
from backend.app.models.task import Task
from backend.app.models.test_case import TestCase
from backend.app.models.bug import Bug
from backend.app.models.deployment import Deployment
from backend.app.services.auth_service import get_current_user
from backend.app.services.progress_service import get_pm_dashboard_metrics

router = APIRouter(prefix="/api/reports", tags=["Reports"])

@router.get("/pm-dashboard")
def pm_dashboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_pm_dashboard_metrics(db)

@router.get("/dev-dashboard")
def dev_dashboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    user_id = current_user.id
    assigned_tasks = db.query(Task).filter(Task.assigned_to_id == user_id).all()
    active_tasks = [t for t in assigned_tasks if t.status == "In Progress"]
    completed_tasks = [t for t in assigned_tasks if t.status == "Completed"]
    pending_reviews = [t for t in assigned_tasks if t.status == "Review"]

    assigned_reqs = db.query(Requirement).filter(Requirement.assigned_to_id == user_id).all()
    assigned_bugs = db.query(Bug).filter(Bug.assigned_to_id == user_id).all()
    open_bugs = [b for b in assigned_bugs if b.status in ["Open", "Assigned", "In Progress", "Reopened"]]

    # Assigned projects
    member_projects = db.query(Project).join(ProjectMember).filter(ProjectMember.user_id == user_id).all()

    return {
        "total_assigned_tasks": len(assigned_tasks),
        "active_tasks_count": len(active_tasks),
        "completed_tasks_count": len(completed_tasks),
        "pending_reviews_count": len(pending_reviews),
        "assigned_requirements_count": len(assigned_reqs),
        "assigned_bugs_count": len(open_bugs),
        "active_tasks": [t.to_dict() for t in active_tasks],
        "pending_reviews": [t.to_dict() for t in pending_reviews],
        "assigned_bugs": [b.to_dict() for b in open_bugs],
        "assigned_requirements": [r.to_dict() for r in assigned_reqs],
        "my_projects": [p.to_dict() for p in member_projects]
    }

@router.get("/qa-dashboard")
def qa_dashboard(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    total_tests = db.query(TestCase).count()
    passed = db.query(TestCase).filter(TestCase.status == "Passed").count()
    failed = db.query(TestCase).filter(TestCase.status == "Failed").count()
    blocked = db.query(TestCase).filter(TestCase.status == "Blocked").count()
    unexecuted = db.query(TestCase).filter(TestCase.status == "Not Executed").count()

    tasks_ready = db.query(Task).filter(Task.status.in_(["Ready for Testing", "Testing"])).all()
    retesting_bugs = db.query(Bug).filter(Bug.status.in_(["Ready for Retesting", "Fixed", "Retesting"])).all()
    reported_bugs = db.query(Bug).filter(Bug.reported_by_id == current_user.id).all()

    # Recent test cases
    recent_cases = db.query(TestCase).order_by(TestCase.created_at.desc()).limit(10).all()

    pass_rate = round((passed / total_tests) * 100.0, 1) if total_tests > 0 else 0.0

    return {
        "total_tests": total_tests,
        "passed_tests": passed,
        "failed_tests": failed,
        "blocked_tests": blocked,
        "unexecuted_tests": unexecuted,
        "pass_rate_percent": pass_rate,
        "ready_testing_tasks_count": len(tasks_ready),
        "tasks_ready_for_testing": [t.to_dict() for t in tasks_ready],
        "retesting_queue_count": len(retesting_bugs),
        "retesting_bugs": [b.to_dict() for b in retesting_bugs],
        "reported_bugs_count": len(reported_bugs),
        "recent_test_cases": [tc.to_dict() for tc in recent_cases]
    }

@router.get("/custom")
def get_custom_report(
    report_type: str = "progress",
    project_id: Optional[int] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    team_member_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Generate dynamic reports with multi-criteria filtering."""
    if report_type == "progress":
        q = db.query(Project)
        if project_id:
            q = q.filter(Project.id == project_id)
        if status:
            q = q.filter(Project.status == status)
        if priority:
            q = q.filter(Project.priority == priority)
        data = [p.to_dict() for p in q.all()]
        return {"report_type": report_type, "count": len(data), "data": data}

    elif report_type == "requirements":
        q = db.query(Requirement)
        if project_id:
            q = q.filter(Requirement.project_id == project_id)
        if status:
            q = q.filter(Requirement.status == status)
        if priority:
            q = q.filter(Requirement.priority == priority)
        if team_member_id:
            q = q.filter(Requirement.assigned_to_id == team_member_id)
        data = [r.to_dict() for r in q.all()]
        return {"report_type": report_type, "count": len(data), "data": data}

    elif report_type == "tasks":
        q = db.query(Task)
        if project_id:
            q = q.filter(Task.project_id == project_id)
        if status:
            q = q.filter(Task.status == status)
        if priority:
            q = q.filter(Task.priority == priority)
        if team_member_id:
            q = q.filter(Task.assigned_to_id == team_member_id)
        data = [t.to_dict() for t in q.all()]
        return {"report_type": report_type, "count": len(data), "data": data}

    elif report_type == "testing":
        q = db.query(TestCase)
        if project_id:
            q = q.filter(TestCase.project_id == project_id)
        if status:
            q = q.filter(TestCase.status == status)
        if priority:
            q = q.filter(TestCase.priority == priority)
        data = [tc.to_dict() for tc in q.all()]
        return {"report_type": report_type, "count": len(data), "data": data}

    elif report_type == "bugs":
        q = db.query(Bug)
        if project_id:
            q = q.filter(Bug.project_id == project_id)
        if status:
            q = q.filter(Bug.status == status)
        if priority:
            q = q.filter(Bug.priority == priority)
        if team_member_id:
            q = q.filter(Bug.assigned_to_id == team_member_id)
        data = [b.to_dict() for b in q.all()]
        return {"report_type": report_type, "count": len(data), "data": data}

    elif report_type == "deployments":
        q = db.query(Deployment)
        if project_id:
            q = q.filter(Deployment.project_id == project_id)
        if status:
            q = q.filter(Deployment.status == status)
        data = [d.to_dict() for d in q.all()]
        return {"report_type": report_type, "count": len(data), "data": data}

    elif report_type == "phases":
        q = db.query(SDLCPhase)
        if project_id:
            q = q.filter(SDLCPhase.project_id == project_id)
        if status:
            q = q.filter(SDLCPhase.status == status)
        data = [p.to_dict() for p in q.all()]
        return {"report_type": report_type, "count": len(data), "data": data}

    raise HTTPException(status_code=400, detail=f"Unsupported report type: {report_type}")


@router.get("/export/csv")
def export_projects_report_csv(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Export project portfolio deliverables and progress metrics to CSV format."""
    import csv
    import io
    from fastapi.responses import Response

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Project ID", "Code", "Name", "Current Phase", "Progress (%)", "Status"])

    projects = db.query(Project).all()
    for p in projects:
        writer.writerow([p.id, p.code, p.name, p.current_phase, p.progress_percent, p.status])

    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=tracehub_projects_report.csv"}
    )
