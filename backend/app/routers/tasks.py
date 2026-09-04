from typing import Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.project import Project, ProjectMember
from backend.app.models.task import Task
from backend.app.models.bug import Bug
from backend.app.models.test_case import TestCase
from backend.app.models.notification import ActivityLog, Notification
from backend.app.schemas.task import TaskCreate, TaskUpdate, TaskStatusUpdate, TaskProgressUpdate, TaskFailTesting
from backend.app.services.auth_service import get_current_user, require_role
from backend.app.services.progress_service import recalculate_project_progress

router = APIRouter(prefix="/api/tasks", tags=["Tasks"])

VALID_STATUSES = [
    "To Do",
    "In Progress",
    "Ready for Testing",
    "Testing",
    "Passed",
    "Completed",
    "Testing Failed"
]

@router.get("")
def get_tasks(
    project_id: Optional[int] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    assigned_to_id: Optional[int] = None,
    phase_name: Optional[str] = None,
    ready_for_testing: Optional[bool] = None,
    my_tasks: Optional[bool] = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Task)

    if my_tasks or (current_user.role == "Developer" and not project_id and not ready_for_testing):
        if my_tasks:
            query = query.filter(Task.assigned_to_id == current_user.id)
        else:
            member_proj_ids = [m.project_id for m in db.query(ProjectMember).filter(ProjectMember.user_id == current_user.id).all()]
            query = query.filter(Task.project_id.in_(member_proj_ids))
    elif current_user.role == "Tester" and not project_id and not ready_for_testing:
        member_proj_ids = [m.project_id for m in db.query(ProjectMember).filter(ProjectMember.user_id == current_user.id).all()]
        query = query.filter(Task.project_id.in_(member_proj_ids))

    if project_id:
        query = query.filter(Task.project_id == project_id)
    if status:
        query = query.filter(Task.status == status)
    if ready_for_testing:
        query = query.filter(Task.status.in_(["Ready for Testing", "Testing", "Testing Failed"]))
    if priority:
        query = query.filter(Task.priority == priority)
    if assigned_to_id:
        query = query.filter(Task.assigned_to_id == assigned_to_id)
    if phase_name:
        query = query.filter(Task.phase_name == phase_name)

    tasks = query.order_by(Task.created_at.desc()).all()
    return [t.to_dict() for t in tasks]

@router.post("", status_code=status.HTTP_201_CREATED)
def create_task(
    data: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == data.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")

    count = db.query(Task).filter(Task.project_id == project.id).count() + 1
    task_code = f"TSK-{project.code}-{count:03d}"

    task = Task(
        task_code=task_code,
        project_id=project.id,
        requirement_id=data.requirement_id,
        title=data.title.strip(),
        description=data.description or "",
        assigned_to_id=data.assigned_to_id,
        phase_name=data.phase_name or "Development",
        priority=data.priority,
        status="To Do",
        testing_status="Not Started",
        progress_percent=0.0,
        due_date=data.due_date
    )
    db.add(task)

    db.add(ActivityLog(
        project_id=project.id,
        user_id=current_user.id,
        action_type="task_created",
        description=f"Task '{task.task_code}: {task.title}' created."
    ))

    if data.assigned_to_id:
        db.add(Notification(
            user_id=data.assigned_to_id,
            title="New Task Assignment",
            message=f"You were assigned to task '{task.title}' ({task.task_code}).",
            type="info",
            link="#development"
        ))

    db.commit()
    db.refresh(task)
    recalculate_project_progress(db, project.id)
    return task.to_dict()

@router.get("/{task_id}")
def get_task(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found.")
    return task.to_dict()

@router.put("/{task_id}")
def update_task(task_id: int, data: TaskUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found.")

    if data.title is not None:
        task.title = data.title.strip()
    if data.description is not None:
        task.description = data.description
    if data.assigned_to_id is not None:
        task.assigned_to_id = data.assigned_to_id
    if data.phase_name is not None:
        task.phase_name = data.phase_name
    if data.priority is not None:
        task.priority = data.priority
    if data.progress_percent is not None:
        task.progress_percent = max(0.0, min(100.0, data.progress_percent))
    if data.due_date is not None:
        task.due_date = data.due_date

    # Validate status change if submitted
    if data.status is not None:
        if data.status == "Completed" and task.testing_status != "Passed":
            raise HTTPException(
                status_code=400,
                detail="Workflow validation error: Task cannot be marked 'Completed' until testing is passed."
            )
        task.status = data.status

    db.commit()
    db.refresh(task)
    recalculate_project_progress(db, task.project_id)
    return task.to_dict()

# --- WORKFLOW ACTIONS ---

@router.post("/{task_id}/start-development")
def start_development(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found.")

    if task.status not in ["To Do", "Testing Failed"]:
        raise HTTPException(status_code=400, detail=f"Cannot start development on task with status '{task.status}'.")

    task.status = "In Progress"
    if task.progress_percent == 0.0:
        task.progress_percent = 15.0

    db.add(ActivityLog(
        project_id=task.project_id,
        user_id=current_user.id,
        action_type="task_started",
        description=f"{current_user.full_name} started development on task '{task.task_code}: {task.title}'."
    ))

    db.commit()
    db.refresh(task)
    recalculate_project_progress(db, task.project_id)
    return {"message": "Development started.", "task": task.to_dict()}

@router.patch("/{task_id}/progress")
def update_task_progress(task_id: int, data: TaskProgressUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found.")

    task.progress_percent = max(0.0, min(100.0, data.progress_percent))
    if data.notes:
        task.description = (task.description or "") + f"\n[Update {datetime.utcnow().strftime('%Y-%m-%d')}]: {data.notes}"

    if task.progress_percent > 0 and task.status == "To Do":
        task.status = "In Progress"

    db.commit()
    db.refresh(task)
    recalculate_project_progress(db, task.project_id)
    return {"message": "Progress updated.", "task": task.to_dict()}

@router.post("/{task_id}/submit-for-testing")
def submit_for_testing(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found.")

    # Validation: A developer cannot submit a task for testing before starting development
    if task.status == "To Do" or task.progress_percent <= 0:
        raise HTTPException(
            status_code=400,
            detail="Workflow validation error: You cannot submit a task for testing before starting development and making progress."
        )

    task.status = "Ready for Testing"
    task.testing_status = "Not Started"
    if task.progress_percent < 90.0:
        task.progress_percent = 90.0

    # Notify testers on the project
    testers = db.query(User).join(ProjectMember).filter(
        ProjectMember.project_id == task.project_id,
        User.role == "Tester"
    ).all()

    for tester in testers:
        db.add(Notification(
            user_id=tester.id,
            title="Task Ready for Testing",
            message=f"Task '{task.title}' ({task.task_code}) is ready for testing.",
            type="info",
            link="#testing"
        ))

    db.add(ActivityLog(
        project_id=task.project_id,
        user_id=current_user.id,
        action_type="task_ready_for_testing",
        description=f"Task '{task.task_code}' marked 'Ready for Testing' by {current_user.full_name}."
    ))

    db.commit()
    db.refresh(task)
    recalculate_project_progress(db, task.project_id)
    return {"message": "Task submitted for testing.", "task": task.to_dict()}

@router.post("/{task_id}/start-testing")
def start_testing(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found.")

    # Validation: A tester cannot test a task that has not been submitted for testing
    if task.status not in ["Ready for Testing", "Testing", "Testing Failed"]:
        raise HTTPException(
            status_code=400,
            detail=f"Workflow validation error: Cannot test task with status '{task.status}'. Task must be 'Ready for Testing'."
        )

    task.status = "Testing"
    task.testing_status = "In Testing"

    db.add(ActivityLog(
        project_id=task.project_id,
        user_id=current_user.id,
        action_type="testing_started",
        description=f"{current_user.full_name} started QA testing on task '{task.task_code}'."
    ))

    db.commit()
    db.refresh(task)
    return {"message": "Testing started.", "task": task.to_dict()}

@router.post("/{task_id}/pass-testing")
def pass_testing(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found.")

    if task.status not in ["Testing", "Ready for Testing"]:
        raise HTTPException(status_code=400, detail="Workflow validation error: Task must be in Testing status to record Pass.")

    task.testing_status = "Passed"
    task.status = "Completed"
    task.progress_percent = 100.0

    # Notify developer
    if task.assigned_to_id:
        db.add(Notification(
            user_id=task.assigned_to_id,
            title="Task Testing Passed",
            message=f"Testing passed for '{task.title}' ({task.task_code}). Task marked Completed!",
            type="success",
            link="#development"
        ))

    db.add(ActivityLog(
        project_id=task.project_id,
        user_id=current_user.id,
        action_type="testing_passed",
        description=f"Task '{task.task_code}' passed testing and completed by {current_user.full_name}."
    ))

    db.commit()
    db.refresh(task)
    recalculate_project_progress(db, task.project_id)
    return {"message": "Task testing passed and task marked Completed!", "task": task.to_dict()}

@router.post("/{task_id}/fail-testing")
def fail_testing(task_id: int, data: TaskFailTesting, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found.")

    if task.status not in ["Testing", "Ready for Testing"]:
        raise HTTPException(status_code=400, detail="Workflow validation error: Task must be in Testing status to record Failure.")

    task.testing_status = "Failed"
    task.status = "In Progress"

    # Automatically create linked defect bug
    count = db.query(Bug).filter(Bug.project_id == task.project_id).count() + 1
    project = task.project
    bug_code = f"BUG-{project.code}-{count:03d}"
    bug_title = data.bug_title or f"Test Failure on {task.title}"
    bug_desc = data.bug_description or data.failure_details or "QA acceptance criteria not met."
    bug_sev = data.bug_severity or data.severity or "High"
    bug_pri = data.bug_priority or data.priority or "High"

    bug = Bug(
        bug_code=bug_code,
        title=bug_title,
        description=bug_desc,
        project_id=task.project_id,
        task_id=task.id,
        requirement_id=task.requirement_id,
        severity=bug_sev,
        priority=bug_pri,
        status="Open",
        assigned_to_id=task.assigned_to_id,
        reported_by_id=current_user.id
    )
    db.add(bug)

    # Notify developer
    if task.assigned_to_id:
        db.add(Notification(
            user_id=task.assigned_to_id,
            title="Task Testing Failed - Bug Created",
            message=f"Testing failed on '{task.title}'. Bug '{bug.bug_code}' assigned to you: {bug_desc[:80]}...",
            type="alert",
            link="#development"
        ))

    db.add(ActivityLog(
        project_id=task.project_id,
        user_id=current_user.id,
        action_type="testing_failed",
        description=f"Task '{task.task_code}' failed testing. Generated {bug.bug_code} ({bug_sev} severity)."
    ))

    db.commit()
    db.refresh(task)
    db.refresh(bug)
    recalculate_project_progress(db, task.project_id)
    return {
        "message": f"Testing marked Failed. Bug '{bug.bug_code}' generated and assigned to developer.",
        "task": task.to_dict(),
        "bug": bug.to_dict()
    }

@router.patch("/{task_id}/status")
def update_task_status(task_id: int, data: TaskStatusUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found.")

    if data.status not in VALID_STATUSES:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {', '.join(VALID_STATUSES)}")

    # Validation: Cannot mark directly as Completed without passing testing
    if data.status == "Completed" and task.testing_status != "Passed":
        raise HTTPException(
            status_code=400,
            detail="Workflow validation error: Task cannot be marked 'Completed' until required testing is passed."
        )

    task.status = data.status
    if data.progress_percent is not None:
        task.progress_percent = max(0.0, min(100.0, data.progress_percent))

    db.commit()
    db.refresh(task)
    recalculate_project_progress(db, task.project_id)
    return task.to_dict()

@router.delete("/{task_id}")
def delete_task(task_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_role(["Project Manager"]))):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found.")

    project_id = task.project_id
    db.delete(task)
    db.commit()
    recalculate_project_progress(db, project_id)
    return {"message": "Task deleted successfully."}
