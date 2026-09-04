from typing import Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.project import Project, ProjectMember
from backend.app.models.maintenance import MaintenanceRecord
from backend.app.models.notification import ActivityLog, Notification
from backend.app.schemas.bug import MaintenanceCreate, MaintenanceUpdate
from backend.app.services.auth_service import get_current_user, require_role

router = APIRouter(prefix="/api/maintenance", tags=["Maintenance"])

VALID_TYPES = ["Request", "Issue", "Enhancement"]
VALID_STATUSES = ["Open", "In Analysis", "In Progress", "Resolved", "Closed"]

@router.get("")
def get_maintenance_records(
    project_id: Optional[int] = None,
    type: Optional[str] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(MaintenanceRecord)

    if current_user.role != "Project Manager":
        member_proj_ids = [m.project_id for m in db.query(ProjectMember).filter(ProjectMember.user_id == current_user.id).all()]
        query = query.filter(MaintenanceRecord.project_id.in_(member_proj_ids))

    if project_id:
        query = query.filter(MaintenanceRecord.project_id == project_id)
    if type:
        query = query.filter(MaintenanceRecord.type == type)
    if status:
        query = query.filter(MaintenanceRecord.status == status)
    if priority:
        query = query.filter(MaintenanceRecord.priority == priority)

    records = query.order_by(MaintenanceRecord.created_at.desc()).all()
    return [r.to_dict() for r in records]

@router.post("", status_code=status.HTTP_201_CREATED)
def create_maintenance_record(
    data: MaintenanceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == data.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")

    if data.type not in VALID_TYPES:
        raise HTTPException(status_code=400, detail=f"Invalid type. Must be one of: {', '.join(VALID_TYPES)}")

    rec = MaintenanceRecord(
        project_id=project.id,
        title=data.title.strip(),
        type=data.type,
        priority=data.priority,
        status=data.status,
        assigned_to_id=data.assigned_to_id,
        resolution_details=data.resolution_details or ""
    )
    db.add(rec)

    db.add(ActivityLog(
        project_id=project.id,
        user_id=current_user.id,
        action_type="maintenance_logged",
        description=f"Maintenance {rec.type} '{rec.title}' logged by {current_user.full_name}."
    ))

    if data.assigned_to_id:
        db.add(Notification(
            user_id=data.assigned_to_id,
            title=f"Maintenance {rec.type} Assigned",
            message=f"You have been assigned to maintenance ticket '{rec.title}'.",
            type="info",
            link="#maintenance"
        ))

    db.commit()
    db.refresh(rec)
    return rec.to_dict()

@router.put("/{rec_id}")
def update_maintenance_record(
    rec_id: int,
    data: MaintenanceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    rec = db.query(MaintenanceRecord).filter(MaintenanceRecord.id == rec_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Maintenance record not found.")

    if data.title is not None:
        rec.title = data.title.strip()
    if data.type is not None:
        if data.type not in VALID_TYPES:
            raise HTTPException(status_code=400, detail=f"Invalid type: {data.type}")
        rec.type = data.type
    if data.priority is not None:
        rec.priority = data.priority
    if data.status is not None:
        if data.status not in VALID_STATUSES:
            raise HTTPException(status_code=400, detail=f"Invalid status: {data.status}")
        rec.status = data.status
    if data.assigned_to_id is not None:
        rec.assigned_to_id = data.assigned_to_id
    if data.resolution_details is not None:
        rec.resolution_details = data.resolution_details

    db.commit()
    db.refresh(rec)
    return rec.to_dict()

@router.delete("/{rec_id}")
def delete_maintenance_record(rec_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_role(["Project Manager"]))):
    rec = db.query(MaintenanceRecord).filter(MaintenanceRecord.id == rec_id).first()
    if not rec:
        raise HTTPException(status_code=404, detail="Maintenance record not found.")

    db.delete(rec)
    db.commit()
    return {"message": "Maintenance record deleted successfully."}
