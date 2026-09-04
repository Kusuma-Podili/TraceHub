from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.project import Project, SDLCPhase
from backend.app.models.requirement import Requirement
from backend.app.models.task import Task
from backend.app.models.test_case import TestCase, TestExecution
from backend.app.models.bug import Bug
from backend.app.models.deployment import Deployment
from backend.app.models.notification import ActivityLog, Notification
from backend.app.schemas.project import PhaseAdvance
from backend.app.services.auth_service import require_role
from backend.app.services.auth_service import require_role
from backend.app.services.progress_service import recalculate_project_progress, get_project_phase_readiness
from backend.app.config import SDLC_PHASES_ORDER

router = APIRouter(prefix="/api/projects/{project_id}/phases", tags=["SDLC Phases"])

@router.get("/readiness")
def get_phase_readiness(project_id: int, db: Session = Depends(get_db)):
    readiness = get_project_phase_readiness(db, project_id)
    if not readiness:
        raise HTTPException(status_code=404, detail="Project not found.")
    return readiness

@router.get("")
def get_project_phases(project_id: int, db: Session = Depends(get_db)):
    phases = db.query(SDLCPhase).filter(
        SDLCPhase.project_id == project_id
    ).order_by(SDLCPhase.order_index).all()
    if not phases:
        raise HTTPException(status_code=404, detail="Phases not found for this project.")
    return [p.to_dict() for p in phases]

@router.post("/advance")
def advance_phase(
    project_id: int,
    data: PhaseAdvance,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(["Project Manager"]))
):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")

    target = data.target_phase
    if target not in SDLC_PHASES_ORDER:
        raise HTTPException(status_code=400, detail=f"Invalid phase name: '{target}'.")

    current_idx = SDLC_PHASES_ORDER.index(project.current_phase)
    target_idx = SDLC_PHASES_ORDER.index(target)

    if target_idx <= current_idx:
        raise HTTPException(status_code=400, detail=f"Cannot advance backwards or to same phase. Current is '{project.current_phase}'.")

    if target_idx != current_idx + 1:
        raise HTTPException(status_code=400, detail=f"Must advance sequentially through SDLC phases. Next phase is '{SDLC_PHASES_ORDER[current_idx + 1]}'.")

    # VALIDATION GATES
    curr = project.current_phase

    # Gate 1: Requirement Analysis -> Planning
    if curr == "Requirement Analysis":
        reqs = db.query(Requirement).filter(Requirement.project_id == project_id).all()
        if not reqs:
            raise HTTPException(status_code=400, detail="Gate Blocked: At least one requirement must be created before moving to Planning.")
        approved = sum(1 for r in reqs if r.status in ["Approved", "In Progress", "Completed"])
        if approved == 0:
            raise HTTPException(status_code=400, detail="Gate Blocked: At least one requirement must be marked Approved.")

    # Gate 2: Planning -> Design
    elif curr == "Planning":
        if len(project.members) < 2:
            raise HTTPException(status_code=400, detail="Gate Blocked: Must assign at least one developer or tester to team before entering Design phase.")

    # Gate 3: Design -> Development
    elif curr == "Design":
        if not (project.architecture_notes or project.ui_ux_notes or project.tech_design_notes):
            raise HTTPException(status_code=400, detail="Gate Blocked: Design documentation (Architecture or UI/UX or Technical notes) must be recorded before Development begins.")

    # Gate 4: Development -> Testing
    elif curr == "Development":
        dev_tasks = db.query(Task).filter(Task.project_id == project_id, Task.phase_name == "Development").all()
        if not dev_tasks:
            raise HTTPException(status_code=400, detail="Gate Blocked: At least one development task must be defined and worked on before moving to Testing.")
        incomplete_tasks = [t.title for t in dev_tasks if t.status in ["To Do", "In Progress"]]
        if incomplete_tasks:
            raise HTTPException(
                status_code=400,
                detail=f"Gate Blocked: All development tasks must be in 'Ready for Testing' or 'Completed' status before advancing to Testing. Incomplete: {', '.join(incomplete_tasks[:3])}."
            )

    # Gate 5: Testing -> Deployment
    elif curr == "Testing":
        # Check tests executed
        total_tests = db.query(TestCase).filter(TestCase.project_id == project_id).count()
        if total_tests == 0:
            raise HTTPException(status_code=400, detail="Gate Blocked: Must define and run test cases before advancing to Deployment.")
        
        # Check critical/high open bugs
        critical_bugs = db.query(Bug).filter(
            Bug.project_id == project_id,
            Bug.severity.in_(["Critical", "High"]),
            Bug.status.in_(["Open", "Assigned", "In Progress", "Reopened"])
        ).count()
        if critical_bugs > 0:
            raise HTTPException(
                status_code=400,
                detail=f"Gate Blocked: Cannot proceed to Deployment with {critical_bugs} Critical/High severity bugs remaining open!"
            )

    # Gate 6: Deployment -> Maintenance
    elif curr == "Deployment":
        success_deps = db.query(Deployment).filter(
            Deployment.project_id == project_id,
            Deployment.status == "Successful"
        ).count()
        if success_deps == 0:
            raise HTTPException(
                status_code=400,
                detail="Gate Blocked: Project must have at least one 'Successful' deployment record before transitioning to Maintenance."
            )

    now = datetime.utcnow()

    # Update current phase record to Completed
    curr_phase_obj = db.query(SDLCPhase).filter(
        SDLCPhase.project_id == project_id,
        SDLCPhase.phase_name == curr
    ).first()
    if curr_phase_obj:
        curr_phase_obj.status = "Completed"
        curr_phase_obj.end_date = now
        curr_phase_obj.completion_percent = 100.0

    # Update target phase record to In Progress
    target_phase_obj = db.query(SDLCPhase).filter(
        SDLCPhase.project_id == project_id,
        SDLCPhase.phase_name == target
    ).first()
    if target_phase_obj:
        target_phase_obj.status = "In Progress"
        target_phase_obj.start_date = now

    # Update project current phase
    project.current_phase = target
    if target == "Maintenance":
        project.status = "Completed"

    recalculate_project_progress(db, project.id)

    # Log Activity
    db.add(ActivityLog(
        project_id=project.id,
        user_id=current_user.id,
        action_type="phase_changed",
        description=f"Project advanced from '{curr}' to '{target}' phase by {current_user.full_name}."
    ))

    # Notify all project members
    for member in project.members:
        if member.user_id != current_user.id:
            db.add(Notification(
                user_id=member.user_id,
                title="SDLC Phase Advanced",
                message=f"Project '{project.name}' advanced to '{target}' phase.",
                type="info",
                link=f"#projects/{project.id}"
            ))

    db.commit()
    db.refresh(project)

    return {
        "message": f"Project successfully advanced to '{target}' phase.",
        "project": project.to_dict(),
        "phases": [p.to_dict() for p in project.phases]
    }
