from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field

class BugCreate(BaseModel):
    project_id: int
    title: str = Field(..., min_length=3, max_length=200)
    description: str = Field(..., min_length=5)
    requirement_id: Optional[int] = None
    test_case_id: Optional[int] = None
    task_id: Optional[int] = None
    severity: str = "Medium"   # Low, Medium, High, Critical
    priority: str = "Medium"   # Low, Medium, High, Critical
    assigned_to_id: Optional[int] = None
    due_date: Optional[datetime] = None

class BugUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    requirement_id: Optional[int] = None
    test_case_id: Optional[int] = None
    task_id: Optional[int] = None
    severity: Optional[str] = None
    priority: Optional[str] = None
    assigned_to_id: Optional[int] = None
    status: Optional[str] = None
    resolution_notes: Optional[str] = None
    due_date: Optional[datetime] = None

class BugFixSubmit(BaseModel):
    resolution_notes: str = Field(..., min_length=3, description="Details of how the bug was fixed")

class BugRetestSubmit(BaseModel):
    passed: bool
    retest_notes: str = Field(..., min_length=3, description="Tester verification results")

class DeploymentCreate(BaseModel):
    project_id: int
    version: str = Field(..., min_length=1, max_length=50)
    environment: str = Field("Staging", description="Development, Testing, Staging, Production")
    status: str = "Planned"
    release_notes: Optional[str] = ""

class DeploymentUpdate(BaseModel):
    status: Optional[str] = None
    release_notes: Optional[str] = None

class MaintenanceCreate(BaseModel):
    project_id: int
    title: str = Field(..., min_length=3, max_length=200)
    type: str = "Issue"  # Request, Issue, Enhancement
    priority: str = "Medium"
    status: str = "Open"
    assigned_to_id: Optional[int] = None
    resolution_details: Optional[str] = ""

class MaintenanceUpdate(BaseModel):
    title: Optional[str] = None
    type: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    assigned_to_id: Optional[int] = None
    resolution_details: Optional[str] = None
