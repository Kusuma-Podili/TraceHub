from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.project import Project, ProjectMember, SDLCPhase
from backend.app.models.notification import ActivityLog, Notification
from backend.app.schemas.project import ProjectCreate, ProjectUpdate, MemberAssign
from backend.app.services.auth_service import get_current_user, require_role
from backend.app.services.progress_service import recalculate_project_progress
from backend.app.config import SDLC_PHASES_ORDER

router = APIRouter(prefix="/api/projects", tags=["Projects"])

PHASE_DESCRIPTIONS = {
    "Requirement Analysis": "Gather and define business, functional, and user requirements.",
    "Planning": "Scope definition, resource allocation, architectural planning, and timeline milestones.",
    "Design": "Technical architecture, database schemas, UI/UX wireframes, and API specifications.",
    "Development": "Source code implementation, feature development, and code reviews.",
    "Testing": "Unit testing, integration testing, QA verification, and bug triage.",
    "Deployment": "Release packaging, environment staging, and production rollout.",
    "Maintenance": "Production monitoring, hotfixes, SLAs, and customer feedback enhancements."
}

@router.get("")
def get_projects(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if current_user.role == "Project Manager":
        projects = db.query(Project).all()
    else:
        # Developers & Testers see projects they are members of or manage
        member_project_ids = [m.project_id for m in db.query(ProjectMember).filter(ProjectMember.user_id == current_user.id).all()]
        projects = db.query(Project).filter(Project.id.in_(member_project_ids)).all()

    # Recalculate progress for accuracy
    result = []
    for p in projects:
        recalculate_project_progress(db, p.id)
        result.append(p.to_dict())
    return result

@router.post("", status_code=status.HTTP_201_CREATED)
def create_project(data: ProjectCreate, db: Session = Depends(get_db), current_user: User = Depends(require_role(["Project Manager"]))):
    # Verify code uniqueness
    if db.query(Project).filter(Project.code == data.code.strip().upper()).first():
        raise HTTPException(status_code=400, detail=f"Project code '{data.code}' already exists.")

    project = Project(
        code=data.code.strip().upper(),
        name=data.name.strip(),
        description=data.description or "",
        manager_id=current_user.id,
        priority=data.priority,
        status="Active",
        current_phase="Requirement Analysis",
        target_date=data.target_date,
        progress_percent=0.0
    )
    db.add(project)
    db.commit()
    db.refresh(project)

    # Automatically add Project Manager as member
    db.add(ProjectMember(
        project_id=project.id,
        user_id=current_user.id,
        role_in_project="Project Manager"
    ))

    # Add other assigned members
    if data.member_ids:
        for mid in set(data.member_ids):
            if mid != current_user.id:
                u = db.query(User).filter(User.id == mid).first()
                if u:
                    db.add(ProjectMember(
                        project_id=project.id,
                        user_id=u.id,
                        role_in_project=u.role
                    ))
                    db.add(Notification(
                        user_id=u.id,
                        title="Assigned to New Project",
                        message=f"You have been added to project '{project.name}' ({project.code}).",
                        type="info",
                        link=f"#projects/{project.id}"
                    ))

    # Initialize all 7 SDLC phases
    now = datetime.utcnow()
    for idx, phase_name in enumerate(SDLC_PHASES_ORDER):
        phase = SDLCPhase(
            project_id=project.id,
            phase_name=phase_name,
            order_index=idx,
            description=PHASE_DESCRIPTIONS.get(phase_name, ""),
            status="In Progress" if idx == 0 else "Not Started",
            start_date=now if idx == 0 else None,
            completion_percent=0.0
        )
        db.add(phase)

    # Activity Log
    db.add(ActivityLog(
        project_id=project.id,
        user_id=current_user.id,
        action_type="project_created",
        description=f"Project '{project.name}' created by {current_user.full_name}."
    ))

    db.commit()
    db.refresh(project)
    return project.to_dict()

@router.get("/{project_id}")
def get_project_details(project_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")

    recalculate_project_progress(db, project.id)

    # Format project with members, phases
    members = [m.to_dict() for m in project.members]
    phases = [p.to_dict() for p in project.phases]

    res = project.to_dict()
    res["members"] = members
    res["phases"] = phases
    return res

@router.put("/{project_id}")
def update_project(project_id: int, data: ProjectUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")

    # Developers can update design notes; only PM can update core project status/metadata
    is_pm = current_user.role == "Project Manager"

    if is_pm:
        if data.name is not None:
            project.name = data.name.strip()
        if data.description is not None:
            project.description = data.description
        if data.priority is not None:
            project.priority = data.priority
        if data.status is not None:
            # Check validation: Cannot mark Completed if critical bugs open!
            if data.status == "Completed":
                from backend.app.models.bug import Bug
                critical_bugs = db.query(Bug).filter(
                    Bug.project_id == project.id,
                    Bug.severity.in_(["Critical", "High"]),
                    Bug.status.in_(["Open", "Assigned", "In Progress", "Reopened"])
                ).count()
                if critical_bugs > 0:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Cannot mark project as Completed: {critical_bugs} Critical or High severity bugs remain unresolved."
                    )
            project.status = data.status
        if data.target_date is not None:
            project.target_date = data.target_date

    # Design documentation notes can be edited by PM or Developer
    if data.architecture_notes is not None:
        project.architecture_notes = data.architecture_notes
    if data.ui_ux_notes is not None:
        project.ui_ux_notes = data.ui_ux_notes
    if data.db_design_notes is not None:
        project.db_design_notes = data.db_design_notes
    if data.tech_design_notes is not None:
        project.tech_design_notes = data.tech_design_notes

    db.add(ActivityLog(
        project_id=project.id,
        user_id=current_user.id,
        action_type="project_updated",
        description=f"Project specifications updated by {current_user.full_name}."
    ))

    db.commit()
    db.refresh(project)
    return project.to_dict()

@router.delete("/{project_id}")
def delete_project(project_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_role(["Project Manager"]))):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")

    db.delete(project)
    db.commit()
    return {"message": f"Project '{project.name}' deleted successfully."}

@router.post("/{project_id}/members")
def add_project_member(project_id: int, data: MemberAssign, db: Session = Depends(get_db), current_user: User = Depends(require_role(["Project Manager"]))):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")

    target_user = db.query(User).filter(User.id == data.user_id).first()
    if not target_user:
        raise HTTPException(status_code=404, detail="User not found.")

    existing = db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == data.user_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="User is already a member of this project.")

    member = ProjectMember(
        project_id=project_id,
        user_id=data.user_id,
        role_in_project=data.role_in_project or target_user.role
    )
    db.add(member)

    db.add(Notification(
        user_id=data.user_id,
        title="Project Assignment",
        message=f"You have been assigned to project '{project.name}'.",
        type="info",
        link=f"#projects/{project.id}"
    ))

    db.add(ActivityLog(
        project_id=project.id,
        user_id=current_user.id,
        action_type="member_added",
        description=f"{target_user.full_name} added to project as {member.role_in_project}."
    ))

    db.commit()
    return {"message": "Member added successfully.", "member": member.to_dict()}

@router.delete("/{project_id}/members/{user_id}")
def remove_project_member(project_id: int, user_id: int, db: Session = Depends(get_db), current_user: User = Depends(require_role(["Project Manager"]))):
    member = db.query(ProjectMember).filter(
        ProjectMember.project_id == project_id,
        ProjectMember.user_id == user_id
    ).first()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found in project.")

    db.delete(member)
    db.commit()
    return {"message": "Member removed from project."}

@router.get("/{project_id}/activity")
def get_project_activity(project_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    logs = db.query(ActivityLog).filter(
        ActivityLog.project_id == project_id
    ).order_by(ActivityLog.created_at.desc()).limit(50).all()
    return [log.to_dict() for log in logs]
