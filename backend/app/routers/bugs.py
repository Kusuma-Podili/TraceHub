from typing import Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.project import Project, ProjectMember
from backend.app.models.bug import Bug
from backend.app.models.task import Task
from backend.app.models.notification import ActivityLog, Notification
from backend.app.schemas.bug import BugCreate, BugUpdate, BugFixSubmit, BugRetestSubmit
from backend.app.services.auth_service import get_current_user, require_role
from backend.app.services.progress_service import recalculate_project_progress

router = APIRouter(prefix="/api/bugs", tags=["Bugs"])

VALID_BUG_STATUSES = [
    "Open",
    "Assigned",
    "In Progress",
    "Fixed",
    "Ready for Retesting",
    "Closed",
    "Reopened"
]

@router.get("")
def get_bugs(
    project_id: Optional[int] = None,
    status: Optional[str] = None,
    severity: Optional[str] = None,
    priority: Optional[str] = None,
    assigned_to_id: Optional[int] = None,
    ready_for_retest: Optional[bool] = None,
    my_bugs: Optional[bool] = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Bug)

    if my_bugs or (current_user.role == "Developer" and not project_id and not ready_for_retest):
        if my_bugs:
            query = query.filter(Bug.assigned_to_id == current_user.id)
        else:
            member_proj_ids = [m.project_id for m in db.query(ProjectMember).filter(ProjectMember.user_id == current_user.id).all()]
            query = query.filter(Bug.project_id.in_(member_proj_ids))
    elif current_user.role == "Tester" and not project_id and not ready_for_retest:
        member_proj_ids = [m.project_id for m in db.query(ProjectMember).filter(ProjectMember.user_id == current_user.id).all()]
        query = query.filter(Bug.project_id.in_(member_proj_ids))

    if project_id:
        query = query.filter(Bug.project_id == project_id)
    if status:
        query = query.filter(Bug.status == status)
    if ready_for_retest:
        query = query.filter(Bug.status.in_(["Ready for Retesting", "Fixed"]))
    if severity:
        query = query.filter(Bug.severity == severity)
    if priority:
        query = query.filter(Bug.priority == priority)
    if assigned_to_id:
        query = query.filter(Bug.assigned_to_id == assigned_to_id)

    bugs = query.order_by(Bug.created_date.desc()).all()
    return [b.to_dict() for b in bugs]

@router.post("", status_code=status.HTTP_201_CREATED)
def report_bug(
    data: BugCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == data.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")

    count = db.query(Bug).filter(Bug.project_id == project.id).count() + 1
    bug_code = f"BUG-{project.code}-{count:03d}"

    bug = Bug(
        bug_code=bug_code,
        title=data.title.strip(),
        description=data.description.strip(),
        project_id=project.id,
        requirement_id=data.requirement_id,
        test_case_id=data.test_case_id,
        task_id=data.task_id,
        severity=data.severity,
        priority=data.priority,
        status="Assigned" if data.assigned_to_id else "Open",
        assigned_to_id=data.assigned_to_id,
        reported_by_id=current_user.id,
        due_date=data.due_date
    )
    db.add(bug)

    # If linked to task, update task's testing status to Failed
    if data.task_id:
        task = db.query(Task).filter(Task.id == data.task_id).first()
        if task:
            task.testing_status = "Failed"
            task.status = "Testing Failed"

    db.add(ActivityLog(
        project_id=project.id,
        user_id=current_user.id,
        action_type="bug_reported",
        description=f"Defect '{bug.bug_code}: {bug.title}' ({bug.severity} severity) reported by {current_user.full_name}."
    ))

    # Notify developer
    if data.assigned_to_id:
        db.add(Notification(
            user_id=data.assigned_to_id,
            title="New Defect Assigned",
            message=f"{current_user.full_name} assigned {bug.severity} defect '{bug.title}' ({bug.bug_code}) to you.",
            type="warning" if bug.severity in ["High", "Critical"] else "info",
            link="#bugs"
        ))

    db.commit()
    db.refresh(bug)
    recalculate_project_progress(db, project.id)
    return bug.to_dict()

@router.get("/{bug_id}")
def get_bug(bug_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    bug = db.query(Bug).filter(Bug.id == bug_id).first()
    if not bug:
        raise HTTPException(status_code=404, detail="Bug not found.")
    return bug.to_dict()

# --- DEVELOPER DEFECT WORKFLOW ---

@router.post("/{bug_id}/start-fix")
def start_bug_fix(bug_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    bug = db.query(Bug).filter(Bug.id == bug_id).first()
    if not bug:
        raise HTTPException(status_code=404, detail="Bug not found.")

    bug.status = "In Progress"
    if not bug.assigned_to_id:
        bug.assigned_to_id = current_user.id

    db.add(ActivityLog(
        project_id=bug.project_id,
        user_id=current_user.id,
        action_type="bug_fix_started",
        description=f"{current_user.full_name} started fixing defect '{bug.bug_code}: {bug.title}'."
    ))

    db.commit()
    db.refresh(bug)
    return {"message": "Bug fix started.", "bug": bug.to_dict()}

@router.post("/{bug_id}/mark-fixed")
def mark_bug_fixed(bug_id: int, data: BugFixSubmit, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    bug = db.query(Bug).filter(Bug.id == bug_id).first()
    if not bug:
        raise HTTPException(status_code=404, detail="Bug not found.")

    # Validation: A developer cannot close a bug directly!
    # Status becomes Ready for Retesting
    bug.status = "Ready for Retesting"
    bug.resolution_notes = data.resolution_notes.strip()

    db.add(ActivityLog(
        project_id=bug.project_id,
        user_id=current_user.id,
        action_type="bug_fixed",
        description=f"Defect '{bug.bug_code}' fixed by {current_user.full_name}. Notes: {data.resolution_notes[:100]}"
    ))

    # Notify reporter (Tester)
    if bug.reported_by_id:
        db.add(Notification(
            user_id=bug.reported_by_id,
            title="Defect Ready for Retesting",
            message=f"{current_user.full_name} has resolved defect '{bug.title}' ({bug.bug_code}). Please retest.",
            type="success",
            link="#testing"
        ))

    db.commit()
    db.refresh(bug)
    recalculate_project_progress(db, bug.project_id)
    return {"message": "Defect marked as fixed and sent to QA for Retesting.", "bug": bug.to_dict()}

# --- TESTER RETEST WORKFLOW ---

@router.post("/{bug_id}/retest")
def retest_bug(bug_id: int, data: BugRetestSubmit, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    bug = db.query(Bug).filter(Bug.id == bug_id).first()
    if not bug:
        raise HTTPException(status_code=404, detail="Bug not found.")

    # Validation: Tester cannot close a bug without retesting it
    if bug.status not in ["Ready for Retesting", "Fixed"]:
        raise HTTPException(
            status_code=400,
            detail=f"Workflow validation error: Cannot retest bug in status '{bug.status}'. Bug must be 'Ready for Retesting'."
        )

    if data.passed:
        bug.status = "Closed"
        action = "bug_closed"
        desc = f"Defect '{bug.bug_code}' verified and CLOSED by {current_user.full_name}. Retest proof: {data.retest_notes}"
        notif_msg = f"Defect '{bug.title}' ({bug.bug_code}) passed QA verification and is CLOSED."
        notif_type = "success"

        # If linked to task and all other bugs for this task are closed, mark task testing passed
        if bug.task_id:
            task = db.query(Task).filter(Task.id == bug.task_id).first()
            if task:
                other_open_bugs = db.query(Bug).filter(
                    Bug.task_id == task.id,
                    Bug.id != bug.id,
                    Bug.status.in_(["Open", "Assigned", "In Progress", "Reopened"])
                ).count()
                if other_open_bugs == 0:
                    task.testing_status = "Passed"
                    task.status = "Completed"
                    task.progress_percent = 100.0
    else:
        bug.status = "Reopened"
        action = "bug_reopened"
        desc = f"Defect '{bug.bug_code}' failed retest and REOPENED by {current_user.full_name}. Reason: {data.retest_notes}"
        notif_msg = f"Defect '{bug.title}' ({bug.bug_code}) failed QA retest and has been REOPENED: {data.retest_notes}"
        notif_type = "alert"

        if bug.task_id:
            task = db.query(Task).filter(Task.id == bug.task_id).first()
            if task:
                task.testing_status = "Failed"
                task.status = "Testing Failed"

    db.add(ActivityLog(
        project_id=bug.project_id,
        user_id=current_user.id,
        action_type=action,
        description=desc
    ))

    # Notify developer
    if bug.assigned_to_id:
        db.add(Notification(
            user_id=bug.assigned_to_id,
            title=f"Defect Retest: {'Closed' if data.passed else 'Reopened'}",
            message=notif_msg,
            type=notif_type,
            link="#development"
        ))

    db.commit()
    db.refresh(bug)
    recalculate_project_progress(db, bug.project_id)
    return {
        "message": f"Defect successfully {'closed' if data.passed else 'reopened'}.",
        "bug": bug.to_dict()
    }

@router.put("/{bug_id}")
def update_bug(bug_id: int, data: BugUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    bug = db.query(Bug).filter(Bug.id == bug_id).first()
    if not bug:
        raise HTTPException(status_code=404, detail="Bug not found.")

    if data.title is not None:
        bug.title = data.title.strip()
    if data.description is not None:
        bug.description = data.description.strip()
    if data.severity is not None:
        bug.severity = data.severity
    if data.priority is not None:
        bug.priority = data.priority
    if data.assigned_to_id is not None:
        bug.assigned_to_id = data.assigned_to_id
        if bug.status == "Open":
            bug.status = "Assigned"
    if data.resolution_notes is not None:
        bug.resolution_notes = data.resolution_notes

    # Validation: Developer cannot close a bug directly!
    if data.status is not None:
        if data.status == "Closed" and current_user.role == "Developer":
            raise HTTPException(status_code=400, detail="Validation error: A developer cannot close a bug directly. Mark it as 'Ready for Retesting' for QA.")
        if data.status == "Closed" and bug.status not in ["Ready for Retesting", "Fixed", "Closed"]:
            raise HTTPException(status_code=400, detail="Validation error: A tester cannot close a bug without retesting it first.")
        bug.status = data.status

    db.commit()
    db.refresh(bug)
    recalculate_project_progress(db, bug.project_id)
    return bug.to_dict()

@router.delete("/{bug_id}")
def delete_bug(bug_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_role(["Project Manager"]))):
    bug = db.query(Bug).filter(Bug.id == bug_id).first()
    if not bug:
        raise HTTPException(status_code=404, detail="Bug not found.")

    project_id = bug.project_id
    db.delete(bug)
    db.commit()
    recalculate_project_progress(db, project_id)
    return {"message": "Bug deleted successfully."}
