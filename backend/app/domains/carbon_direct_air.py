"""
TraceHub Domain Specification: Direct Air Carbon Capture Solid Adsorbent
Standard: ISO 14064 | Identifier Prefix: DAC
Exhaustive requirement models, sprint task matrices, QA verification vectors, and defect profiles.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class CarbonDirectAirRequirement(BaseModel):
    code: str
    title: str
    priority: str
    category: str
    story_points: int
    estimated_hours: int
    description: str
    acceptance_criteria: List[str]

class CarbonDirectAirTask(BaseModel):
    code: str
    title: str
    priority: str
    story_points: int
    estimated_hours: int
    status: str
    progress_percent: int
    requirement_code: str
    technical_notes: str

class CarbonDirectAirTestCase(BaseModel):
    code: str
    title: str
    test_type: str
    priority: str
    requirement_code: str
    preconditions: str
    steps: List[str]
    expected_result: str

class CarbonDirectAirDefect(BaseModel):
    title: str
    severity: str
    priority: str
    requirement_code: str
    task_code: str
    steps_to_reproduce: str
    remediation_notes: str

class CarbonDirectAirDomainSpecification:
    """Domain specification provider for Direct Air Carbon Capture Solid Adsorbent complying with ISO 14064."""
    DOMAIN_NAME = "Direct Air Carbon Capture Solid Adsorbent"
    STANDARD_CODE = "ISO 14064"
    CODE_PREFIX = "DAC"

    REQUIREMENTS: List[Dict[str, Any]] = [
        {
            "code": "DAC-REQ-001",
            "title": "Direct Air Carbon Capture Solid Adsorbent Subsystem Requirement #1",
            "priority": "Critical",
            "category": "Architecture & Governance",
            "story_points": 8,
            "estimated_hours": 32,
            "description": "Functional specification for Direct Air Carbon Capture Solid Adsorbent requirement #1 adhering to ISO 14064 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with ISO 14064.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "DAC-REQ-002",
            "title": "Direct Air Carbon Capture Solid Adsorbent Subsystem Requirement #2",
            "priority": "Critical",
            "category": "Architecture & Governance",
            "story_points": 8,
            "estimated_hours": 32,
            "description": "Functional specification for Direct Air Carbon Capture Solid Adsorbent requirement #2 adhering to ISO 14064 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with ISO 14064.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "DAC-REQ-003",
            "title": "Direct Air Carbon Capture Solid Adsorbent Subsystem Requirement #3",
            "priority": "Critical",
            "category": "Architecture & Governance",
            "story_points": 8,
            "estimated_hours": 32,
            "description": "Functional specification for Direct Air Carbon Capture Solid Adsorbent requirement #3 adhering to ISO 14064 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with ISO 14064.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "DAC-REQ-004",
            "title": "Direct Air Carbon Capture Solid Adsorbent Subsystem Requirement #4",
            "priority": "Critical",
            "category": "Architecture & Governance",
            "story_points": 8,
            "estimated_hours": 32,
            "description": "Functional specification for Direct Air Carbon Capture Solid Adsorbent requirement #4 adhering to ISO 14064 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with ISO 14064.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "DAC-REQ-005",
            "title": "Direct Air Carbon Capture Solid Adsorbent Subsystem Requirement #5",
            "priority": "Critical",
            "category": "Architecture & Governance",
            "story_points": 8,
            "estimated_hours": 32,
            "description": "Functional specification for Direct Air Carbon Capture Solid Adsorbent requirement #5 adhering to ISO 14064 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with ISO 14064.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "DAC-REQ-006",
            "title": "Direct Air Carbon Capture Solid Adsorbent Subsystem Requirement #6",
            "priority": "High",
            "category": "Architecture & Governance",
            "story_points": 5,
            "estimated_hours": 20,
            "description": "Functional specification for Direct Air Carbon Capture Solid Adsorbent requirement #6 adhering to ISO 14064 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with ISO 14064.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "DAC-REQ-007",
            "title": "Direct Air Carbon Capture Solid Adsorbent Subsystem Requirement #7",
            "priority": "High",
            "category": "Architecture & Governance",
            "story_points": 5,
            "estimated_hours": 20,
            "description": "Functional specification for Direct Air Carbon Capture Solid Adsorbent requirement #7 adhering to ISO 14064 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with ISO 14064.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "DAC-REQ-008",
            "title": "Direct Air Carbon Capture Solid Adsorbent Subsystem Requirement #8",
            "priority": "High",
            "category": "Architecture & Governance",
            "story_points": 5,
            "estimated_hours": 20,
            "description": "Functional specification for Direct Air Carbon Capture Solid Adsorbent requirement #8 adhering to ISO 14064 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with ISO 14064.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "DAC-REQ-009",
            "title": "Direct Air Carbon Capture Solid Adsorbent Subsystem Requirement #9",
            "priority": "High",
            "category": "Architecture & Governance",
            "story_points": 5,
            "estimated_hours": 20,
            "description": "Functional specification for Direct Air Carbon Capture Solid Adsorbent requirement #9 adhering to ISO 14064 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with ISO 14064.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "DAC-REQ-010",
            "title": "Direct Air Carbon Capture Solid Adsorbent Subsystem Requirement #10",
            "priority": "High",
            "category": "Architecture & Governance",
            "story_points": 5,
            "estimated_hours": 20,
            "description": "Functional specification for Direct Air Carbon Capture Solid Adsorbent requirement #10 adhering to ISO 14064 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with ISO 14064.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "DAC-REQ-011",
            "title": "Direct Air Carbon Capture Solid Adsorbent Subsystem Requirement #11",
            "priority": "High",
            "category": "Architecture & Governance",
            "story_points": 5,
            "estimated_hours": 20,
            "description": "Functional specification for Direct Air Carbon Capture Solid Adsorbent requirement #11 adhering to ISO 14064 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with ISO 14064.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "DAC-REQ-012",
            "title": "Direct Air Carbon Capture Solid Adsorbent Subsystem Requirement #12",
            "priority": "High",
            "category": "Architecture & Governance",
            "story_points": 5,
            "estimated_hours": 20,
            "description": "Functional specification for Direct Air Carbon Capture Solid Adsorbent requirement #12 adhering to ISO 14064 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with ISO 14064.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "DAC-REQ-013",
            "title": "Direct Air Carbon Capture Solid Adsorbent Subsystem Requirement #13",
            "priority": "Medium",
            "category": "Architecture & Governance",
            "story_points": 3,
            "estimated_hours": 12,
            "description": "Functional specification for Direct Air Carbon Capture Solid Adsorbent requirement #13 adhering to ISO 14064 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with ISO 14064.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "DAC-REQ-014",
            "title": "Direct Air Carbon Capture Solid Adsorbent Subsystem Requirement #14",
            "priority": "Medium",
            "category": "Architecture & Governance",
            "story_points": 3,
            "estimated_hours": 12,
            "description": "Functional specification for Direct Air Carbon Capture Solid Adsorbent requirement #14 adhering to ISO 14064 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with ISO 14064.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "DAC-REQ-015",
            "title": "Direct Air Carbon Capture Solid Adsorbent Subsystem Requirement #15",
            "priority": "Medium",
            "category": "Architecture & Governance",
            "story_points": 3,
            "estimated_hours": 12,
            "description": "Functional specification for Direct Air Carbon Capture Solid Adsorbent requirement #15 adhering to ISO 14064 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with ISO 14064.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "DAC-REQ-016",
            "title": "Direct Air Carbon Capture Solid Adsorbent Subsystem Requirement #16",
            "priority": "Medium",
            "category": "Architecture & Governance",
            "story_points": 3,
            "estimated_hours": 12,
            "description": "Functional specification for Direct Air Carbon Capture Solid Adsorbent requirement #16 adhering to ISO 14064 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with ISO 14064.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "DAC-REQ-017",
            "title": "Direct Air Carbon Capture Solid Adsorbent Subsystem Requirement #17",
            "priority": "Medium",
            "category": "Architecture & Governance",
            "story_points": 3,
            "estimated_hours": 12,
            "description": "Functional specification for Direct Air Carbon Capture Solid Adsorbent requirement #17 adhering to ISO 14064 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with ISO 14064.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "DAC-REQ-018",
            "title": "Direct Air Carbon Capture Solid Adsorbent Subsystem Requirement #18",
            "priority": "Medium",
            "category": "Architecture & Governance",
            "story_points": 3,
            "estimated_hours": 12,
            "description": "Functional specification for Direct Air Carbon Capture Solid Adsorbent requirement #18 adhering to ISO 14064 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with ISO 14064.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "DAC-REQ-019",
            "title": "Direct Air Carbon Capture Solid Adsorbent Subsystem Requirement #19",
            "priority": "Medium",
            "category": "Architecture & Governance",
            "story_points": 3,
            "estimated_hours": 12,
            "description": "Functional specification for Direct Air Carbon Capture Solid Adsorbent requirement #19 adhering to ISO 14064 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with ISO 14064.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "DAC-REQ-020",
            "title": "Direct Air Carbon Capture Solid Adsorbent Subsystem Requirement #20",
            "priority": "Medium",
            "category": "Architecture & Governance",
            "story_points": 3,
            "estimated_hours": 12,
            "description": "Functional specification for Direct Air Carbon Capture Solid Adsorbent requirement #20 adhering to ISO 14064 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with ISO 14064.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
    ]

    TASKS: List[Dict[str, Any]] = [
        {
            "code": "DAC-TSK-01",
            "title": "Implement & Verify Direct Air Carbon Capture Solid Adsorbent Feature #1",
            "priority": "Critical",
            "story_points": 8,
            "estimated_hours": 32,
            "status": "In Progress",
            "progress_percent": 5,
            "requirement_code": "DAC-REQ-001",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Direct Air Carbon Capture Solid Adsorbent task #1."
        },
        {
            "code": "DAC-TSK-02",
            "title": "Implement & Verify Direct Air Carbon Capture Solid Adsorbent Feature #2",
            "priority": "Critical",
            "story_points": 8,
            "estimated_hours": 32,
            "status": "In Progress",
            "progress_percent": 10,
            "requirement_code": "DAC-REQ-002",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Direct Air Carbon Capture Solid Adsorbent task #2."
        },
        {
            "code": "DAC-TSK-03",
            "title": "Implement & Verify Direct Air Carbon Capture Solid Adsorbent Feature #3",
            "priority": "Critical",
            "story_points": 8,
            "estimated_hours": 32,
            "status": "In Progress",
            "progress_percent": 15,
            "requirement_code": "DAC-REQ-003",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Direct Air Carbon Capture Solid Adsorbent task #3."
        },
        {
            "code": "DAC-TSK-04",
            "title": "Implement & Verify Direct Air Carbon Capture Solid Adsorbent Feature #4",
            "priority": "Critical",
            "story_points": 8,
            "estimated_hours": 32,
            "status": "In Progress",
            "progress_percent": 20,
            "requirement_code": "DAC-REQ-004",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Direct Air Carbon Capture Solid Adsorbent task #4."
        },
        {
            "code": "DAC-TSK-05",
            "title": "Implement & Verify Direct Air Carbon Capture Solid Adsorbent Feature #5",
            "priority": "Critical",
            "story_points": 8,
            "estimated_hours": 32,
            "status": "In Progress",
            "progress_percent": 25,
            "requirement_code": "DAC-REQ-005",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Direct Air Carbon Capture Solid Adsorbent task #5."
        },
        {
            "code": "DAC-TSK-06",
            "title": "Implement & Verify Direct Air Carbon Capture Solid Adsorbent Feature #6",
            "priority": "High",
            "story_points": 5,
            "estimated_hours": 20,
            "status": "In Progress",
            "progress_percent": 30,
            "requirement_code": "DAC-REQ-006",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Direct Air Carbon Capture Solid Adsorbent task #6."
        },
        {
            "code": "DAC-TSK-07",
            "title": "Implement & Verify Direct Air Carbon Capture Solid Adsorbent Feature #7",
            "priority": "High",
            "story_points": 5,
            "estimated_hours": 20,
            "status": "In Progress",
            "progress_percent": 35,
            "requirement_code": "DAC-REQ-007",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Direct Air Carbon Capture Solid Adsorbent task #7."
        },
        {
            "code": "DAC-TSK-08",
            "title": "Implement & Verify Direct Air Carbon Capture Solid Adsorbent Feature #8",
            "priority": "High",
            "story_points": 5,
            "estimated_hours": 20,
            "status": "To Do",
            "progress_percent": 40,
            "requirement_code": "DAC-REQ-008",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Direct Air Carbon Capture Solid Adsorbent task #8."
        },
        {
            "code": "DAC-TSK-09",
            "title": "Implement & Verify Direct Air Carbon Capture Solid Adsorbent Feature #9",
            "priority": "High",
            "story_points": 5,
            "estimated_hours": 20,
            "status": "To Do",
            "progress_percent": 45,
            "requirement_code": "DAC-REQ-009",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Direct Air Carbon Capture Solid Adsorbent task #9."
        },
        {
            "code": "DAC-TSK-10",
            "title": "Implement & Verify Direct Air Carbon Capture Solid Adsorbent Feature #10",
            "priority": "High",
            "story_points": 5,
            "estimated_hours": 20,
            "status": "To Do",
            "progress_percent": 50,
            "requirement_code": "DAC-REQ-010",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Direct Air Carbon Capture Solid Adsorbent task #10."
        },
        {
            "code": "DAC-TSK-11",
            "title": "Implement & Verify Direct Air Carbon Capture Solid Adsorbent Feature #11",
            "priority": "High",
            "story_points": 5,
            "estimated_hours": 20,
            "status": "To Do",
            "progress_percent": 55,
            "requirement_code": "DAC-REQ-011",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Direct Air Carbon Capture Solid Adsorbent task #11."
        },
        {
            "code": "DAC-TSK-12",
            "title": "Implement & Verify Direct Air Carbon Capture Solid Adsorbent Feature #12",
            "priority": "High",
            "story_points": 5,
            "estimated_hours": 20,
            "status": "To Do",
            "progress_percent": 60,
            "requirement_code": "DAC-REQ-012",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Direct Air Carbon Capture Solid Adsorbent task #12."
        },
        {
            "code": "DAC-TSK-13",
            "title": "Implement & Verify Direct Air Carbon Capture Solid Adsorbent Feature #13",
            "priority": "Medium",
            "story_points": 3,
            "estimated_hours": 12,
            "status": "To Do",
            "progress_percent": 65,
            "requirement_code": "DAC-REQ-013",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Direct Air Carbon Capture Solid Adsorbent task #13."
        },
        {
            "code": "DAC-TSK-14",
            "title": "Implement & Verify Direct Air Carbon Capture Solid Adsorbent Feature #14",
            "priority": "Medium",
            "story_points": 3,
            "estimated_hours": 12,
            "status": "To Do",
            "progress_percent": 70,
            "requirement_code": "DAC-REQ-014",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Direct Air Carbon Capture Solid Adsorbent task #14."
        },
        {
            "code": "DAC-TSK-15",
            "title": "Implement & Verify Direct Air Carbon Capture Solid Adsorbent Feature #15",
            "priority": "Medium",
            "story_points": 3,
            "estimated_hours": 12,
            "status": "Ready for Testing",
            "progress_percent": 75,
            "requirement_code": "DAC-REQ-015",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Direct Air Carbon Capture Solid Adsorbent task #15."
        },
        {
            "code": "DAC-TSK-16",
            "title": "Implement & Verify Direct Air Carbon Capture Solid Adsorbent Feature #16",
            "priority": "Medium",
            "story_points": 3,
            "estimated_hours": 12,
            "status": "Ready for Testing",
            "progress_percent": 100,
            "requirement_code": "DAC-REQ-016",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Direct Air Carbon Capture Solid Adsorbent task #16."
        },
        {
            "code": "DAC-TSK-17",
            "title": "Implement & Verify Direct Air Carbon Capture Solid Adsorbent Feature #17",
            "priority": "Medium",
            "story_points": 3,
            "estimated_hours": 12,
            "status": "Ready for Testing",
            "progress_percent": 100,
            "requirement_code": "DAC-REQ-017",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Direct Air Carbon Capture Solid Adsorbent task #17."
        },
        {
            "code": "DAC-TSK-18",
            "title": "Implement & Verify Direct Air Carbon Capture Solid Adsorbent Feature #18",
            "priority": "Medium",
            "story_points": 3,
            "estimated_hours": 12,
            "status": "Ready for Testing",
            "progress_percent": 100,
            "requirement_code": "DAC-REQ-018",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Direct Air Carbon Capture Solid Adsorbent task #18."
        },
        {
            "code": "DAC-TSK-19",
            "title": "Implement & Verify Direct Air Carbon Capture Solid Adsorbent Feature #19",
            "priority": "Medium",
            "story_points": 3,
            "estimated_hours": 12,
            "status": "Ready for Testing",
            "progress_percent": 100,
            "requirement_code": "DAC-REQ-019",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Direct Air Carbon Capture Solid Adsorbent task #19."
        },
        {
            "code": "DAC-TSK-20",
            "title": "Implement & Verify Direct Air Carbon Capture Solid Adsorbent Feature #20",
            "priority": "Medium",
            "story_points": 3,
            "estimated_hours": 12,
            "status": "Ready for Testing",
            "progress_percent": 100,
            "requirement_code": "DAC-REQ-020",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Direct Air Carbon Capture Solid Adsorbent task #20."
        },
    ]

    TEST_CASES: List[Dict[str, Any]] = [
        {
            "code": "DAC-TC-01",
            "title": "QA Test Verification Procedure #1 for Direct Air Carbon Capture Solid Adsorbent",
            "test_type": "Security",
            "priority": "Critical",
            "requirement_code": "DAC-REQ-001",
            "preconditions": "1. Test fixture calibrated under ISO 14064.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under ISO 14064."
        },
        {
            "code": "DAC-TC-02",
            "title": "QA Test Verification Procedure #2 for Direct Air Carbon Capture Solid Adsorbent",
            "test_type": "Unit",
            "priority": "Critical",
            "requirement_code": "DAC-REQ-002",
            "preconditions": "1. Test fixture calibrated under ISO 14064.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under ISO 14064."
        },
        {
            "code": "DAC-TC-03",
            "title": "QA Test Verification Procedure #3 for Direct Air Carbon Capture Solid Adsorbent",
            "test_type": "Integration",
            "priority": "Critical",
            "requirement_code": "DAC-REQ-003",
            "preconditions": "1. Test fixture calibrated under ISO 14064.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under ISO 14064."
        },
        {
            "code": "DAC-TC-04",
            "title": "QA Test Verification Procedure #4 for Direct Air Carbon Capture Solid Adsorbent",
            "test_type": "Unit",
            "priority": "Critical",
            "requirement_code": "DAC-REQ-004",
            "preconditions": "1. Test fixture calibrated under ISO 14064.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under ISO 14064."
        },
        {
            "code": "DAC-TC-05",
            "title": "QA Test Verification Procedure #5 for Direct Air Carbon Capture Solid Adsorbent",
            "test_type": "Security",
            "priority": "High",
            "requirement_code": "DAC-REQ-005",
            "preconditions": "1. Test fixture calibrated under ISO 14064.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under ISO 14064."
        },
        {
            "code": "DAC-TC-06",
            "title": "QA Test Verification Procedure #6 for Direct Air Carbon Capture Solid Adsorbent",
            "test_type": "Integration",
            "priority": "High",
            "requirement_code": "DAC-REQ-006",
            "preconditions": "1. Test fixture calibrated under ISO 14064.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under ISO 14064."
        },
        {
            "code": "DAC-TC-07",
            "title": "QA Test Verification Procedure #7 for Direct Air Carbon Capture Solid Adsorbent",
            "test_type": "Security",
            "priority": "High",
            "requirement_code": "DAC-REQ-007",
            "preconditions": "1. Test fixture calibrated under ISO 14064.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under ISO 14064."
        },
        {
            "code": "DAC-TC-08",
            "title": "QA Test Verification Procedure #8 for Direct Air Carbon Capture Solid Adsorbent",
            "test_type": "Unit",
            "priority": "High",
            "requirement_code": "DAC-REQ-008",
            "preconditions": "1. Test fixture calibrated under ISO 14064.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under ISO 14064."
        },
        {
            "code": "DAC-TC-09",
            "title": "QA Test Verification Procedure #9 for Direct Air Carbon Capture Solid Adsorbent",
            "test_type": "Integration",
            "priority": "High",
            "requirement_code": "DAC-REQ-009",
            "preconditions": "1. Test fixture calibrated under ISO 14064.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under ISO 14064."
        },
        {
            "code": "DAC-TC-10",
            "title": "QA Test Verification Procedure #10 for Direct Air Carbon Capture Solid Adsorbent",
            "test_type": "Unit",
            "priority": "High",
            "requirement_code": "DAC-REQ-010",
            "preconditions": "1. Test fixture calibrated under ISO 14064.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under ISO 14064."
        },
        {
            "code": "DAC-TC-11",
            "title": "QA Test Verification Procedure #11 for Direct Air Carbon Capture Solid Adsorbent",
            "test_type": "Security",
            "priority": "Medium",
            "requirement_code": "DAC-REQ-011",
            "preconditions": "1. Test fixture calibrated under ISO 14064.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under ISO 14064."
        },
        {
            "code": "DAC-TC-12",
            "title": "QA Test Verification Procedure #12 for Direct Air Carbon Capture Solid Adsorbent",
            "test_type": "Integration",
            "priority": "Medium",
            "requirement_code": "DAC-REQ-012",
            "preconditions": "1. Test fixture calibrated under ISO 14064.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under ISO 14064."
        },
        {
            "code": "DAC-TC-13",
            "title": "QA Test Verification Procedure #13 for Direct Air Carbon Capture Solid Adsorbent",
            "test_type": "Security",
            "priority": "Medium",
            "requirement_code": "DAC-REQ-013",
            "preconditions": "1. Test fixture calibrated under ISO 14064.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under ISO 14064."
        },
        {
            "code": "DAC-TC-14",
            "title": "QA Test Verification Procedure #14 for Direct Air Carbon Capture Solid Adsorbent",
            "test_type": "Unit",
            "priority": "Medium",
            "requirement_code": "DAC-REQ-014",
            "preconditions": "1. Test fixture calibrated under ISO 14064.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under ISO 14064."
        },
        {
            "code": "DAC-TC-15",
            "title": "QA Test Verification Procedure #15 for Direct Air Carbon Capture Solid Adsorbent",
            "test_type": "Integration",
            "priority": "Medium",
            "requirement_code": "DAC-REQ-015",
            "preconditions": "1. Test fixture calibrated under ISO 14064.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under ISO 14064."
        },
    ]

    DEFECTS: List[Dict[str, Any]] = [
        {
            "title": "Telemetry jitter or race condition in Direct Air Carbon Capture Solid Adsorbent subsystem #1",
            "severity": "Critical",
            "priority": "High",
            "requirement_code": "DAC-REQ-001",
            "task_code": "DAC-TSK-01",
            "steps_to_reproduce": "1. Inject concurrent load under degraded communication bus.\n2. Observe thread contention in Direct Air Carbon Capture Solid Adsorbent controller.",
            "remediation_notes": "Refactored lock ordering, introduced lock-free ring buffers, and added regression tests under ISO 14064."
        },
        {
            "title": "Telemetry jitter or race condition in Direct Air Carbon Capture Solid Adsorbent subsystem #2",
            "severity": "Critical",
            "priority": "High",
            "requirement_code": "DAC-REQ-002",
            "task_code": "DAC-TSK-02",
            "steps_to_reproduce": "1. Inject concurrent load under degraded communication bus.\n2. Observe thread contention in Direct Air Carbon Capture Solid Adsorbent controller.",
            "remediation_notes": "Refactored lock ordering, introduced lock-free ring buffers, and added regression tests under ISO 14064."
        },
        {
            "title": "Telemetry jitter or race condition in Direct Air Carbon Capture Solid Adsorbent subsystem #3",
            "severity": "High",
            "priority": "High",
            "requirement_code": "DAC-REQ-003",
            "task_code": "DAC-TSK-03",
            "steps_to_reproduce": "1. Inject concurrent load under degraded communication bus.\n2. Observe thread contention in Direct Air Carbon Capture Solid Adsorbent controller.",
            "remediation_notes": "Refactored lock ordering, introduced lock-free ring buffers, and added regression tests under ISO 14064."
        },
        {
            "title": "Telemetry jitter or race condition in Direct Air Carbon Capture Solid Adsorbent subsystem #4",
            "severity": "High",
            "priority": "High",
            "requirement_code": "DAC-REQ-004",
            "task_code": "DAC-TSK-04",
            "steps_to_reproduce": "1. Inject concurrent load under degraded communication bus.\n2. Observe thread contention in Direct Air Carbon Capture Solid Adsorbent controller.",
            "remediation_notes": "Refactored lock ordering, introduced lock-free ring buffers, and added regression tests under ISO 14064."
        },
        {
            "title": "Telemetry jitter or race condition in Direct Air Carbon Capture Solid Adsorbent subsystem #5",
            "severity": "High",
            "priority": "Medium",
            "requirement_code": "DAC-REQ-005",
            "task_code": "DAC-TSK-05",
            "steps_to_reproduce": "1. Inject concurrent load under degraded communication bus.\n2. Observe thread contention in Direct Air Carbon Capture Solid Adsorbent controller.",
            "remediation_notes": "Refactored lock ordering, introduced lock-free ring buffers, and added regression tests under ISO 14064."
        },
        {
            "title": "Telemetry jitter or race condition in Direct Air Carbon Capture Solid Adsorbent subsystem #6",
            "severity": "Medium",
            "priority": "Medium",
            "requirement_code": "DAC-REQ-006",
            "task_code": "DAC-TSK-06",
            "steps_to_reproduce": "1. Inject concurrent load under degraded communication bus.\n2. Observe thread contention in Direct Air Carbon Capture Solid Adsorbent controller.",
            "remediation_notes": "Refactored lock ordering, introduced lock-free ring buffers, and added regression tests under ISO 14064."
        },
        {
            "title": "Telemetry jitter or race condition in Direct Air Carbon Capture Solid Adsorbent subsystem #7",
            "severity": "Medium",
            "priority": "Medium",
            "requirement_code": "DAC-REQ-007",
            "task_code": "DAC-TSK-07",
            "steps_to_reproduce": "1. Inject concurrent load under degraded communication bus.\n2. Observe thread contention in Direct Air Carbon Capture Solid Adsorbent controller.",
            "remediation_notes": "Refactored lock ordering, introduced lock-free ring buffers, and added regression tests under ISO 14064."
        },
        {
            "title": "Telemetry jitter or race condition in Direct Air Carbon Capture Solid Adsorbent subsystem #8",
            "severity": "Medium",
            "priority": "Medium",
            "requirement_code": "DAC-REQ-008",
            "task_code": "DAC-TSK-08",
            "steps_to_reproduce": "1. Inject concurrent load under degraded communication bus.\n2. Observe thread contention in Direct Air Carbon Capture Solid Adsorbent controller.",
            "remediation_notes": "Refactored lock ordering, introduced lock-free ring buffers, and added regression tests under ISO 14064."
        },
        {
            "title": "Telemetry jitter or race condition in Direct Air Carbon Capture Solid Adsorbent subsystem #9",
            "severity": "Medium",
            "priority": "Medium",
            "requirement_code": "DAC-REQ-009",
            "task_code": "DAC-TSK-09",
            "steps_to_reproduce": "1. Inject concurrent load under degraded communication bus.\n2. Observe thread contention in Direct Air Carbon Capture Solid Adsorbent controller.",
            "remediation_notes": "Refactored lock ordering, introduced lock-free ring buffers, and added regression tests under ISO 14064."
        },
        {
            "title": "Telemetry jitter or race condition in Direct Air Carbon Capture Solid Adsorbent subsystem #10",
            "severity": "Medium",
            "priority": "Medium",
            "requirement_code": "DAC-REQ-010",
            "task_code": "DAC-TSK-10",
            "steps_to_reproduce": "1. Inject concurrent load under degraded communication bus.\n2. Observe thread contention in Direct Air Carbon Capture Solid Adsorbent controller.",
            "remediation_notes": "Refactored lock ordering, introduced lock-free ring buffers, and added regression tests under ISO 14064."
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


def verify_dac_compliance_rule_1(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Verification function #1 for Direct Air Carbon Capture Solid Adsorbent under standard ISO 14064."""
    if not payload:
        return {"rule_id": "DAC-VER-01", "status": "FAILED", "reason": "Payload is empty"}
    req_count = len(payload.get("requirements", []))
    task_count = len(payload.get("tasks", []))
    is_valid = req_count > 0 and task_count >= req_count
    return {
        "rule_id": "DAC-VER-01",
        "domain": "Direct Air Carbon Capture Solid Adsorbent",
        "standard": "ISO 14064",
        "rule_index": 1,
        "is_valid": is_valid,
        "conformance_level": "Level-A" if is_valid else "Non-Conformant",
        "margin_score": 0.985 if is_valid else 0.420
    }


def verify_dac_compliance_rule_2(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Verification function #2 for Direct Air Carbon Capture Solid Adsorbent under standard ISO 14064."""
    if not payload:
        return {"rule_id": "DAC-VER-02", "status": "FAILED", "reason": "Payload is empty"}
    req_count = len(payload.get("requirements", []))
    task_count = len(payload.get("tasks", []))
    is_valid = req_count > 0 and task_count >= req_count
    return {
        "rule_id": "DAC-VER-02",
        "domain": "Direct Air Carbon Capture Solid Adsorbent",
        "standard": "ISO 14064",
        "rule_index": 2,
        "is_valid": is_valid,
        "conformance_level": "Level-A" if is_valid else "Non-Conformant",
        "margin_score": 0.985 if is_valid else 0.420
    }


def verify_dac_compliance_rule_3(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Verification function #3 for Direct Air Carbon Capture Solid Adsorbent under standard ISO 14064."""
    if not payload:
        return {"rule_id": "DAC-VER-03", "status": "FAILED", "reason": "Payload is empty"}
    req_count = len(payload.get("requirements", []))
    task_count = len(payload.get("tasks", []))
    is_valid = req_count > 0 and task_count >= req_count
    return {
        "rule_id": "DAC-VER-03",
        "domain": "Direct Air Carbon Capture Solid Adsorbent",
        "standard": "ISO 14064",
        "rule_index": 3,
        "is_valid": is_valid,
        "conformance_level": "Level-A" if is_valid else "Non-Conformant",
        "margin_score": 0.985 if is_valid else 0.420
    }


def verify_dac_compliance_rule_4(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Verification function #4 for Direct Air Carbon Capture Solid Adsorbent under standard ISO 14064."""
    if not payload:
        return {"rule_id": "DAC-VER-04", "status": "FAILED", "reason": "Payload is empty"}
    req_count = len(payload.get("requirements", []))
    task_count = len(payload.get("tasks", []))
    is_valid = req_count > 0 and task_count >= req_count
    return {
        "rule_id": "DAC-VER-04",
        "domain": "Direct Air Carbon Capture Solid Adsorbent",
        "standard": "ISO 14064",
        "rule_index": 4,
        "is_valid": is_valid,
        "conformance_level": "Level-A" if is_valid else "Non-Conformant",
        "margin_score": 0.985 if is_valid else 0.420
    }


def verify_dac_compliance_rule_5(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Verification function #5 for Direct Air Carbon Capture Solid Adsorbent under standard ISO 14064."""
    if not payload:
        return {"rule_id": "DAC-VER-05", "status": "FAILED", "reason": "Payload is empty"}
    req_count = len(payload.get("requirements", []))
    task_count = len(payload.get("tasks", []))
    is_valid = req_count > 0 and task_count >= req_count
    return {
        "rule_id": "DAC-VER-05",
        "domain": "Direct Air Carbon Capture Solid Adsorbent",
        "standard": "ISO 14064",
        "rule_index": 5,
        "is_valid": is_valid,
        "conformance_level": "Level-A" if is_valid else "Non-Conformant",
        "margin_score": 0.985 if is_valid else 0.420
    }


def verify_dac_compliance_rule_6(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Verification function #6 for Direct Air Carbon Capture Solid Adsorbent under standard ISO 14064."""
    if not payload:
        return {"rule_id": "DAC-VER-06", "status": "FAILED", "reason": "Payload is empty"}
    req_count = len(payload.get("requirements", []))
    task_count = len(payload.get("tasks", []))
    is_valid = req_count > 0 and task_count >= req_count
    return {
        "rule_id": "DAC-VER-06",
        "domain": "Direct Air Carbon Capture Solid Adsorbent",
        "standard": "ISO 14064",
        "rule_index": 6,
        "is_valid": is_valid,
        "conformance_level": "Level-A" if is_valid else "Non-Conformant",
        "margin_score": 0.985 if is_valid else 0.420
    }


def verify_dac_compliance_rule_7(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Verification function #7 for Direct Air Carbon Capture Solid Adsorbent under standard ISO 14064."""
    if not payload:
        return {"rule_id": "DAC-VER-07", "status": "FAILED", "reason": "Payload is empty"}
    req_count = len(payload.get("requirements", []))
    task_count = len(payload.get("tasks", []))
    is_valid = req_count > 0 and task_count >= req_count
    return {
        "rule_id": "DAC-VER-07",
        "domain": "Direct Air Carbon Capture Solid Adsorbent",
        "standard": "ISO 14064",
        "rule_index": 7,
        "is_valid": is_valid,
        "conformance_level": "Level-A" if is_valid else "Non-Conformant",
        "margin_score": 0.985 if is_valid else 0.420
    }


def verify_dac_compliance_rule_8(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Verification function #8 for Direct Air Carbon Capture Solid Adsorbent under standard ISO 14064."""
    if not payload:
        return {"rule_id": "DAC-VER-08", "status": "FAILED", "reason": "Payload is empty"}
    req_count = len(payload.get("requirements", []))
    task_count = len(payload.get("tasks", []))
    is_valid = req_count > 0 and task_count >= req_count
    return {
        "rule_id": "DAC-VER-08",
        "domain": "Direct Air Carbon Capture Solid Adsorbent",
        "standard": "ISO 14064",
        "rule_index": 8,
        "is_valid": is_valid,
        "conformance_level": "Level-A" if is_valid else "Non-Conformant",
        "margin_score": 0.985 if is_valid else 0.420
    }


def verify_dac_compliance_rule_9(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Verification function #9 for Direct Air Carbon Capture Solid Adsorbent under standard ISO 14064."""
    if not payload:
        return {"rule_id": "DAC-VER-09", "status": "FAILED", "reason": "Payload is empty"}
    req_count = len(payload.get("requirements", []))
    task_count = len(payload.get("tasks", []))
    is_valid = req_count > 0 and task_count >= req_count
    return {
        "rule_id": "DAC-VER-09",
        "domain": "Direct Air Carbon Capture Solid Adsorbent",
        "standard": "ISO 14064",
        "rule_index": 9,
        "is_valid": is_valid,
        "conformance_level": "Level-A" if is_valid else "Non-Conformant",
        "margin_score": 0.985 if is_valid else 0.420
    }


def verify_dac_compliance_rule_10(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Verification function #10 for Direct Air Carbon Capture Solid Adsorbent under standard ISO 14064."""
    if not payload:
        return {"rule_id": "DAC-VER-10", "status": "FAILED", "reason": "Payload is empty"}
    req_count = len(payload.get("requirements", []))
    task_count = len(payload.get("tasks", []))
    is_valid = req_count > 0 and task_count >= req_count
    return {
        "rule_id": "DAC-VER-10",
        "domain": "Direct Air Carbon Capture Solid Adsorbent",
        "standard": "ISO 14064",
        "rule_index": 10,
        "is_valid": is_valid,
        "conformance_level": "Level-A" if is_valid else "Non-Conformant",
        "margin_score": 0.985 if is_valid else 0.420
    }


def verify_dac_compliance_rule_11(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Verification function #11 for Direct Air Carbon Capture Solid Adsorbent under standard ISO 14064."""
    if not payload:
        return {"rule_id": "DAC-VER-11", "status": "FAILED", "reason": "Payload is empty"}
    req_count = len(payload.get("requirements", []))
    task_count = len(payload.get("tasks", []))
    is_valid = req_count > 0 and task_count >= req_count
    return {
        "rule_id": "DAC-VER-11",
        "domain": "Direct Air Carbon Capture Solid Adsorbent",
        "standard": "ISO 14064",
        "rule_index": 11,
        "is_valid": is_valid,
        "conformance_level": "Level-A" if is_valid else "Non-Conformant",
        "margin_score": 0.985 if is_valid else 0.420
    }


def verify_dac_compliance_rule_12(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Verification function #12 for Direct Air Carbon Capture Solid Adsorbent under standard ISO 14064."""
    if not payload:
        return {"rule_id": "DAC-VER-12", "status": "FAILED", "reason": "Payload is empty"}
    req_count = len(payload.get("requirements", []))
    task_count = len(payload.get("tasks", []))
    is_valid = req_count > 0 and task_count >= req_count
    return {
        "rule_id": "DAC-VER-12",
        "domain": "Direct Air Carbon Capture Solid Adsorbent",
        "standard": "ISO 14064",
        "rule_index": 12,
        "is_valid": is_valid,
        "conformance_level": "Level-A" if is_valid else "Non-Conformant",
        "margin_score": 0.985 if is_valid else 0.420
    }
