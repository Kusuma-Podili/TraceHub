from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.project import Project, ProjectMember
from backend.app.models.requirement import Requirement
from backend.app.models.notification import ActivityLog, Notification
from backend.app.schemas.task import RequirementCreate, RequirementUpdate
from backend.app.services.auth_service import get_current_user, require_role
from backend.app.services.progress_service import recalculate_project_progress

router = APIRouter(prefix="/api/requirements", tags=["Requirements"])

@router.get("")
def get_requirements(
    project_id: Optional[int] = None,
    priority: Optional[str] = None,
    status: Optional[str] = None,
    assigned_to_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Requirement)

    if current_user.role != "Project Manager":
        member_proj_ids = [m.project_id for m in db.query(ProjectMember).filter(ProjectMember.user_id == current_user.id).all()]
        query = query.filter(Requirement.project_id.in_(member_proj_ids))

    if project_id:
        query = query.filter(Requirement.project_id == project_id)
    if priority:
        query = query.filter(Requirement.priority == priority)
    if status:
        query = query.filter(Requirement.status == status)
    if assigned_to_id:
        query = query.filter(Requirement.assigned_to_id == assigned_to_id)

    reqs = query.order_by(Requirement.created_at.desc()).all()
    return [r.to_dict() for r in reqs]

@router.post("", status_code=status.HTTP_201_CREATED)
def create_requirement(
    data: RequirementCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["Project Manager"]))
):
    project = db.query(Project).filter(Project.id == data.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")

    # Generate requirement code
    count = db.query(Requirement).filter(Requirement.project_id == project.id).count() + 1
    req_code = f"REQ-{project.code}-{count:03d}"

    req = Requirement(
        req_code=req_code,
        project_id=project.id,
        title=data.title.strip(),
        description=data.description or "",
        priority=data.priority,
        status=data.status,
        assigned_to_id=data.assigned_to_id,
        created_by_id=current_user.id
    )
    db.add(req)

    # Activity Log
    db.add(ActivityLog(
        project_id=project.id,
        user_id=current_user.id,
        action_type="requirement_added",
        description=f"Requirement '{req.req_code}: {req.title}' created with priority {req.priority}."
    ))

    # Notification to assigned user
    if data.assigned_to_id:
        db.add(Notification(
            user_id=data.assigned_to_id,
            title="Requirement Assigned",
            message=f"You have been assigned to requirement '{req.title}' ({req.req_code}).",
            type="info",
            link="#requirements"
        ))

    db.commit()
    db.refresh(req)
    recalculate_project_progress(db, project.id)
    return req.to_dict()

@router.get("/{req_id}")
def get_requirement(req_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    req = db.query(Requirement).filter(Requirement.id == req_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Requirement not found.")
    return req.to_dict()

@router.put("/{req_id}")
def update_requirement(
    req_id: int,
    data: RequirementUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    req = db.query(Requirement).filter(Requirement.id == req_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Requirement not found.")

    if data.title is not None and current_user.role == "Project Manager":
        req.title = data.title.strip()
    if data.description is not None:
        req.description = data.description
    if data.priority is not None and current_user.role == "Project Manager":
        req.priority = data.priority
    if data.status is not None:
        old_status = req.status
        req.status = data.status
        if old_status != data.status:
            db.add(ActivityLog(
                project_id=req.project_id,
                user_id=current_user.id,
                action_type="requirement_updated",
                description=f"Requirement {req.req_code} status changed from '{old_status}' to '{data.status}'."
            ))
    if data.assigned_to_id is not None and current_user.role == "Project Manager":
        req.assigned_to_id = data.assigned_to_id
        db.add(Notification(
            user_id=data.assigned_to_id,
            title="Requirement Re-assigned",
            message=f"You have been assigned to requirement '{req.title}' ({req.req_code}).",
            type="info",
            link="#requirements"
        ))

    db.commit()
    db.refresh(req)
    recalculate_project_progress(db, req.project_id)
    return req.to_dict()

@router.delete("/{req_id}")
def delete_requirement(
    req_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["Project Manager"]))
):
    req = db.query(Requirement).filter(Requirement.id == req_id).first()
    if not req:
        raise HTTPException(status_code=404, detail="Requirement not found.")

    project_id = req.project_id
    db.delete(req)
    db.commit()
    recalculate_project_progress(db, project_id)
    return {"message": "Requirement deleted successfully."}
