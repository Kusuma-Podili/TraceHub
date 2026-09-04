from typing import Optional
from pydantic import BaseModel, Field

class TestCaseCreate(BaseModel):
    project_id: int
    requirement_id: Optional[int] = None
    name: str = Field(..., min_length=3, max_length=200)
    description: Optional[str] = ""
    preconditions: Optional[str] = ""
    test_steps: str = Field(..., min_length=5)
    expected_result: str = Field(..., min_length=3)
    priority: str = "Medium"

class TestCaseUpdate(BaseModel):
    requirement_id: Optional[int] = None
    name: Optional[str] = None
    description: Optional[str] = None
    preconditions: Optional[str] = None
    test_steps: Optional[str] = None
    expected_result: Optional[str] = None
    actual_result: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None

class TestExecutionCreate(BaseModel):
    status: str = Field(..., description="Passed, Failed, Blocked")
    actual_result: Optional[str] = ""
    notes: Optional[str] = ""
    execution_time_ms: Optional[int] = 0
