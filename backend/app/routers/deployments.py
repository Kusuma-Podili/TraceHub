from typing import Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.project import Project, ProjectMember
from backend.app.models.deployment import Deployment
from backend.app.models.notification import ActivityLog, Notification
from backend.app.schemas.bug import DeploymentCreate, DeploymentUpdate
from backend.app.services.auth_service import get_current_user, require_role

router = APIRouter(prefix="/api/deployments", tags=["Deployments"])

VALID_ENVIRONMENTS = ["Development", "Testing", "Staging", "Production"]
VALID_DEP_STATUSES = ["Planned", "In Progress", "Successful", "Failed", "Rolled Back"]

@router.get("")
def get_deployments(
    project_id: Optional[int] = None,
    environment: Optional[str] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(Deployment)

    if current_user.role != "Project Manager":
        member_proj_ids = [m.project_id for m in db.query(ProjectMember).filter(ProjectMember.user_id == current_user.id).all()]
        query = query.filter(Deployment.project_id.in_(member_proj_ids))

    if project_id:
        query = query.filter(Deployment.project_id == project_id)
    if environment:
        query = query.filter(Deployment.environment == environment)
    if status:
        query = query.filter(Deployment.status == status)

    deps = query.order_by(Deployment.deployment_date.desc()).all()
    return [d.to_dict() for d in deps]

@router.post("", status_code=status.HTTP_201_CREATED)
def create_deployment(
    data: DeploymentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["Project Manager"]))
):
    project = db.query(Project).filter(Project.id == data.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")

    if data.environment not in VALID_ENVIRONMENTS:
        raise HTTPException(status_code=400, detail=f"Invalid environment. Must be one of: {', '.join(VALID_ENVIRONMENTS)}")

    if data.status not in VALID_DEP_STATUSES:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {', '.join(VALID_DEP_STATUSES)}")

    dep = Deployment(
        project_id=project.id,
        version=data.version.strip(),
        environment=data.environment,
        status=data.status,
        deployed_by_id=current_user.id,
        release_notes=data.release_notes or "",
        deployment_date=datetime.utcnow()
    )
    db.add(dep)

    db.add(ActivityLog(
        project_id=project.id,
        user_id=current_user.id,
        action_type="deployment_recorded",
        description=f"Deployment {dep.version} recorded for {dep.environment} environment ({dep.status}) by {current_user.full_name}."
    ))

    # Notify team members
    for member in project.members:
        if member.user_id != current_user.id:
            db.add(Notification(
                user_id=member.user_id,
                title=f"Deployment {dep.version} ({dep.environment})",
                message=f"Deployment {dep.version} to {dep.environment} has status: {dep.status}.",
                type="success" if dep.status == "Successful" else "info",
                link="#deployment"
            ))

    db.commit()
    db.refresh(dep)
    return dep.to_dict()

@router.put("/{dep_id}")
def update_deployment(
    dep_id: int,
    data: DeploymentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["Project Manager"]))
):
    dep = db.query(Deployment).filter(Deployment.id == dep_id).first()
    if not dep:
        raise HTTPException(status_code=404, detail="Deployment not found.")

    if data.status is not None:
        if data.status not in VALID_DEP_STATUSES:
            raise HTTPException(status_code=400, detail=f"Invalid status: {data.status}")
        dep.status = data.status
    if data.release_notes is not None:
        dep.release_notes = data.release_notes

    db.add(ActivityLog(
        project_id=dep.project_id,
        user_id=current_user.id,
        action_type="deployment_updated",
        description=f"Deployment {dep.version} status updated to {dep.status} by {current_user.full_name}."
    ))

    db.commit()
    db.refresh(dep)
    return dep.to_dict()

@router.delete("/{dep_id}")
def delete_deployment(dep_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_role(["Project Manager"]))):
    dep = db.query(Deployment).filter(Deployment.id == dep_id).first()
    if not dep:
        raise HTTPException(status_code=404, detail="Deployment not found.")

    db.delete(dep)
    db.commit()
    return {"message": "Deployment deleted successfully."}
