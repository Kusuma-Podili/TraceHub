"""
TraceHub Pre-configured Enterprise Industry Blueprints & Architecture Catalog.
Provides rich project structures for Fintech Banking, Aerospace Avionics,
Healthcare Telehealth, Cloud Infrastructure, and AAA Gaming Platforms.
"""

from typing import List, Dict, Any
from pydantic import BaseModel, Field

class ProjectBlueprintRequirement(BaseModel):
    code: str
    title: str
    description: str
    priority: str
    category: str
    acceptance_criteria: List[str]

class ProjectBlueprintTask(BaseModel):
    code: str
    title: str
    description: str
    priority: str
    estimated_hours: float
    story_points: float
    requirement_code: str

class ProjectBlueprintTestCase(BaseModel):
    code: str
    title: str
    scenario: str
    expected_result: str
    priority: str
    requirement_code: str

class ProjectBlueprintDefect(BaseModel):
    code: str
    title: str
    description: str
    severity: str
    priority: str
    task_code: str

class EnterpriseProjectBlueprint(BaseModel):
    template_id: str
    name: str
    industry: str
    code_prefix: str
    description: str
    sdlc_methodology: str
    requirements: List[ProjectBlueprintRequirement]
    tasks: List[ProjectBlueprintTask]
    test_cases: List[ProjectBlueprintTestCase]
    common_defects: List[ProjectBlueprintDefect]

class EnterpriseBlueprintLibrary:
    """
    Catalog of High-Fidelity Enterprise Blueprints for Automated Seeding.
    """

    @classmethod
    def get_fintech_blueprint(cls) -> EnterpriseProjectBlueprint:
        reqs = [
            ProjectBlueprintRequirement(
                code="FIN-REQ-001",
                title="Double-Entry Core Ledger Immutability",
                description="The platform must execute all financial transactions as balanced double-entry accounting records with cryptographic SHA-256 chain hashing.",
                priority="Critical",
                category="Core Banking",
                acceptance_criteria=[
                    "Every transaction debit must balance credit to zero sum.",
                    "Audit ledger writes are append-only with immutable block linkage.",
                    "Transactions failing validation roll back within 20 milliseconds."
                ]
            ),
            ProjectBlueprintRequirement(
                code="FIN-REQ-002",
                title="ISO 20022 Financial Messaging Engine",
                description="Inbound and outbound inter-bank settlements must parse, validate, and serialize pacs.008 and camt.053 XML payloads.",
                priority="High",
                category="Integration",
                acceptance_criteria=[
                    "Validate XML schema against SWIFT ISO 20022 standard.",
                    "Reject malformed tags with structured error status codes."
                ]
            ),
            ProjectBlueprintRequirement(
                code="FIN-REQ-003",
                title="Real-time Fraud Anomaly Detection Pipeline",
                description="Evaluate transaction velocity, geospatial impossibility, and device fingerprint risk scores using streaming ML inference.",
                priority="Critical",
                category="Security & Risk",
                acceptance_criteria=[
                    "Score transactions under 50ms latency at 10,000 TPS.",
                    "Flag high-risk transactions for step-up multi-factor authorization."
                ]
            )
        ]

        tasks = [
            ProjectBlueprintTask(
                code="FIN-TSK-01",
                title="Implement Ledger Transaction Atomicity & Concurrency Guards",
                description="Develop SQLAlchemy double-entry ledger entity with row-level locking (SELECT FOR UPDATE) to prevent race conditions during high-concurrency balance deductions.",
                priority="Critical",
                estimated_hours=24.0,
                story_points=8.0,
                requirement_code="FIN-REQ-001"
            ),
            ProjectBlueprintTask(
                code="FIN-TSK-02",
                title="Build ISO 20022 XML Schema Parser & Validator",
                description="Construct lxml XML schema validation parser with automated XSD schema caching and structured error mapping.",
                priority="High",
                estimated_hours=16.0,
                story_points=5.0,
                requirement_code="FIN-REQ-002"
            ),
            ProjectBlueprintTask(
                code="FIN-TSK-03",
                title="Integrate Fraud Scoring Rule Engine & Velocity Counters",
                description="Deploy Redis sliding-window rate limiters and transaction velocity trackers for real-time card-not-present fraud evaluation.",
                priority="High",
                estimated_hours=20.0,
                story_points=5.0,
                requirement_code="FIN-REQ-003"
            )
        ]

        test_cases = [
            ProjectBlueprintTestCase(
                code="FIN-TC-01",
                title="Verify Concurrency Isolation on Simultaneous Balance Withdrawals",
                scenario="Execute 50 parallel asynchronous withdrawal requests of $100 against an account with $500 balance.",
                expected_result="Exactly 5 requests succeed, 45 requests receive HTTP 409 Insufficient Funds, balance equals $0.",
                priority="Critical",
                requirement_code="FIN-REQ-001"
            ),
            ProjectBlueprintTestCase(
                code="FIN-TC-02",
                title="Verify ISO 20022 pacs.008 Malformed Currency Code Rejection",
                scenario="Submit pacs.008 payment payload with invalid currency code 'XYZ' instead of 'USD'.",
                expected_result="Parser returns HTTP 422 with ISO validation error code 'CURR_INVALID'.",
                priority="High",
                requirement_code="FIN-REQ-002"
            )
        ]

        defects = [
            ProjectBlueprintDefect(
                code="FIN-BUG-01",
                title="Floating point rounding error in multi-currency conversion ledger",
                description="Currency conversions using IEEE 754 float introduce 1-cent reconciliation discrepancies. Must use Decimal(128) precision.",
                severity="Critical",
                priority="High",
                task_code="FIN-TSK-01"
            )
        ]

        return EnterpriseProjectBlueprint(
            template_id="fintech-core-banking",
            name="ApexPay Sovereign Core Banking Ledger",
            industry="Financial Services & Banking",
            code_prefix="APEX",
            description="Mission-critical double-entry ledger, ISO 20022 payment settlement, and real-time fraud scoring platform.",
            sdlc_methodology="Strict V-Model with Automated Quality Gates",
            requirements=reqs,
            tasks=tasks,
            test_cases=test_cases,
            common_defects=defects
        )
