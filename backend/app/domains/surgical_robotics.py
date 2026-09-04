"""
TraceHub Domain Specification: Minimally Invasive Robotic Teleoperator
Standard: IEC 80601-2-77 | Identifier Prefix: SURG
Exhaustive requirement models, sprint task matrices, QA verification vectors, and defect profiles.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class SurgicalRoboticsRequirement(BaseModel):
    code: str
    title: str
    priority: str
    category: str
    story_points: int
    estimated_hours: int
    description: str
    acceptance_criteria: List[str]

class SurgicalRoboticsTask(BaseModel):
    code: str
    title: str
    priority: str
    story_points: int
    estimated_hours: int
    status: str
    progress_percent: int
    requirement_code: str
    technical_notes: str

class SurgicalRoboticsTestCase(BaseModel):
    code: str
    title: str
    test_type: str
    priority: str
    requirement_code: str
    preconditions: str
    steps: List[str]
    expected_result: str

class SurgicalRoboticsDefect(BaseModel):
    title: str
    severity: str
    priority: str
    requirement_code: str
    task_code: str
    steps_to_reproduce: str
    remediation_notes: str

class SurgicalRoboticsDomainSpecification:
    """Domain specification provider for Minimally Invasive Robotic Teleoperator complying with IEC 80601-2-77."""
    DOMAIN_NAME = "Minimally Invasive Robotic Teleoperator"
    STANDARD_CODE = "IEC 80601-2-77"
    CODE_PREFIX = "SURG"

    REQUIREMENTS: List[Dict[str, Any]] = [
        {
            "code": "SURG-REQ-001",
            "title": "Minimally Invasive Robotic Teleoperator Subsystem Requirement #1",
            "priority": "Critical",
            "category": "Architecture & Governance",
            "story_points": 8,
            "estimated_hours": 32,
            "description": "Functional specification for Minimally Invasive Robotic Teleoperator requirement #1 adhering to IEC 80601-2-77 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with IEC 80601-2-77.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "SURG-REQ-002",
            "title": "Minimally Invasive Robotic Teleoperator Subsystem Requirement #2",
            "priority": "Critical",
            "category": "Architecture & Governance",
            "story_points": 8,
            "estimated_hours": 32,
            "description": "Functional specification for Minimally Invasive Robotic Teleoperator requirement #2 adhering to IEC 80601-2-77 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with IEC 80601-2-77.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "SURG-REQ-003",
            "title": "Minimally Invasive Robotic Teleoperator Subsystem Requirement #3",
            "priority": "Critical",
            "category": "Architecture & Governance",
            "story_points": 8,
            "estimated_hours": 32,
            "description": "Functional specification for Minimally Invasive Robotic Teleoperator requirement #3 adhering to IEC 80601-2-77 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with IEC 80601-2-77.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "SURG-REQ-004",
            "title": "Minimally Invasive Robotic Teleoperator Subsystem Requirement #4",
            "priority": "Critical",
            "category": "Architecture & Governance",
            "story_points": 8,
            "estimated_hours": 32,
            "description": "Functional specification for Minimally Invasive Robotic Teleoperator requirement #4 adhering to IEC 80601-2-77 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with IEC 80601-2-77.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "SURG-REQ-005",
            "title": "Minimally Invasive Robotic Teleoperator Subsystem Requirement #5",
            "priority": "Critical",
            "category": "Architecture & Governance",
            "story_points": 8,
            "estimated_hours": 32,
            "description": "Functional specification for Minimally Invasive Robotic Teleoperator requirement #5 adhering to IEC 80601-2-77 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with IEC 80601-2-77.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "SURG-REQ-006",
            "title": "Minimally Invasive Robotic Teleoperator Subsystem Requirement #6",
            "priority": "High",
            "category": "Architecture & Governance",
            "story_points": 5,
            "estimated_hours": 20,
            "description": "Functional specification for Minimally Invasive Robotic Teleoperator requirement #6 adhering to IEC 80601-2-77 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with IEC 80601-2-77.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "SURG-REQ-007",
            "title": "Minimally Invasive Robotic Teleoperator Subsystem Requirement #7",
            "priority": "High",
            "category": "Architecture & Governance",
            "story_points": 5,
            "estimated_hours": 20,
            "description": "Functional specification for Minimally Invasive Robotic Teleoperator requirement #7 adhering to IEC 80601-2-77 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with IEC 80601-2-77.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "SURG-REQ-008",
            "title": "Minimally Invasive Robotic Teleoperator Subsystem Requirement #8",
            "priority": "High",
            "category": "Architecture & Governance",
            "story_points": 5,
            "estimated_hours": 20,
            "description": "Functional specification for Minimally Invasive Robotic Teleoperator requirement #8 adhering to IEC 80601-2-77 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with IEC 80601-2-77.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "SURG-REQ-009",
            "title": "Minimally Invasive Robotic Teleoperator Subsystem Requirement #9",
            "priority": "High",
            "category": "Architecture & Governance",
            "story_points": 5,
            "estimated_hours": 20,
            "description": "Functional specification for Minimally Invasive Robotic Teleoperator requirement #9 adhering to IEC 80601-2-77 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with IEC 80601-2-77.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "SURG-REQ-010",
            "title": "Minimally Invasive Robotic Teleoperator Subsystem Requirement #10",
            "priority": "High",
            "category": "Architecture & Governance",
            "story_points": 5,
            "estimated_hours": 20,
            "description": "Functional specification for Minimally Invasive Robotic Teleoperator requirement #10 adhering to IEC 80601-2-77 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with IEC 80601-2-77.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "SURG-REQ-011",
            "title": "Minimally Invasive Robotic Teleoperator Subsystem Requirement #11",
            "priority": "High",
            "category": "Architecture & Governance",
            "story_points": 5,
            "estimated_hours": 20,
            "description": "Functional specification for Minimally Invasive Robotic Teleoperator requirement #11 adhering to IEC 80601-2-77 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with IEC 80601-2-77.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "SURG-REQ-012",
            "title": "Minimally Invasive Robotic Teleoperator Subsystem Requirement #12",
            "priority": "High",
            "category": "Architecture & Governance",
            "story_points": 5,
            "estimated_hours": 20,
            "description": "Functional specification for Minimally Invasive Robotic Teleoperator requirement #12 adhering to IEC 80601-2-77 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with IEC 80601-2-77.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "SURG-REQ-013",
            "title": "Minimally Invasive Robotic Teleoperator Subsystem Requirement #13",
            "priority": "Medium",
            "category": "Architecture & Governance",
            "story_points": 3,
            "estimated_hours": 12,
            "description": "Functional specification for Minimally Invasive Robotic Teleoperator requirement #13 adhering to IEC 80601-2-77 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with IEC 80601-2-77.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "SURG-REQ-014",
            "title": "Minimally Invasive Robotic Teleoperator Subsystem Requirement #14",
            "priority": "Medium",
            "category": "Architecture & Governance",
            "story_points": 3,
            "estimated_hours": 12,
            "description": "Functional specification for Minimally Invasive Robotic Teleoperator requirement #14 adhering to IEC 80601-2-77 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with IEC 80601-2-77.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "SURG-REQ-015",
            "title": "Minimally Invasive Robotic Teleoperator Subsystem Requirement #15",
            "priority": "Medium",
            "category": "Architecture & Governance",
            "story_points": 3,
            "estimated_hours": 12,
            "description": "Functional specification for Minimally Invasive Robotic Teleoperator requirement #15 adhering to IEC 80601-2-77 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with IEC 80601-2-77.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "SURG-REQ-016",
            "title": "Minimally Invasive Robotic Teleoperator Subsystem Requirement #16",
            "priority": "Medium",
            "category": "Architecture & Governance",
            "story_points": 3,
            "estimated_hours": 12,
            "description": "Functional specification for Minimally Invasive Robotic Teleoperator requirement #16 adhering to IEC 80601-2-77 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with IEC 80601-2-77.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "SURG-REQ-017",
            "title": "Minimally Invasive Robotic Teleoperator Subsystem Requirement #17",
            "priority": "Medium",
            "category": "Architecture & Governance",
            "story_points": 3,
            "estimated_hours": 12,
            "description": "Functional specification for Minimally Invasive Robotic Teleoperator requirement #17 adhering to IEC 80601-2-77 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with IEC 80601-2-77.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "SURG-REQ-018",
            "title": "Minimally Invasive Robotic Teleoperator Subsystem Requirement #18",
            "priority": "Medium",
            "category": "Architecture & Governance",
            "story_points": 3,
            "estimated_hours": 12,
            "description": "Functional specification for Minimally Invasive Robotic Teleoperator requirement #18 adhering to IEC 80601-2-77 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with IEC 80601-2-77.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "SURG-REQ-019",
            "title": "Minimally Invasive Robotic Teleoperator Subsystem Requirement #19",
            "priority": "Medium",
            "category": "Architecture & Governance",
            "story_points": 3,
            "estimated_hours": 12,
            "description": "Functional specification for Minimally Invasive Robotic Teleoperator requirement #19 adhering to IEC 80601-2-77 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with IEC 80601-2-77.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "SURG-REQ-020",
            "title": "Minimally Invasive Robotic Teleoperator Subsystem Requirement #20",
            "priority": "Medium",
            "category": "Architecture & Governance",
            "story_points": 3,
            "estimated_hours": 12,
            "description": "Functional specification for Minimally Invasive Robotic Teleoperator requirement #20 adhering to IEC 80601-2-77 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with IEC 80601-2-77.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
    ]

    TASKS: List[Dict[str, Any]] = [
        {
            "code": "SURG-TSK-01",
            "title": "Implement & Verify Minimally Invasive Robotic Teleoperator Feature #1",
            "priority": "Critical",
            "story_points": 8,
            "estimated_hours": 32,
            "status": "In Progress",
            "progress_percent": 5,
            "requirement_code": "SURG-REQ-001",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Minimally Invasive Robotic Teleoperator task #1."
        },
        {
            "code": "SURG-TSK-02",
            "title": "Implement & Verify Minimally Invasive Robotic Teleoperator Feature #2",
            "priority": "Critical",
            "story_points": 8,
            "estimated_hours": 32,
            "status": "In Progress",
            "progress_percent": 10,
            "requirement_code": "SURG-REQ-002",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Minimally Invasive Robotic Teleoperator task #2."
        },
        {
            "code": "SURG-TSK-03",
            "title": "Implement & Verify Minimally Invasive Robotic Teleoperator Feature #3",
            "priority": "Critical",
            "story_points": 8,
            "estimated_hours": 32,
            "status": "In Progress",
            "progress_percent": 15,
            "requirement_code": "SURG-REQ-003",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Minimally Invasive Robotic Teleoperator task #3."
        },
        {
            "code": "SURG-TSK-04",
            "title": "Implement & Verify Minimally Invasive Robotic Teleoperator Feature #4",
            "priority": "Critical",
            "story_points": 8,
            "estimated_hours": 32,
            "status": "In Progress",
            "progress_percent": 20,
            "requirement_code": "SURG-REQ-004",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Minimally Invasive Robotic Teleoperator task #4."
        },
        {
            "code": "SURG-TSK-05",
            "title": "Implement & Verify Minimally Invasive Robotic Teleoperator Feature #5",
            "priority": "Critical",
            "story_points": 8,
            "estimated_hours": 32,
            "status": "In Progress",
            "progress_percent": 25,
            "requirement_code": "SURG-REQ-005",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Minimally Invasive Robotic Teleoperator task #5."
        },
        {
            "code": "SURG-TSK-06",
            "title": "Implement & Verify Minimally Invasive Robotic Teleoperator Feature #6",
            "priority": "High",
            "story_points": 5,
            "estimated_hours": 20,
            "status": "In Progress",
            "progress_percent": 30,
            "requirement_code": "SURG-REQ-006",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Minimally Invasive Robotic Teleoperator task #6."
        },
        {
            "code": "SURG-TSK-07",
            "title": "Implement & Verify Minimally Invasive Robotic Teleoperator Feature #7",
            "priority": "High",
            "story_points": 5,
            "estimated_hours": 20,
            "status": "In Progress",
            "progress_percent": 35,
            "requirement_code": "SURG-REQ-007",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Minimally Invasive Robotic Teleoperator task #7."
        },
        {
            "code": "SURG-TSK-08",
            "title": "Implement & Verify Minimally Invasive Robotic Teleoperator Feature #8",
            "priority": "High",
            "story_points": 5,
            "estimated_hours": 20,
            "status": "To Do",
            "progress_percent": 40,
            "requirement_code": "SURG-REQ-008",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Minimally Invasive Robotic Teleoperator task #8."
        },
        {
            "code": "SURG-TSK-09",
            "title": "Implement & Verify Minimally Invasive Robotic Teleoperator Feature #9",
            "priority": "High",
            "story_points": 5,
            "estimated_hours": 20,
            "status": "To Do",
            "progress_percent": 45,
            "requirement_code": "SURG-REQ-009",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Minimally Invasive Robotic Teleoperator task #9."
        },
        {
            "code": "SURG-TSK-10",
            "title": "Implement & Verify Minimally Invasive Robotic Teleoperator Feature #10",
            "priority": "High",
            "story_points": 5,
            "estimated_hours": 20,
            "status": "To Do",
            "progress_percent": 50,
            "requirement_code": "SURG-REQ-010",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Minimally Invasive Robotic Teleoperator task #10."
        },
        {
            "code": "SURG-TSK-11",
            "title": "Implement & Verify Minimally Invasive Robotic Teleoperator Feature #11",
            "priority": "High",
            "story_points": 5,
            "estimated_hours": 20,
            "status": "To Do",
            "progress_percent": 55,
            "requirement_code": "SURG-REQ-011",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Minimally Invasive Robotic Teleoperator task #11."
        },
        {
            "code": "SURG-TSK-12",
            "title": "Implement & Verify Minimally Invasive Robotic Teleoperator Feature #12",
            "priority": "High",
            "story_points": 5,
            "estimated_hours": 20,
            "status": "To Do",
            "progress_percent": 60,
            "requirement_code": "SURG-REQ-012",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Minimally Invasive Robotic Teleoperator task #12."
        },
        {
            "code": "SURG-TSK-13",
            "title": "Implement & Verify Minimally Invasive Robotic Teleoperator Feature #13",
            "priority": "Medium",
            "story_points": 3,
            "estimated_hours": 12,
            "status": "To Do",
            "progress_percent": 65,
            "requirement_code": "SURG-REQ-013",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Minimally Invasive Robotic Teleoperator task #13."
        },
        {
            "code": "SURG-TSK-14",
            "title": "Implement & Verify Minimally Invasive Robotic Teleoperator Feature #14",
            "priority": "Medium",
            "story_points": 3,
            "estimated_hours": 12,
            "status": "To Do",
            "progress_percent": 70,
            "requirement_code": "SURG-REQ-014",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Minimally Invasive Robotic Teleoperator task #14."
        },
        {
            "code": "SURG-TSK-15",
            "title": "Implement & Verify Minimally Invasive Robotic Teleoperator Feature #15",
            "priority": "Medium",
            "story_points": 3,
            "estimated_hours": 12,
            "status": "Ready for Testing",
            "progress_percent": 75,
            "requirement_code": "SURG-REQ-015",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Minimally Invasive Robotic Teleoperator task #15."
        },
        {
            "code": "SURG-TSK-16",
            "title": "Implement & Verify Minimally Invasive Robotic Teleoperator Feature #16",
            "priority": "Medium",
            "story_points": 3,
            "estimated_hours": 12,
            "status": "Ready for Testing",
            "progress_percent": 100,
            "requirement_code": "SURG-REQ-016",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Minimally Invasive Robotic Teleoperator task #16."
        },
        {
            "code": "SURG-TSK-17",
            "title": "Implement & Verify Minimally Invasive Robotic Teleoperator Feature #17",
            "priority": "Medium",
            "story_points": 3,
            "estimated_hours": 12,
            "status": "Ready for Testing",
            "progress_percent": 100,
            "requirement_code": "SURG-REQ-017",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Minimally Invasive Robotic Teleoperator task #17."
        },
        {
            "code": "SURG-TSK-18",
            "title": "Implement & Verify Minimally Invasive Robotic Teleoperator Feature #18",
            "priority": "Medium",
            "story_points": 3,
            "estimated_hours": 12,
            "status": "Ready for Testing",
            "progress_percent": 100,
            "requirement_code": "SURG-REQ-018",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Minimally Invasive Robotic Teleoperator task #18."
        },
        {
            "code": "SURG-TSK-19",
            "title": "Implement & Verify Minimally Invasive Robotic Teleoperator Feature #19",
            "priority": "Medium",
            "story_points": 3,
            "estimated_hours": 12,
            "status": "Ready for Testing",
            "progress_percent": 100,
            "requirement_code": "SURG-REQ-019",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Minimally Invasive Robotic Teleoperator task #19."
        },
        {
            "code": "SURG-TSK-20",
            "title": "Implement & Verify Minimally Invasive Robotic Teleoperator Feature #20",
            "priority": "Medium",
            "story_points": 3,
            "estimated_hours": 12,
            "status": "Ready for Testing",
            "progress_percent": 100,
            "requirement_code": "SURG-REQ-020",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Minimally Invasive Robotic Teleoperator task #20."
        },
    ]

    TEST_CASES: List[Dict[str, Any]] = [
        {
            "code": "SURG-TC-01",
            "title": "QA Test Verification Procedure #1 for Minimally Invasive Robotic Teleoperator",
            "test_type": "Security",
            "priority": "Critical",
            "requirement_code": "SURG-REQ-001",
            "preconditions": "1. Test fixture calibrated under IEC 80601-2-77.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under IEC 80601-2-77."
        },
        {
            "code": "SURG-TC-02",
            "title": "QA Test Verification Procedure #2 for Minimally Invasive Robotic Teleoperator",
            "test_type": "Unit",
            "priority": "Critical",
            "requirement_code": "SURG-REQ-002",
            "preconditions": "1. Test fixture calibrated under IEC 80601-2-77.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under IEC 80601-2-77."
        },
        {
            "code": "SURG-TC-03",
            "title": "QA Test Verification Procedure #3 for Minimally Invasive Robotic Teleoperator",
            "test_type": "Integration",
            "priority": "Critical",
            "requirement_code": "SURG-REQ-003",
            "preconditions": "1. Test fixture calibrated under IEC 80601-2-77.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under IEC 80601-2-77."
        },
        {
            "code": "SURG-TC-04",
            "title": "QA Test Verification Procedure #4 for Minimally Invasive Robotic Teleoperator",
            "test_type": "Unit",
            "priority": "Critical",
            "requirement_code": "SURG-REQ-004",
            "preconditions": "1. Test fixture calibrated under IEC 80601-2-77.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under IEC 80601-2-77."
        },
        {
            "code": "SURG-TC-05",
            "title": "QA Test Verification Procedure #5 for Minimally Invasive Robotic Teleoperator",
            "test_type": "Security",
            "priority": "High",
            "requirement_code": "SURG-REQ-005",
            "preconditions": "1. Test fixture calibrated under IEC 80601-2-77.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under IEC 80601-2-77."
        },
        {
            "code": "SURG-TC-06",
            "title": "QA Test Verification Procedure #6 for Minimally Invasive Robotic Teleoperator",
            "test_type": "Integration",
            "priority": "High",
            "requirement_code": "SURG-REQ-006",
            "preconditions": "1. Test fixture calibrated under IEC 80601-2-77.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under IEC 80601-2-77."
        },
        {
            "code": "SURG-TC-07",
            "title": "QA Test Verification Procedure #7 for Minimally Invasive Robotic Teleoperator",
            "test_type": "Security",
            "priority": "High",
            "requirement_code": "SURG-REQ-007",
            "preconditions": "1. Test fixture calibrated under IEC 80601-2-77.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under IEC 80601-2-77."
        },
        {
            "code": "SURG-TC-08",
            "title": "QA Test Verification Procedure #8 for Minimally Invasive Robotic Teleoperator",
            "test_type": "Unit",
            "priority": "High",
            "requirement_code": "SURG-REQ-008",
            "preconditions": "1. Test fixture calibrated under IEC 80601-2-77.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under IEC 80601-2-77."
        },
        {
            "code": "SURG-TC-09",
            "title": "QA Test Verification Procedure #9 for Minimally Invasive Robotic Teleoperator",
            "test_type": "Integration",
            "priority": "High",
            "requirement_code": "SURG-REQ-009",
            "preconditions": "1. Test fixture calibrated under IEC 80601-2-77.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under IEC 80601-2-77."
        },
        {
            "code": "SURG-TC-10",
            "title": "QA Test Verification Procedure #10 for Minimally Invasive Robotic Teleoperator",
            "test_type": "Unit",
            "priority": "High",
            "requirement_code": "SURG-REQ-010",
            "preconditions": "1. Test fixture calibrated under IEC 80601-2-77.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under IEC 80601-2-77."
        },
        {
            "code": "SURG-TC-11",
            "title": "QA Test Verification Procedure #11 for Minimally Invasive Robotic Teleoperator",
            "test_type": "Security",
            "priority": "Medium",
            "requirement_code": "SURG-REQ-011",
            "preconditions": "1. Test fixture calibrated under IEC 80601-2-77.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under IEC 80601-2-77."
        },
        {
            "code": "SURG-TC-12",
            "title": "QA Test Verification Procedure #12 for Minimally Invasive Robotic Teleoperator",
            "test_type": "Integration",
            "priority": "Medium",
            "requirement_code": "SURG-REQ-012",
            "preconditions": "1. Test fixture calibrated under IEC 80601-2-77.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under IEC 80601-2-77."
        },
        {
            "code": "SURG-TC-13",
            "title": "QA Test Verification Procedure #13 for Minimally Invasive Robotic Teleoperator",
            "test_type": "Security",
            "priority": "Medium",
            "requirement_code": "SURG-REQ-013",
            "preconditions": "1. Test fixture calibrated under IEC 80601-2-77.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under IEC 80601-2-77."
        },
        {
            "code": "SURG-TC-14",
            "title": "QA Test Verification Procedure #14 for Minimally Invasive Robotic Teleoperator",
            "test_type": "Unit",
            "priority": "Medium",
            "requirement_code": "SURG-REQ-014",
            "preconditions": "1. Test fixture calibrated under IEC 80601-2-77.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under IEC 80601-2-77."
        },
        {
            "code": "SURG-TC-15",
            "title": "QA Test Verification Procedure #15 for Minimally Invasive Robotic Teleoperator",
            "test_type": "Integration",
            "priority": "Medium",
            "requirement_code": "SURG-REQ-015",
            "preconditions": "1. Test fixture calibrated under IEC 80601-2-77.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under IEC 80601-2-77."
        },
    ]

    DEFECTS: List[Dict[str, Any]] = [
        {
            "title": "Telemetry jitter or race condition in Minimally Invasive Robotic Teleoperator subsystem #1",
            "severity": "Critical",
            "priority": "High",
            "requirement_code": "SURG-REQ-001",
            "task_code": "SURG-TSK-01",
            "steps_to_reproduce": "1. Inject concurrent load under degraded communication bus.\n2. Observe thread contention in Minimally Invasive Robotic Teleoperator controller.",
            "remediation_notes": "Refactored lock ordering, introduced lock-free ring buffers, and added regression tests under IEC 80601-2-77."
        },
        {
            "title": "Telemetry jitter or race condition in Minimally Invasive Robotic Teleoperator subsystem #2",
            "severity": "Critical",
            "priority": "High",
            "requirement_code": "SURG-REQ-002",
            "task_code": "SURG-TSK-02",
            "steps_to_reproduce": "1. Inject concurrent load under degraded communication bus.\n2. Observe thread contention in Minimally Invasive Robotic Teleoperator controller.",
            "remediation_notes": "Refactored lock ordering, introduced lock-free ring buffers, and added regression tests under IEC 80601-2-77."
        },
        {
            "title": "Telemetry jitter or race condition in Minimally Invasive Robotic Teleoperator subsystem #3",
            "severity": "High",
            "priority": "High",
            "requirement_code": "SURG-REQ-003",
            "task_code": "SURG-TSK-03",
            "steps_to_reproduce": "1. Inject concurrent load under degraded communication bus.\n2. Observe thread contention in Minimally Invasive Robotic Teleoperator controller.",
            "remediation_notes": "Refactored lock ordering, introduced lock-free ring buffers, and added regression tests under IEC 80601-2-77."
        },
        {
            "title": "Telemetry jitter or race condition in Minimally Invasive Robotic Teleoperator subsystem #4",
            "severity": "High",
            "priority": "High",
            "requirement_code": "SURG-REQ-004",
            "task_code": "SURG-TSK-04",
            "steps_to_reproduce": "1. Inject concurrent load under degraded communication bus.\n2. Observe thread contention in Minimally Invasive Robotic Teleoperator controller.",
            "remediation_notes": "Refactored lock ordering, introduced lock-free ring buffers, and added regression tests under IEC 80601-2-77."
        },
        {
            "title": "Telemetry jitter or race condition in Minimally Invasive Robotic Teleoperator subsystem #5",
            "severity": "High",
            "priority": "Medium",
            "requirement_code": "SURG-REQ-005",
            "task_code": "SURG-TSK-05",
            "steps_to_reproduce": "1. Inject concurrent load under degraded communication bus.\n2. Observe thread contention in Minimally Invasive Robotic Teleoperator controller.",
            "remediation_notes": "Refactored lock ordering, introduced lock-free ring buffers, and added regression tests under IEC 80601-2-77."
        },
        {
            "title": "Telemetry jitter or race condition in Minimally Invasive Robotic Teleoperator subsystem #6",
            "severity": "Medium",
            "priority": "Medium",
            "requirement_code": "SURG-REQ-006",
            "task_code": "SURG-TSK-06",
            "steps_to_reproduce": "1. Inject concurrent load under degraded communication bus.\n2. Observe thread contention in Minimally Invasive Robotic Teleoperator controller.",
            "remediation_notes": "Refactored lock ordering, introduced lock-free ring buffers, and added regression tests under IEC 80601-2-77."
        },
        {
            "title": "Telemetry jitter or race condition in Minimally Invasive Robotic Teleoperator subsystem #7",
            "severity": "Medium",
            "priority": "Medium",
            "requirement_code": "SURG-REQ-007",
            "task_code": "SURG-TSK-07",
            "steps_to_reproduce": "1. Inject concurrent load under degraded communication bus.\n2. Observe thread contention in Minimally Invasive Robotic Teleoperator controller.",
            "remediation_notes": "Refactored lock ordering, introduced lock-free ring buffers, and added regression tests under IEC 80601-2-77."
        },
        {
            "title": "Telemetry jitter or race condition in Minimally Invasive Robotic Teleoperator subsystem #8",
            "severity": "Medium",
            "priority": "Medium",
            "requirement_code": "SURG-REQ-008",
            "task_code": "SURG-TSK-08",
            "steps_to_reproduce": "1. Inject concurrent load under degraded communication bus.\n2. Observe thread contention in Minimally Invasive Robotic Teleoperator controller.",
            "remediation_notes": "Refactored lock ordering, introduced lock-free ring buffers, and added regression tests under IEC 80601-2-77."
        },
        {
            "title": "Telemetry jitter or race condition in Minimally Invasive Robotic Teleoperator subsystem #9",
            "severity": "Medium",
            "priority": "Medium",
            "requirement_code": "SURG-REQ-009",
            "task_code": "SURG-TSK-09",
            "steps_to_reproduce": "1. Inject concurrent load under degraded communication bus.\n2. Observe thread contention in Minimally Invasive Robotic Teleoperator controller.",
            "remediation_notes": "Refactored lock ordering, introduced lock-free ring buffers, and added regression tests under IEC 80601-2-77."
        },
        {
            "title": "Telemetry jitter or race condition in Minimally Invasive Robotic Teleoperator subsystem #10",
            "severity": "Medium",
            "priority": "Medium",
            "requirement_code": "SURG-REQ-010",
            "task_code": "SURG-TSK-10",
            "steps_to_reproduce": "1. Inject concurrent load under degraded communication bus.\n2. Observe thread contention in Minimally Invasive Robotic Teleoperator controller.",
            "remediation_notes": "Refactored lock ordering, introduced lock-free ring buffers, and added regression tests under IEC 80601-2-77."
        },
    ]

    @classmethod
    def get_summary(cls) -> Dict[str, Any]:
        return {
            "name": cls.DOMAIN_NAME,
            "standard": cls.STANDARD_CODE,
            "prefix": cls.CODE_PREFIX,
            "total_requirements": len(cls.REQUIREMENTS),
            "total_tasks": len(cls.TASKS),
            "total_test_cases": len(cls.TEST_CASES),
            "total_defects": len(cls.DEFECTS),
            "total_story_points": sum(r["story_points"] for r in cls.REQUIREMENTS),
            "total_estimated_hours": sum(r["estimated_hours"] for r in cls.REQUIREMENTS)
        }


def verify_surg_compliance_rule_1(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Verification function #1 for Minimally Invasive Robotic Teleoperator under standard IEC 80601-2-77."""
    if not payload:
        return {"rule_id": "SURG-VER-01", "status": "FAILED", "reason": "Payload is empty"}
    req_count = len(payload.get("requirements", []))
    task_count = len(payload.get("tasks", []))
    is_valid = req_count > 0 and task_count >= req_count
    return {
        "rule_id": "SURG-VER-01",
        "domain": "Minimally Invasive Robotic Teleoperator",
        "standard": "IEC 80601-2-77",
        "rule_index": 1,
        "is_valid": is_valid,
        "conformance_level": "Level-A" if is_valid else "Non-Conformant",
        "margin_score": 0.985 if is_valid else 0.420
    }


def verify_surg_compliance_rule_2(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Verification function #2 for Minimally Invasive Robotic Teleoperator under standard IEC 80601-2-77."""
    if not payload:
        return {"rule_id": "SURG-VER-02", "status": "FAILED", "reason": "Payload is empty"}
    req_count = len(payload.get("requirements", []))
    task_count = len(payload.get("tasks", []))
    is_valid = req_count > 0 and task_count >= req_count
    return {
        "rule_id": "SURG-VER-02",
        "domain": "Minimally Invasive Robotic Teleoperator",
        "standard": "IEC 80601-2-77",
        "rule_index": 2,
        "is_valid": is_valid,
        "conformance_level": "Level-A" if is_valid else "Non-Conformant",
        "margin_score": 0.985 if is_valid else 0.420
    }


def verify_surg_compliance_rule_3(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Verification function #3 for Minimally Invasive Robotic Teleoperator under standard IEC 80601-2-77."""
    if not payload:
        return {"rule_id": "SURG-VER-03", "status": "FAILED", "reason": "Payload is empty"}
    req_count = len(payload.get("requirements", []))
    task_count = len(payload.get("tasks", []))
    is_valid = req_count > 0 and task_count >= req_count
    return {
        "rule_id": "SURG-VER-03",
        "domain": "Minimally Invasive Robotic Teleoperator",
        "standard": "IEC 80601-2-77",
        "rule_index": 3,
        "is_valid": is_valid,
        "conformance_level": "Level-A" if is_valid else "Non-Conformant",
        "margin_score": 0.985 if is_valid else 0.420
    }


def verify_surg_compliance_rule_4(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Verification function #4 for Minimally Invasive Robotic Teleoperator under standard IEC 80601-2-77."""
    if not payload:
        return {"rule_id": "SURG-VER-04", "status": "FAILED", "reason": "Payload is empty"}
    req_count = len(payload.get("requirements", []))
    task_count = len(payload.get("tasks", []))
    is_valid = req_count > 0 and task_count >= req_count
    return {
        "rule_id": "SURG-VER-04",
        "domain": "Minimally Invasive Robotic Teleoperator",
        "standard": "IEC 80601-2-77",
        "rule_index": 4,
        "is_valid": is_valid,
        "conformance_level": "Level-A" if is_valid else "Non-Conformant",
        "margin_score": 0.985 if is_valid else 0.420
    }


def verify_surg_compliance_rule_5(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Verification function #5 for Minimally Invasive Robotic Teleoperator under standard IEC 80601-2-77."""
    if not payload:
        return {"rule_id": "SURG-VER-05", "status": "FAILED", "reason": "Payload is empty"}
    req_count = len(payload.get("requirements", []))
    task_count = len(payload.get("tasks", []))
    is_valid = req_count > 0 and task_count >= req_count
    return {
        "rule_id": "SURG-VER-05",
        "domain": "Minimally Invasive Robotic Teleoperator",
        "standard": "IEC 80601-2-77",
        "rule_index": 5,
        "is_valid": is_valid,
        "conformance_level": "Level-A" if is_valid else "Non-Conformant",
        "margin_score": 0.985 if is_valid else 0.420
    }


def verify_surg_compliance_rule_6(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Verification function #6 for Minimally Invasive Robotic Teleoperator under standard IEC 80601-2-77."""
    if not payload:
        return {"rule_id": "SURG-VER-06", "status": "FAILED", "reason": "Payload is empty"}
    req_count = len(payload.get("requirements", []))
    task_count = len(payload.get("tasks", []))
    is_valid = req_count > 0 and task_count >= req_count
    return {
        "rule_id": "SURG-VER-06",
        "domain": "Minimally Invasive Robotic Teleoperator",
        "standard": "IEC 80601-2-77",
        "rule_index": 6,
        "is_valid": is_valid,
        "conformance_level": "Level-A" if is_valid else "Non-Conformant",
        "margin_score": 0.985 if is_valid else 0.420
    }


def verify_surg_compliance_rule_7(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Verification function #7 for Minimally Invasive Robotic Teleoperator under standard IEC 80601-2-77."""
    if not payload:
        return {"rule_id": "SURG-VER-07", "status": "FAILED", "reason": "Payload is empty"}
    req_count = len(payload.get("requirements", []))
    task_count = len(payload.get("tasks", []))
    is_valid = req_count > 0 and task_count >= req_count
    return {
        "rule_id": "SURG-VER-07",
        "domain": "Minimally Invasive Robotic Teleoperator",
        "standard": "IEC 80601-2-77",
        "rule_index": 7,
        "is_valid": is_valid,
        "conformance_level": "Level-A" if is_valid else "Non-Conformant",
        "margin_score": 0.985 if is_valid else 0.420
    }


def verify_surg_compliance_rule_8(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Verification function #8 for Minimally Invasive Robotic Teleoperator under standard IEC 80601-2-77."""
    if not payload:
        return {"rule_id": "SURG-VER-08", "status": "FAILED", "reason": "Payload is empty"}
    req_count = len(payload.get("requirements", []))
    task_count = len(payload.get("tasks", []))
    is_valid = req_count > 0 and task_count >= req_count
    return {
        "rule_id": "SURG-VER-08",
        "domain": "Minimally Invasive Robotic Teleoperator",
        "standard": "IEC 80601-2-77",
        "rule_index": 8,
        "is_valid": is_valid,
        "conformance_level": "Level-A" if is_valid else "Non-Conformant",
        "margin_score": 0.985 if is_valid else 0.420
    }


def verify_surg_compliance_rule_9(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Verification function #9 for Minimally Invasive Robotic Teleoperator under standard IEC 80601-2-77."""
    if not payload:
        return {"rule_id": "SURG-VER-09", "status": "FAILED", "reason": "Payload is empty"}
    req_count = len(payload.get("requirements", []))
    task_count = len(payload.get("tasks", []))
    is_valid = req_count > 0 and task_count >= req_count
    return {
        "rule_id": "SURG-VER-09",
        "domain": "Minimally Invasive Robotic Teleoperator",
        "standard": "IEC 80601-2-77",
        "rule_index": 9,
        "is_valid": is_valid,
        "conformance_level": "Level-A" if is_valid else "Non-Conformant",
        "margin_score": 0.985 if is_valid else 0.420
    }


def verify_surg_compliance_rule_10(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Verification function #10 for Minimally Invasive Robotic Teleoperator under standard IEC 80601-2-77."""
    if not payload:
        return {"rule_id": "SURG-VER-10", "status": "FAILED", "reason": "Payload is empty"}
    req_count = len(payload.get("requirements", []))
    task_count = len(payload.get("tasks", []))
    is_valid = req_count > 0 and task_count >= req_count
    return {
        "rule_id": "SURG-VER-10",
        "domain": "Minimally Invasive Robotic Teleoperator",
        "standard": "IEC 80601-2-77",
        "rule_index": 10,
        "is_valid": is_valid,
        "conformance_level": "Level-A" if is_valid else "Non-Conformant",
        "margin_score": 0.985 if is_valid else 0.420
    }


def verify_surg_compliance_rule_11(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Verification function #11 for Minimally Invasive Robotic Teleoperator under standard IEC 80601-2-77."""
    if not payload:
        return {"rule_id": "SURG-VER-11", "status": "FAILED", "reason": "Payload is empty"}
    req_count = len(payload.get("requirements", []))
    task_count = len(payload.get("tasks", []))
    is_valid = req_count > 0 and task_count >= req_count
    return {
        "rule_id": "SURG-VER-11",
        "domain": "Minimally Invasive Robotic Teleoperator",
        "standard": "IEC 80601-2-77",
        "rule_index": 11,
        "is_valid": is_valid,
        "conformance_level": "Level-A" if is_valid else "Non-Conformant",
        "margin_score": 0.985 if is_valid else 0.420
    }


def verify_surg_compliance_rule_12(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Verification function #12 for Minimally Invasive Robotic Teleoperator under standard IEC 80601-2-77."""
    if not payload:
        return {"rule_id": "SURG-VER-12", "status": "FAILED", "reason": "Payload is empty"}
    req_count = len(payload.get("requirements", []))
    task_count = len(payload.get("tasks", []))
    is_valid = req_count > 0 and task_count >= req_count
    return {
        "rule_id": "SURG-VER-12",
        "domain": "Minimally Invasive Robotic Teleoperator",
        "standard": "IEC 80601-2-77",
        "rule_index": 12,
        "is_valid": is_valid,
        "conformance_level": "Level-A" if is_valid else "Non-Conformant",
        "margin_score": 0.985 if is_valid else 0.420
    }
