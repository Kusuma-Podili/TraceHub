from typing import Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.app.database import get_db
from backend.app.models.user import User
from backend.app.models.project import Project, ProjectMember
from backend.app.models.test_case import TestCase, TestExecution
from backend.app.models.notification import ActivityLog, Notification
from backend.app.schemas.test_case import TestCaseCreate, TestCaseUpdate, TestExecutionCreate
from backend.app.services.auth_service import get_current_user, require_role
from backend.app.services.progress_service import recalculate_project_progress

router = APIRouter(prefix="/api/testing", tags=["Testing"])

@router.get("/test-cases")
def get_test_cases(
    project_id: Optional[int] = None,
    status: Optional[str] = None,
    priority: Optional[str] = None,
    requirement_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(TestCase)

    if current_user.role != "Project Manager":
        member_proj_ids = [m.project_id for m in db.query(ProjectMember).filter(ProjectMember.user_id == current_user.id).all()]
        query = query.filter(TestCase.project_id.in_(member_proj_ids))

    if project_id:
        query = query.filter(TestCase.project_id == project_id)
    if status:
        query = query.filter(TestCase.status == status)
    if priority:
        query = query.filter(TestCase.priority == priority)
    if requirement_id:
        query = query.filter(TestCase.requirement_id == requirement_id)

    cases = query.order_by(TestCase.created_at.desc()).all()
    return [c.to_dict() for c in cases]

@router.post("/test-cases", status_code=status.HTTP_201_CREATED)
def create_test_case(
    data: TestCaseCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(Project.id == data.project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")

    count = db.query(TestCase).filter(TestCase.project_id == project.id).count() + 1
    case_code = f"TC-{project.code}-{count:03d}"

    tc = TestCase(
        case_code=case_code,
        project_id=project.id,
        requirement_id=data.requirement_id,
        name=data.name.strip(),
        description=data.description or "",
        preconditions=data.preconditions or "",
        test_steps=data.test_steps.strip(),
        expected_result=data.expected_result.strip(),
        priority=data.priority,
        status="Not Executed",
        created_by_id=current_user.id
    )
    db.add(tc)

    db.add(ActivityLog(
        project_id=project.id,
        user_id=current_user.id,
        action_type="test_case_created",
        description=f"Test case '{tc.case_code}: {tc.name}' created by {current_user.full_name}."
    ))

    db.commit()
    db.refresh(tc)
    recalculate_project_progress(db, project.id)
    return tc.to_dict()

@router.get("/test-cases/{case_id}")
def get_test_case(case_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    tc = db.query(TestCase).filter(TestCase.id == case_id).first()
    if not tc:
        raise HTTPException(status_code=404, detail="Test case not found.")

    res = tc.to_dict()
    res["executions"] = [e.to_dict() for e in tc.executions]
    res["bugs"] = [b.to_dict() for b in tc.bugs]
    return res

@router.put("/test-cases/{case_id}")
def update_test_case(
    case_id: int,
    data: TestCaseUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    tc = db.query(TestCase).filter(TestCase.id == case_id).first()
    if not tc:
        raise HTTPException(status_code=404, detail="Test case not found.")

    if data.requirement_id is not None:
        tc.requirement_id = data.requirement_id
    if data.name is not None:
        tc.name = data.name.strip()
    if data.description is not None:
        tc.description = data.description
    if data.preconditions is not None:
        tc.preconditions = data.preconditions
    if data.test_steps is not None:
        tc.test_steps = data.test_steps
    if data.expected_result is not None:
        tc.expected_result = data.expected_result
    if data.actual_result is not None:
        tc.actual_result = data.actual_result
    if data.priority is not None:
        tc.priority = data.priority
    if data.status is not None:
        tc.status = data.status

    db.commit()
    db.refresh(tc)
    recalculate_project_progress(db, tc.project_id)
    return tc.to_dict()

@router.post("/test-cases/{case_id}/execute")
def execute_test_case(
    case_id: int,
    data: TestExecutionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    tc = db.query(TestCase).filter(TestCase.id == case_id).first()
    if not tc:
        raise HTTPException(status_code=404, detail="Test case not found.")

    execution = TestExecution(
        test_case_id=tc.id,
        executed_by_id=current_user.id,
        status=data.status,
        actual_result=data.actual_result or "",
        notes=data.notes or "",
        execution_time_ms=data.execution_time_ms or 0,
        executed_at=datetime.utcnow()
    )
    db.add(execution)

    # Update test case's latest status and actual result
    tc.status = data.status
    tc.actual_result = data.actual_result or ""

    # Log activity
    db.add(ActivityLog(
        project_id=tc.project_id,
        user_id=current_user.id,
        action_type="test_executed",
        description=f"Test case '{tc.case_code}' executed with status: {data.status} by {current_user.full_name}."
    ))

    # Notify PM if test failed
    if data.status == "Failed":
        project = tc.project
        if project and project.manager_id:
            db.add(Notification(
                user_id=project.manager_id,
                title="Test Execution Failed",
                message=f"Test '{tc.name}' ({tc.case_code}) failed during execution by {current_user.full_name}.",
                type="alert",
                link="#testing"
            ))

    db.commit()
    db.refresh(tc)
    recalculate_project_progress(db, tc.project_id)

    return {
        "message": f"Test execution recorded successfully: {data.status}",
        "test_case": tc.to_dict(),
        "execution": execution.to_dict()
    }

@router.get("/stats")
def get_testing_stats(
    project_id: Optional[int] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(TestCase)
    if project_id:
        query = query.filter(TestCase.project_id == project_id)

    cases = query.all()
    total = len(cases)
    passed = sum(1 for c in cases if c.status == "Passed")
    failed = sum(1 for c in cases if c.status == "Failed")
    blocked = sum(1 for c in cases if c.status == "Blocked")
    unexecuted = sum(1 for c in cases if c.status == "Not Executed")

    pass_rate = round((passed / total) * 100.0, 1) if total > 0 else 0.0

    return {
        "total": total,
        "passed": passed,
        "failed": failed,
        "blocked": blocked,
        "not_executed": unexecuted,
        "pass_rate_percent": pass_rate
    }

@router.delete("/test-cases/{case_id}")
def delete_test_case(case_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    tc = db.query(TestCase).filter(TestCase.id == case_id).first()
    if not tc:
        raise HTTPException(status_code=404, detail="Test case not found.")

    project_id = tc.project_id
    db.delete(tc)
    db.commit()
    recalculate_project_progress(db, project_id)
    return {"message": "Test case deleted successfully."}
