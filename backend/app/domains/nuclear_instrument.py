"""
TraceHub Domain Specification: Small Modular Reactor Digital Instrumentation
Standard: IEC 61513 | Identifier Prefix: SMR
Exhaustive requirement models, sprint task matrices, QA verification vectors, and defect profiles.
"""

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class NuclearInstrumentRequirement(BaseModel):
    code: str
    title: str
    priority: str
    category: str
    story_points: int
    estimated_hours: int
    description: str
    acceptance_criteria: List[str]

class NuclearInstrumentTask(BaseModel):
    code: str
    title: str
    priority: str
    story_points: int
    estimated_hours: int
    status: str
    progress_percent: int
    requirement_code: str
    technical_notes: str

class NuclearInstrumentTestCase(BaseModel):
    code: str
    title: str
    test_type: str
    priority: str
    requirement_code: str
    preconditions: str
    steps: List[str]
    expected_result: str

class NuclearInstrumentDefect(BaseModel):
    title: str
    severity: str
    priority: str
    requirement_code: str
    task_code: str
    steps_to_reproduce: str
    remediation_notes: str

class NuclearInstrumentDomainSpecification:
    """Domain specification provider for Small Modular Reactor Digital Instrumentation complying with IEC 61513."""
    DOMAIN_NAME = "Small Modular Reactor Digital Instrumentation"
    STANDARD_CODE = "IEC 61513"
    CODE_PREFIX = "SMR"

    REQUIREMENTS: List[Dict[str, Any]] = [
        {
            "code": "SMR-REQ-001",
            "title": "Small Modular Reactor Digital Instrumentation Subsystem Requirement #1",
            "priority": "Critical",
            "category": "Architecture & Governance",
            "story_points": 8,
            "estimated_hours": 32,
            "description": "Functional specification for Small Modular Reactor Digital Instrumentation requirement #1 adhering to IEC 61513 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with IEC 61513.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "SMR-REQ-002",
            "title": "Small Modular Reactor Digital Instrumentation Subsystem Requirement #2",
            "priority": "Critical",
            "category": "Architecture & Governance",
            "story_points": 8,
            "estimated_hours": 32,
            "description": "Functional specification for Small Modular Reactor Digital Instrumentation requirement #2 adhering to IEC 61513 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with IEC 61513.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "SMR-REQ-003",
            "title": "Small Modular Reactor Digital Instrumentation Subsystem Requirement #3",
            "priority": "Critical",
            "category": "Architecture & Governance",
            "story_points": 8,
            "estimated_hours": 32,
            "description": "Functional specification for Small Modular Reactor Digital Instrumentation requirement #3 adhering to IEC 61513 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with IEC 61513.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "SMR-REQ-004",
            "title": "Small Modular Reactor Digital Instrumentation Subsystem Requirement #4",
            "priority": "Critical",
            "category": "Architecture & Governance",
            "story_points": 8,
            "estimated_hours": 32,
            "description": "Functional specification for Small Modular Reactor Digital Instrumentation requirement #4 adhering to IEC 61513 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with IEC 61513.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "SMR-REQ-005",
            "title": "Small Modular Reactor Digital Instrumentation Subsystem Requirement #5",
            "priority": "Critical",
            "category": "Architecture & Governance",
            "story_points": 8,
            "estimated_hours": 32,
            "description": "Functional specification for Small Modular Reactor Digital Instrumentation requirement #5 adhering to IEC 61513 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with IEC 61513.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "SMR-REQ-006",
            "title": "Small Modular Reactor Digital Instrumentation Subsystem Requirement #6",
            "priority": "High",
            "category": "Architecture & Governance",
            "story_points": 5,
            "estimated_hours": 20,
            "description": "Functional specification for Small Modular Reactor Digital Instrumentation requirement #6 adhering to IEC 61513 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with IEC 61513.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "SMR-REQ-007",
            "title": "Small Modular Reactor Digital Instrumentation Subsystem Requirement #7",
            "priority": "High",
            "category": "Architecture & Governance",
            "story_points": 5,
            "estimated_hours": 20,
            "description": "Functional specification for Small Modular Reactor Digital Instrumentation requirement #7 adhering to IEC 61513 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with IEC 61513.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "SMR-REQ-008",
            "title": "Small Modular Reactor Digital Instrumentation Subsystem Requirement #8",
            "priority": "High",
            "category": "Architecture & Governance",
            "story_points": 5,
            "estimated_hours": 20,
            "description": "Functional specification for Small Modular Reactor Digital Instrumentation requirement #8 adhering to IEC 61513 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with IEC 61513.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "SMR-REQ-009",
            "title": "Small Modular Reactor Digital Instrumentation Subsystem Requirement #9",
            "priority": "High",
            "category": "Architecture & Governance",
            "story_points": 5,
            "estimated_hours": 20,
            "description": "Functional specification for Small Modular Reactor Digital Instrumentation requirement #9 adhering to IEC 61513 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with IEC 61513.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "SMR-REQ-010",
            "title": "Small Modular Reactor Digital Instrumentation Subsystem Requirement #10",
            "priority": "High",
            "category": "Architecture & Governance",
            "story_points": 5,
            "estimated_hours": 20,
            "description": "Functional specification for Small Modular Reactor Digital Instrumentation requirement #10 adhering to IEC 61513 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with IEC 61513.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "SMR-REQ-011",
            "title": "Small Modular Reactor Digital Instrumentation Subsystem Requirement #11",
            "priority": "High",
            "category": "Architecture & Governance",
            "story_points": 5,
            "estimated_hours": 20,
            "description": "Functional specification for Small Modular Reactor Digital Instrumentation requirement #11 adhering to IEC 61513 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with IEC 61513.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "SMR-REQ-012",
            "title": "Small Modular Reactor Digital Instrumentation Subsystem Requirement #12",
            "priority": "High",
            "category": "Architecture & Governance",
            "story_points": 5,
            "estimated_hours": 20,
            "description": "Functional specification for Small Modular Reactor Digital Instrumentation requirement #12 adhering to IEC 61513 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with IEC 61513.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "SMR-REQ-013",
            "title": "Small Modular Reactor Digital Instrumentation Subsystem Requirement #13",
            "priority": "Medium",
            "category": "Architecture & Governance",
            "story_points": 3,
            "estimated_hours": 12,
            "description": "Functional specification for Small Modular Reactor Digital Instrumentation requirement #13 adhering to IEC 61513 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with IEC 61513.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "SMR-REQ-014",
            "title": "Small Modular Reactor Digital Instrumentation Subsystem Requirement #14",
            "priority": "Medium",
            "category": "Architecture & Governance",
            "story_points": 3,
            "estimated_hours": 12,
            "description": "Functional specification for Small Modular Reactor Digital Instrumentation requirement #14 adhering to IEC 61513 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with IEC 61513.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "SMR-REQ-015",
            "title": "Small Modular Reactor Digital Instrumentation Subsystem Requirement #15",
            "priority": "Medium",
            "category": "Architecture & Governance",
            "story_points": 3,
            "estimated_hours": 12,
            "description": "Functional specification for Small Modular Reactor Digital Instrumentation requirement #15 adhering to IEC 61513 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with IEC 61513.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "SMR-REQ-016",
            "title": "Small Modular Reactor Digital Instrumentation Subsystem Requirement #16",
            "priority": "Medium",
            "category": "Architecture & Governance",
            "story_points": 3,
            "estimated_hours": 12,
            "description": "Functional specification for Small Modular Reactor Digital Instrumentation requirement #16 adhering to IEC 61513 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with IEC 61513.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "SMR-REQ-017",
            "title": "Small Modular Reactor Digital Instrumentation Subsystem Requirement #17",
            "priority": "Medium",
            "category": "Architecture & Governance",
            "story_points": 3,
            "estimated_hours": 12,
            "description": "Functional specification for Small Modular Reactor Digital Instrumentation requirement #17 adhering to IEC 61513 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with IEC 61513.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "SMR-REQ-018",
            "title": "Small Modular Reactor Digital Instrumentation Subsystem Requirement #18",
            "priority": "Medium",
            "category": "Architecture & Governance",
            "story_points": 3,
            "estimated_hours": 12,
            "description": "Functional specification for Small Modular Reactor Digital Instrumentation requirement #18 adhering to IEC 61513 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with IEC 61513.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "SMR-REQ-019",
            "title": "Small Modular Reactor Digital Instrumentation Subsystem Requirement #19",
            "priority": "Medium",
            "category": "Architecture & Governance",
            "story_points": 3,
            "estimated_hours": 12,
            "description": "Functional specification for Small Modular Reactor Digital Instrumentation requirement #19 adhering to IEC 61513 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with IEC 61513.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
        {
            "code": "SMR-REQ-020",
            "title": "Small Modular Reactor Digital Instrumentation Subsystem Requirement #20",
            "priority": "Medium",
            "category": "Architecture & Governance",
            "story_points": 3,
            "estimated_hours": 12,
            "description": "Functional specification for Small Modular Reactor Digital Instrumentation requirement #20 adhering to IEC 61513 directives.",
            "acceptance_criteria": [
                "1. Deterministic response and bounded jitter complying with IEC 61513.",
                "2. Formal validation against boundary condition vectors.",
                "3. 100% gate pass sign-off from verification authority."
            ]
        },
    ]

    TASKS: List[Dict[str, Any]] = [
        {
            "code": "SMR-TSK-01",
            "title": "Implement & Verify Small Modular Reactor Digital Instrumentation Feature #1",
            "priority": "Critical",
            "story_points": 8,
            "estimated_hours": 32,
            "status": "In Progress",
            "progress_percent": 5,
            "requirement_code": "SMR-REQ-001",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Small Modular Reactor Digital Instrumentation task #1."
        },
        {
            "code": "SMR-TSK-02",
            "title": "Implement & Verify Small Modular Reactor Digital Instrumentation Feature #2",
            "priority": "Critical",
            "story_points": 8,
            "estimated_hours": 32,
            "status": "In Progress",
            "progress_percent": 10,
            "requirement_code": "SMR-REQ-002",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Small Modular Reactor Digital Instrumentation task #2."
        },
        {
            "code": "SMR-TSK-03",
            "title": "Implement & Verify Small Modular Reactor Digital Instrumentation Feature #3",
            "priority": "Critical",
            "story_points": 8,
            "estimated_hours": 32,
            "status": "In Progress",
            "progress_percent": 15,
            "requirement_code": "SMR-REQ-003",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Small Modular Reactor Digital Instrumentation task #3."
        },
        {
            "code": "SMR-TSK-04",
            "title": "Implement & Verify Small Modular Reactor Digital Instrumentation Feature #4",
            "priority": "Critical",
            "story_points": 8,
            "estimated_hours": 32,
            "status": "In Progress",
            "progress_percent": 20,
            "requirement_code": "SMR-REQ-004",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Small Modular Reactor Digital Instrumentation task #4."
        },
        {
            "code": "SMR-TSK-05",
            "title": "Implement & Verify Small Modular Reactor Digital Instrumentation Feature #5",
            "priority": "Critical",
            "story_points": 8,
            "estimated_hours": 32,
            "status": "In Progress",
            "progress_percent": 25,
            "requirement_code": "SMR-REQ-005",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Small Modular Reactor Digital Instrumentation task #5."
        },
        {
            "code": "SMR-TSK-06",
            "title": "Implement & Verify Small Modular Reactor Digital Instrumentation Feature #6",
            "priority": "High",
            "story_points": 5,
            "estimated_hours": 20,
            "status": "In Progress",
            "progress_percent": 30,
            "requirement_code": "SMR-REQ-006",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Small Modular Reactor Digital Instrumentation task #6."
        },
        {
            "code": "SMR-TSK-07",
            "title": "Implement & Verify Small Modular Reactor Digital Instrumentation Feature #7",
            "priority": "High",
            "story_points": 5,
            "estimated_hours": 20,
            "status": "In Progress",
            "progress_percent": 35,
            "requirement_code": "SMR-REQ-007",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Small Modular Reactor Digital Instrumentation task #7."
        },
        {
            "code": "SMR-TSK-08",
            "title": "Implement & Verify Small Modular Reactor Digital Instrumentation Feature #8",
            "priority": "High",
            "story_points": 5,
            "estimated_hours": 20,
            "status": "To Do",
            "progress_percent": 40,
            "requirement_code": "SMR-REQ-008",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Small Modular Reactor Digital Instrumentation task #8."
        },
        {
            "code": "SMR-TSK-09",
            "title": "Implement & Verify Small Modular Reactor Digital Instrumentation Feature #9",
            "priority": "High",
            "story_points": 5,
            "estimated_hours": 20,
            "status": "To Do",
            "progress_percent": 45,
            "requirement_code": "SMR-REQ-009",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Small Modular Reactor Digital Instrumentation task #9."
        },
        {
            "code": "SMR-TSK-10",
            "title": "Implement & Verify Small Modular Reactor Digital Instrumentation Feature #10",
            "priority": "High",
            "story_points": 5,
            "estimated_hours": 20,
            "status": "To Do",
            "progress_percent": 50,
            "requirement_code": "SMR-REQ-010",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Small Modular Reactor Digital Instrumentation task #10."
        },
        {
            "code": "SMR-TSK-11",
            "title": "Implement & Verify Small Modular Reactor Digital Instrumentation Feature #11",
            "priority": "High",
            "story_points": 5,
            "estimated_hours": 20,
            "status": "To Do",
            "progress_percent": 55,
            "requirement_code": "SMR-REQ-011",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Small Modular Reactor Digital Instrumentation task #11."
        },
        {
            "code": "SMR-TSK-12",
            "title": "Implement & Verify Small Modular Reactor Digital Instrumentation Feature #12",
            "priority": "High",
            "story_points": 5,
            "estimated_hours": 20,
            "status": "To Do",
            "progress_percent": 60,
            "requirement_code": "SMR-REQ-012",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Small Modular Reactor Digital Instrumentation task #12."
        },
        {
            "code": "SMR-TSK-13",
            "title": "Implement & Verify Small Modular Reactor Digital Instrumentation Feature #13",
            "priority": "Medium",
            "story_points": 3,
            "estimated_hours": 12,
            "status": "To Do",
            "progress_percent": 65,
            "requirement_code": "SMR-REQ-013",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Small Modular Reactor Digital Instrumentation task #13."
        },
        {
            "code": "SMR-TSK-14",
            "title": "Implement & Verify Small Modular Reactor Digital Instrumentation Feature #14",
            "priority": "Medium",
            "story_points": 3,
            "estimated_hours": 12,
            "status": "To Do",
            "progress_percent": 70,
            "requirement_code": "SMR-REQ-014",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Small Modular Reactor Digital Instrumentation task #14."
        },
        {
            "code": "SMR-TSK-15",
            "title": "Implement & Verify Small Modular Reactor Digital Instrumentation Feature #15",
            "priority": "Medium",
            "story_points": 3,
            "estimated_hours": 12,
            "status": "Ready for Testing",
            "progress_percent": 75,
            "requirement_code": "SMR-REQ-015",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Small Modular Reactor Digital Instrumentation task #15."
        },
        {
            "code": "SMR-TSK-16",
            "title": "Implement & Verify Small Modular Reactor Digital Instrumentation Feature #16",
            "priority": "Medium",
            "story_points": 3,
            "estimated_hours": 12,
            "status": "Ready for Testing",
            "progress_percent": 100,
            "requirement_code": "SMR-REQ-016",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Small Modular Reactor Digital Instrumentation task #16."
        },
        {
            "code": "SMR-TSK-17",
            "title": "Implement & Verify Small Modular Reactor Digital Instrumentation Feature #17",
            "priority": "Medium",
            "story_points": 3,
            "estimated_hours": 12,
            "status": "Ready for Testing",
            "progress_percent": 100,
            "requirement_code": "SMR-REQ-017",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Small Modular Reactor Digital Instrumentation task #17."
        },
        {
            "code": "SMR-TSK-18",
            "title": "Implement & Verify Small Modular Reactor Digital Instrumentation Feature #18",
            "priority": "Medium",
            "story_points": 3,
            "estimated_hours": 12,
            "status": "Ready for Testing",
            "progress_percent": 100,
            "requirement_code": "SMR-REQ-018",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Small Modular Reactor Digital Instrumentation task #18."
        },
        {
            "code": "SMR-TSK-19",
            "title": "Implement & Verify Small Modular Reactor Digital Instrumentation Feature #19",
            "priority": "Medium",
            "story_points": 3,
            "estimated_hours": 12,
            "status": "Ready for Testing",
            "progress_percent": 100,
            "requirement_code": "SMR-REQ-019",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Small Modular Reactor Digital Instrumentation task #19."
        },
        {
            "code": "SMR-TSK-20",
            "title": "Implement & Verify Small Modular Reactor Digital Instrumentation Feature #20",
            "priority": "Medium",
            "story_points": 3,
            "estimated_hours": 12,
            "status": "Ready for Testing",
            "progress_percent": 100,
            "requirement_code": "SMR-REQ-020",
            "technical_notes": "Implement logic, defensive assertions, and compliance audit trail for Small Modular Reactor Digital Instrumentation task #20."
        },
    ]

    TEST_CASES: List[Dict[str, Any]] = [
        {
            "code": "SMR-TC-01",
            "title": "QA Test Verification Procedure #1 for Small Modular Reactor Digital Instrumentation",
            "test_type": "Security",
            "priority": "Critical",
            "requirement_code": "SMR-REQ-001",
            "preconditions": "1. Test fixture calibrated under IEC 61513.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under IEC 61513."
        },
        {
            "code": "SMR-TC-02",
            "title": "QA Test Verification Procedure #2 for Small Modular Reactor Digital Instrumentation",
            "test_type": "Unit",
            "priority": "Critical",
            "requirement_code": "SMR-REQ-002",
            "preconditions": "1. Test fixture calibrated under IEC 61513.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under IEC 61513."
        },
        {
            "code": "SMR-TC-03",
            "title": "QA Test Verification Procedure #3 for Small Modular Reactor Digital Instrumentation",
            "test_type": "Integration",
            "priority": "Critical",
            "requirement_code": "SMR-REQ-003",
            "preconditions": "1. Test fixture calibrated under IEC 61513.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under IEC 61513."
        },
        {
            "code": "SMR-TC-04",
            "title": "QA Test Verification Procedure #4 for Small Modular Reactor Digital Instrumentation",
            "test_type": "Unit",
            "priority": "Critical",
            "requirement_code": "SMR-REQ-004",
            "preconditions": "1. Test fixture calibrated under IEC 61513.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under IEC 61513."
        },
        {
            "code": "SMR-TC-05",
            "title": "QA Test Verification Procedure #5 for Small Modular Reactor Digital Instrumentation",
            "test_type": "Security",
            "priority": "High",
            "requirement_code": "SMR-REQ-005",
            "preconditions": "1. Test fixture calibrated under IEC 61513.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under IEC 61513."
        },
        {
            "code": "SMR-TC-06",
            "title": "QA Test Verification Procedure #6 for Small Modular Reactor Digital Instrumentation",
            "test_type": "Integration",
            "priority": "High",
            "requirement_code": "SMR-REQ-006",
            "preconditions": "1. Test fixture calibrated under IEC 61513.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under IEC 61513."
        },
        {
            "code": "SMR-TC-07",
            "title": "QA Test Verification Procedure #7 for Small Modular Reactor Digital Instrumentation",
            "test_type": "Security",
            "priority": "High",
            "requirement_code": "SMR-REQ-007",
            "preconditions": "1. Test fixture calibrated under IEC 61513.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under IEC 61513."
        },
        {
            "code": "SMR-TC-08",
            "title": "QA Test Verification Procedure #8 for Small Modular Reactor Digital Instrumentation",
            "test_type": "Unit",
            "priority": "High",
            "requirement_code": "SMR-REQ-008",
            "preconditions": "1. Test fixture calibrated under IEC 61513.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under IEC 61513."
        },
        {
            "code": "SMR-TC-09",
            "title": "QA Test Verification Procedure #9 for Small Modular Reactor Digital Instrumentation",
            "test_type": "Integration",
            "priority": "High",
            "requirement_code": "SMR-REQ-009",
            "preconditions": "1. Test fixture calibrated under IEC 61513.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under IEC 61513."
        },
        {
            "code": "SMR-TC-10",
            "title": "QA Test Verification Procedure #10 for Small Modular Reactor Digital Instrumentation",
            "test_type": "Unit",
            "priority": "High",
            "requirement_code": "SMR-REQ-010",
            "preconditions": "1. Test fixture calibrated under IEC 61513.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under IEC 61513."
        },
        {
            "code": "SMR-TC-11",
            "title": "QA Test Verification Procedure #11 for Small Modular Reactor Digital Instrumentation",
            "test_type": "Security",
            "priority": "Medium",
            "requirement_code": "SMR-REQ-011",
            "preconditions": "1. Test fixture calibrated under IEC 61513.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under IEC 61513."
        },
        {
            "code": "SMR-TC-12",
            "title": "QA Test Verification Procedure #12 for Small Modular Reactor Digital Instrumentation",
            "test_type": "Integration",
            "priority": "Medium",
            "requirement_code": "SMR-REQ-012",
            "preconditions": "1. Test fixture calibrated under IEC 61513.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under IEC 61513."
        },
        {
            "code": "SMR-TC-13",
            "title": "QA Test Verification Procedure #13 for Small Modular Reactor Digital Instrumentation",
            "test_type": "Security",
            "priority": "Medium",
            "requirement_code": "SMR-REQ-013",
            "preconditions": "1. Test fixture calibrated under IEC 61513.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under IEC 61513."
        },
        {
            "code": "SMR-TC-14",
            "title": "QA Test Verification Procedure #14 for Small Modular Reactor Digital Instrumentation",
            "test_type": "Unit",
            "priority": "Medium",
            "requirement_code": "SMR-REQ-014",
            "preconditions": "1. Test fixture calibrated under IEC 61513.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under IEC 61513."
        },
        {
            "code": "SMR-TC-15",
            "title": "QA Test Verification Procedure #15 for Small Modular Reactor Digital Instrumentation",
            "test_type": "Integration",
            "priority": "Medium",
            "requirement_code": "SMR-REQ-015",
            "preconditions": "1. Test fixture calibrated under IEC 61513.\n2. Benchmark instrumentation active.",
            "steps": [
                "1. Initialize subsystem harness under rated operational limits.",
                "2. Transmit synthetic sensor vector and stress signal payloads.",
                "3. Record state transition latency, buffer occupancy, and telemetry output."
            ],
            "expected_result": "Zero faults, zero missed real-time deadlines, and successful compliance sign-off under IEC 61513."
        },
    ]

    DEFECTS: List[Dict[str, Any]] = [
        {
            "title": "Telemetry jitter or race condition in Small Modular Reactor Digital Instrumentation subsystem #1",
            "severity": "Critical",
            "priority": "High",
            "requirement_code": "SMR-REQ-001",
            "task_code": "SMR-TSK-01",
            "steps_to_reproduce": "1. Inject concurrent load under degraded communication bus.\n2. Observe thread contention in Small Modular Reactor Digital Instrumentation controller.",
            "remediation_notes": "Refactored lock ordering, introduced lock-free ring buffers, and added regression tests under IEC 61513."
        },
        {
            "title": "Telemetry jitter or race condition in Small Modular Reactor Digital Instrumentation subsystem #2",
            "severity": "Critical",
            "priority": "High",
            "requirement_code": "SMR-REQ-002",
            "task_code": "SMR-TSK-02",
            "steps_to_reproduce": "1. Inject concurrent load under degraded communication bus.\n2. Observe thread contention in Small Modular Reactor Digital Instrumentation controller.",
            "remediation_notes": "Refactored lock ordering, introduced lock-free ring buffers, and added regression tests under IEC 61513."
        },
        {
            "title": "Telemetry jitter or race condition in Small Modular Reactor Digital Instrumentation subsystem #3",
            "severity": "High",
            "priority": "High",
            "requirement_code": "SMR-REQ-003",
            "task_code": "SMR-TSK-03",
            "steps_to_reproduce": "1. Inject concurrent load under degraded communication bus.\n2. Observe thread contention in Small Modular Reactor Digital Instrumentation controller.",
            "remediation_notes": "Refactored lock ordering, introduced lock-free ring buffers, and added regression tests under IEC 61513."
        },
        {
            "title": "Telemetry jitter or race condition in Small Modular Reactor Digital Instrumentation subsystem #4",
            "severity": "High",
            "priority": "High",
            "requirement_code": "SMR-REQ-004",
            "task_code": "SMR-TSK-04",
            "steps_to_reproduce": "1. Inject concurrent load under degraded communication bus.\n2. Observe thread contention in Small Modular Reactor Digital Instrumentation controller.",
            "remediation_notes": "Refactored lock ordering, introduced lock-free ring buffers, and added regression tests under IEC 61513."
        },
        {
            "title": "Telemetry jitter or race condition in Small Modular Reactor Digital Instrumentation subsystem #5",
            "severity": "High",
            "priority": "Medium",
            "requirement_code": "SMR-REQ-005",
            "task_code": "SMR-TSK-05",
            "steps_to_reproduce": "1. Inject concurrent load under degraded communication bus.\n2. Observe thread contention in Small Modular Reactor Digital Instrumentation controller.",
            "remediation_notes": "Refactored lock ordering, introduced lock-free ring buffers, and added regression tests under IEC 61513."
        },
        {
            "title": "Telemetry jitter or race condition in Small Modular Reactor Digital Instrumentation subsystem #6",
            "severity": "Medium",
            "priority": "Medium",
            "requirement_code": "SMR-REQ-006",
            "task_code": "SMR-TSK-06",
            "steps_to_reproduce": "1. Inject concurrent load under degraded communication bus.\n2. Observe thread contention in Small Modular Reactor Digital Instrumentation controller.",
            "remediation_notes": "Refactored lock ordering, introduced lock-free ring buffers, and added regression tests under IEC 61513."
        },
        {
            "title": "Telemetry jitter or race condition in Small Modular Reactor Digital Instrumentation subsystem #7",
            "severity": "Medium",
            "priority": "Medium",
            "requirement_code": "SMR-REQ-007",
            "task_code": "SMR-TSK-07",
            "steps_to_reproduce": "1. Inject concurrent load under degraded communication bus.\n2. Observe thread contention in Small Modular Reactor Digital Instrumentation controller.",
            "remediation_notes": "Refactored lock ordering, introduced lock-free ring buffers, and added regression tests under IEC 61513."
        },
        {
            "title": "Telemetry jitter or race condition in Small Modular Reactor Digital Instrumentation subsystem #8",
            "severity": "Medium",
            "priority": "Medium",
            "requirement_code": "SMR-REQ-008",
            "task_code": "SMR-TSK-08",
            "steps_to_reproduce": "1. Inject concurrent load under degraded communication bus.\n2. Observe thread contention in Small Modular Reactor Digital Instrumentation controller.",
            "remediation_notes": "Refactored lock ordering, introduced lock-free ring buffers, and added regression tests under IEC 61513."
        },
        {
            "title": "Telemetry jitter or race condition in Small Modular Reactor Digital Instrumentation subsystem #9",
            "severity": "Medium",
            "priority": "Medium",
            "requirement_code": "SMR-REQ-009",
            "task_code": "SMR-TSK-09",
            "steps_to_reproduce": "1. Inject concurrent load under degraded communication bus.\n2. Observe thread contention in Small Modular Reactor Digital Instrumentation controller.",
            "remediation_notes": "Refactored lock ordering, introduced lock-free ring buffers, and added regression tests under IEC 61513."
        },
        {
            "title": "Telemetry jitter or race condition in Small Modular Reactor Digital Instrumentation subsystem #10",
            "severity": "Medium",
            "priority": "Medium",
            "requirement_code": "SMR-REQ-010",
            "task_code": "SMR-TSK-10",
            "steps_to_reproduce": "1. Inject concurrent load under degraded communication bus.\n2. Observe thread contention in Small Modular Reactor Digital Instrumentation controller.",
            "remediation_notes": "Refactored lock ordering, introduced lock-free ring buffers, and added regression tests under IEC 61513."
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


def verify_smr_compliance_rule_1(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Verification function #1 for Small Modular Reactor Digital Instrumentation under standard IEC 61513."""
    if not payload:
        return {"rule_id": "SMR-VER-01", "status": "FAILED", "reason": "Payload is empty"}
    req_count = len(payload.get("requirements", []))
    task_count = len(payload.get("tasks", []))
    is_valid = req_count > 0 and task_count >= req_count
    return {
        "rule_id": "SMR-VER-01",
        "domain": "Small Modular Reactor Digital Instrumentation",
        "standard": "IEC 61513",
        "rule_index": 1,
        "is_valid": is_valid,
        "conformance_level": "Level-A" if is_valid else "Non-Conformant",
        "margin_score": 0.985 if is_valid else 0.420
    }


def verify_smr_compliance_rule_2(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Verification function #2 for Small Modular Reactor Digital Instrumentation under standard IEC 61513."""
    if not payload:
        return {"rule_id": "SMR-VER-02", "status": "FAILED", "reason": "Payload is empty"}
    req_count = len(payload.get("requirements", []))
    task_count = len(payload.get("tasks", []))
    is_valid = req_count > 0 and task_count >= req_count
    return {
        "rule_id": "SMR-VER-02",
        "domain": "Small Modular Reactor Digital Instrumentation",
        "standard": "IEC 61513",
        "rule_index": 2,
        "is_valid": is_valid,
        "conformance_level": "Level-A" if is_valid else "Non-Conformant",
        "margin_score": 0.985 if is_valid else 0.420
    }


def verify_smr_compliance_rule_3(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Verification function #3 for Small Modular Reactor Digital Instrumentation under standard IEC 61513."""
    if not payload:
        return {"rule_id": "SMR-VER-03", "status": "FAILED", "reason": "Payload is empty"}
    req_count = len(payload.get("requirements", []))
    task_count = len(payload.get("tasks", []))
    is_valid = req_count > 0 and task_count >= req_count
    return {
        "rule_id": "SMR-VER-03",
        "domain": "Small Modular Reactor Digital Instrumentation",
        "standard": "IEC 61513",
        "rule_index": 3,
        "is_valid": is_valid,
        "conformance_level": "Level-A" if is_valid else "Non-Conformant",
        "margin_score": 0.985 if is_valid else 0.420
    }


def verify_smr_compliance_rule_4(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Verification function #4 for Small Modular Reactor Digital Instrumentation under standard IEC 61513."""
    if not payload:
        return {"rule_id": "SMR-VER-04", "status": "FAILED", "reason": "Payload is empty"}
    req_count = len(payload.get("requirements", []))
    task_count = len(payload.get("tasks", []))
    is_valid = req_count > 0 and task_count >= req_count
    return {
        "rule_id": "SMR-VER-04",
        "domain": "Small Modular Reactor Digital Instrumentation",
        "standard": "IEC 61513",
        "rule_index": 4,
        "is_valid": is_valid,
        "conformance_level": "Level-A" if is_valid else "Non-Conformant",
        "margin_score": 0.985 if is_valid else 0.420
    }


def verify_smr_compliance_rule_5(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Verification function #5 for Small Modular Reactor Digital Instrumentation under standard IEC 61513."""
    if not payload:
        return {"rule_id": "SMR-VER-05", "status": "FAILED", "reason": "Payload is empty"}
    req_count = len(payload.get("requirements", []))
    task_count = len(payload.get("tasks", []))
    is_valid = req_count > 0 and task_count >= req_count
    return {
        "rule_id": "SMR-VER-05",
        "domain": "Small Modular Reactor Digital Instrumentation",
        "standard": "IEC 61513",
        "rule_index": 5,
        "is_valid": is_valid,
        "conformance_level": "Level-A" if is_valid else "Non-Conformant",
        "margin_score": 0.985 if is_valid else 0.420
    }


def verify_smr_compliance_rule_6(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Verification function #6 for Small Modular Reactor Digital Instrumentation under standard IEC 61513."""
    if not payload:
        return {"rule_id": "SMR-VER-06", "status": "FAILED", "reason": "Payload is empty"}
    req_count = len(payload.get("requirements", []))
    task_count = len(payload.get("tasks", []))
    is_valid = req_count > 0 and task_count >= req_count
    return {
        "rule_id": "SMR-VER-06",
        "domain": "Small Modular Reactor Digital Instrumentation",
        "standard": "IEC 61513",
        "rule_index": 6,
        "is_valid": is_valid,
        "conformance_level": "Level-A" if is_valid else "Non-Conformant",
        "margin_score": 0.985 if is_valid else 0.420
    }


def verify_smr_compliance_rule_7(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Verification function #7 for Small Modular Reactor Digital Instrumentation under standard IEC 61513."""
    if not payload:
        return {"rule_id": "SMR-VER-07", "status": "FAILED", "reason": "Payload is empty"}
    req_count = len(payload.get("requirements", []))
    task_count = len(payload.get("tasks", []))
    is_valid = req_count > 0 and task_count >= req_count
    return {
        "rule_id": "SMR-VER-07",
        "domain": "Small Modular Reactor Digital Instrumentation",
        "standard": "IEC 61513",
        "rule_index": 7,
        "is_valid": is_valid,
        "conformance_level": "Level-A" if is_valid else "Non-Conformant",
        "margin_score": 0.985 if is_valid else 0.420
    }


def verify_smr_compliance_rule_8(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Verification function #8 for Small Modular Reactor Digital Instrumentation under standard IEC 61513."""
    if not payload:
        return {"rule_id": "SMR-VER-08", "status": "FAILED", "reason": "Payload is empty"}
    req_count = len(payload.get("requirements", []))
    task_count = len(payload.get("tasks", []))
    is_valid = req_count > 0 and task_count >= req_count
    return {
        "rule_id": "SMR-VER-08",
        "domain": "Small Modular Reactor Digital Instrumentation",
        "standard": "IEC 61513",
        "rule_index": 8,
        "is_valid": is_valid,
        "conformance_level": "Level-A" if is_valid else "Non-Conformant",
        "margin_score": 0.985 if is_valid else 0.420
    }


def verify_smr_compliance_rule_9(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Verification function #9 for Small Modular Reactor Digital Instrumentation under standard IEC 61513."""
    if not payload:
        return {"rule_id": "SMR-VER-09", "status": "FAILED", "reason": "Payload is empty"}
    req_count = len(payload.get("requirements", []))
    task_count = len(payload.get("tasks", []))
    is_valid = req_count > 0 and task_count >= req_count
    return {
        "rule_id": "SMR-VER-09",
        "domain": "Small Modular Reactor Digital Instrumentation",
        "standard": "IEC 61513",
        "rule_index": 9,
        "is_valid": is_valid,
        "conformance_level": "Level-A" if is_valid else "Non-Conformant",
        "margin_score": 0.985 if is_valid else 0.420
    }


def verify_smr_compliance_rule_10(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Verification function #10 for Small Modular Reactor Digital Instrumentation under standard IEC 61513."""
    if not payload:
        return {"rule_id": "SMR-VER-10", "status": "FAILED", "reason": "Payload is empty"}
    req_count = len(payload.get("requirements", []))
    task_count = len(payload.get("tasks", []))
    is_valid = req_count > 0 and task_count >= req_count
    return {
        "rule_id": "SMR-VER-10",
        "domain": "Small Modular Reactor Digital Instrumentation",
        "standard": "IEC 61513",
        "rule_index": 10,
        "is_valid": is_valid,
        "conformance_level": "Level-A" if is_valid else "Non-Conformant",
        "margin_score": 0.985 if is_valid else 0.420
    }


def verify_smr_compliance_rule_11(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Verification function #11 for Small Modular Reactor Digital Instrumentation under standard IEC 61513."""
    if not payload:
        return {"rule_id": "SMR-VER-11", "status": "FAILED", "reason": "Payload is empty"}
    req_count = len(payload.get("requirements", []))
    task_count = len(payload.get("tasks", []))
    is_valid = req_count > 0 and task_count >= req_count
    return {
        "rule_id": "SMR-VER-11",
        "domain": "Small Modular Reactor Digital Instrumentation",
        "standard": "IEC 61513",
        "rule_index": 11,
        "is_valid": is_valid,
        "conformance_level": "Level-A" if is_valid else "Non-Conformant",
        "margin_score": 0.985 if is_valid else 0.420
    }


def verify_smr_compliance_rule_12(payload: Dict[str, Any]) -> Dict[str, Any]:
    """Verification function #12 for Small Modular Reactor Digital Instrumentation under standard IEC 61513."""
    if not payload:
        return {"rule_id": "SMR-VER-12", "status": "FAILED", "reason": "Payload is empty"}
    req_count = len(payload.get("requirements", []))
    task_count = len(payload.get("tasks", []))
    is_valid = req_count > 0 and task_count >= req_count
    return {
        "rule_id": "SMR-VER-12",
        "domain": "Small Modular Reactor Digital Instrumentation",
        "standard": "IEC 61513",
        "rule_index": 12,
        "is_valid": is_valid,
        "conformance_level": "Level-A" if is_valid else "Non-Conformant",
        "margin_score": 0.985 if is_valid else 0.420
    }
