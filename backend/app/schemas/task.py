from typing import Optional
from datetime import datetime
from pydantic import BaseModel, Field

class RequirementCreate(BaseModel):
    project_id: int
    title: str = Field(..., min_length=3, max_length=200)
    description: Optional[str] = ""
    priority: str = "Medium"
    status: str = "Proposed"
    assigned_to_id: Optional[int] = None

class RequirementUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    assigned_to_id: Optional[int] = None

class TaskCreate(BaseModel):
    project_id: int
    requirement_id: Optional[int] = None
    title: str = Field(..., min_length=3, max_length=200)
    description: Optional[str] = ""
    assigned_to_id: Optional[int] = None
    phase_name: str = "Development"
    priority: str = "Medium"
    status: str = "To Do"
    due_date: Optional[datetime] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    assigned_to_id: Optional[int] = None
    phase_name: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    progress_percent: Optional[float] = None
    due_date: Optional[datetime] = None

class TaskStatusUpdate(BaseModel):
    status: str
    progress_percent: Optional[float] = None

class TaskProgressUpdate(BaseModel):
    progress_percent: float = Field(..., ge=0.0, le=100.0)
    notes: Optional[str] = None

class TaskFailTesting(BaseModel):
    failure_details: Optional[str] = None
    bug_description: Optional[str] = None
    bug_title: Optional[str] = None
    bug_severity: Optional[str] = None
    bug_priority: Optional[str] = None
    severity: Optional[str] = "High"
    priority: Optional[str] = "High"
