from typing import Optional, List
from datetime import datetime
from pydantic import BaseModel, Field

class ProjectCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    code: str = Field(..., min_length=2, max_length=20)
    description: Optional[str] = ""
    priority: str = Field("Medium", description="Low, Medium, High, Critical")
    target_date: Optional[datetime] = None
    member_ids: Optional[List[int]] = []

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    current_phase: Optional[str] = None
    target_date: Optional[datetime] = None
    architecture_notes: Optional[str] = None
    ui_ux_notes: Optional[str] = None
    db_design_notes: Optional[str] = None
    tech_design_notes: Optional[str] = None

class MemberAssign(BaseModel):
    user_id: int
    role_in_project: str = "Developer"

class PhaseAdvance(BaseModel):
    target_phase: str
    override_warning: Optional[bool] = False
