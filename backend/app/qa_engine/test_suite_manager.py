from typing import List, Dict, Optional, Any
from enum import Enum
from pydantic import BaseModel, Field

class TestType(str, Enum):
    FUNCTIONAL = "Functional"
    SMOKE = "Smoke"
    REGRESSION = "Regression"
    INTEGRATION = "Integration"
    SECURITY = "Security"
    PERFORMANCE = "Performance"

class AutomatedTestCase(BaseModel):
    test_id: int
    code: str
    title: str
    test_type: TestType = TestType.FUNCTIONAL
    preconditions: str = ""
    steps: List[str] = Field(default_factory=list)
    expected_result: str = ""
    is_automated: bool = False
    automation_script_path: Optional[str] = None
    priority: str = "Medium"
    linked_requirement_id: Optional[int] = None

class TestSuiteManager:
    """
    Test Suite Hierarchy and Regression Pack Organizer.
    Organizes test cases into executable suites (Smoke, Sanity, Full Regression).
    """

    def __init__(self, project_id: int):
        self.project_id = project_id
        self.suites: Dict[str, List[AutomatedTestCase]] = {
            "Smoke": [],
            "Regression": [],
            "Security": [],
            "Critical_Path": []
        }

    def register_test_case(self, tc: AutomatedTestCase, target_suite: str = "Regression") -> None:
        if target_suite not in self.suites:
            self.suites[target_suite] = []
        self.suites[target_suite].append(tc)

    def get_suite_stats(self) -> Dict[str, Any]:
        return {
            "project_id": self.project_id,
            "suite_counts": {k: len(v) for k, v in self.suites.items()},
            "total_test_cases": sum(len(v) for v in self.suites.values())
        }
