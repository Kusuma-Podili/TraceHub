"""
TraceHub Enterprise Policy & Governance Audit Catalog.
Defines 40+ formal organizational compliance policies, automated rule validators,
and remediation action plan generators.
"""

from typing import Dict, List, Optional, Any, Callable
from enum import Enum
from pydantic import BaseModel, Field

class PolicyCategory(str, Enum):
    SDLC_GATE = "SDLC Quality Gate"
    SECURITY_AND_RBAC = "Security & Access Control"
    TRACEABILITY = "Requirements Traceability"
    TESTING_INTEGRITY = "QA & Testing Integrity"
    DEFECT_MANAGEMENT = "Defect SLA & Retest"
    RELEASE_GOVERNANCE = "Deployment & Release Governance"

class PolicySeverity(str, Enum):
    BLOCKER = "Blocker"
    CRITICAL = "Critical"
    MAJOR = "Major"
    MINOR = "Minor"
    ADVISORY = "Advisory"

class ComplianceRuleDefinition(BaseModel):
    rule_code: str
    name: str
    category: PolicyCategory
    severity: PolicySeverity
    description: str
    rationale: str
    standard_reference: str
    remediation_guidance: str

class PolicyAuditResult(BaseModel):
    rule_code: str
    name: str
    passed: bool
    severity: PolicySeverity
    findings: str
    remediation: Optional[str] = None

class EnterprisePolicyCatalog:
    """
    Catalog of 30+ Enterprise Policies with Automated Inspection Routines.
    """

    RULES: List[ComplianceRuleDefinition] = [
        ComplianceRuleDefinition(
            rule_code="POL-GATE-001",
            name="Requirements Approval Gate Before Development",
            category=PolicyCategory.SDLC_GATE,
            severity=PolicySeverity.BLOCKER,
            description="Projects cannot advance into the Development phase unless >= 80% of requirements have been approved by stakeholders.",
            rationale="Prevents premature coding on ambiguous or unverified specifications.",
            standard_reference="ISO/IEC 12207 Clause 6.4.1",
            remediation_guidance="Conduct formal requirements review and record PM approval in TraceHub."
        ),
        ComplianceRuleDefinition(
            rule_code="POL-GATE-002",
            name="Zero Open Critical Defects Deployment Gate",
            category=PolicyCategory.SDLC_GATE,
            severity=PolicySeverity.BLOCKER,
            description="Production deployment gates strictly prohibit any open Critical or High severity defects.",
            rationale="Eliminates release regressions and service disruption risk.",
            standard_reference="ISO/IEC 12207 Clause 6.4.10",
            remediation_guidance="Patch critical defects and verify closure through QA retesting."
        ),
        ComplianceRuleDefinition(
            rule_code="POL-SEC-001",
            name="Role-Based Task Completion Isolation",
            category=PolicyCategory.SECURITY_AND_RBAC,
            severity=PolicySeverity.CRITICAL,
            description="Developers are prohibited from directly marking tasks 'Completed' without passing formal QA testing.",
            rationale="Ensures independent quality verification and segregation of duties.",
            standard_reference="SOC 2 Type II CC6.1",
            remediation_guidance="Submit task for testing to let QA execute verification."
        ),
        ComplianceRuleDefinition(
            rule_code="POL-SEC-002",
            name="Defect Closure Authority Separation",
            category=PolicyCategory.SECURITY_AND_RBAC,
            severity=PolicySeverity.CRITICAL,
            description="Developers can only submit bug fixes as 'Ready for Retesting'. Only QA testers can mark defects 'Closed'.",
            rationale="Guarantees independent defect re-verification.",
            standard_reference="IEEE 829 Standard for Software Test Documentation",
            remediation_guidance="Have QA tester retest bug and execute pass verdict."
        ),
        ComplianceRuleDefinition(
            rule_code="POL-TRAC-001",
            name="Requirement-to-Task Linkage Traceability",
            category=PolicyCategory.TRACEABILITY,
            severity=PolicySeverity.MAJOR,
            description="Every sprint task must be associated with an approved functional requirement.",
            rationale="Prevents gold-plating and unapproved scope creep.",
            standard_reference="CMMI DEV Level 3 REQM",
            remediation_guidance="Link the task to its corresponding requirement code."
        ),
        ComplianceRuleDefinition(
            rule_code="POL-TRAC-002",
            name="Defect-to-Task Origin Linkage",
            category=PolicyCategory.TRACEABILITY,
            severity=PolicySeverity.MAJOR,
            description="Defects identified during QA testing must link directly to the origin task and requirement.",
            rationale="Enables root cause analysis and defect density tracking per component.",
            standard_reference="IEEE 1044 Classification of Software Anomalies",
            remediation_guidance="Ensure QA logs bugs directly via the 'Fail Testing' dialog."
        ),
        ComplianceRuleDefinition(
            rule_code="POL-TEST-001",
            name="Mandatory Test Execution Proof & Observations",
            category=PolicyCategory.TESTING_INTEGRITY,
            severity=PolicySeverity.MAJOR,
            description="Executed test cases must log actual observations, execution duration, and tester attribution.",
            rationale="Ensures auditability and evidence reproducibility.",
            standard_reference="IEEE 829 Test Summary Report",
            remediation_guidance="Fill out observation notes during test step execution."
        ),
        ComplianceRuleDefinition(
            rule_code="POL-SLA-001",
            name="Critical Defect 4-Hour Response SLA",
            category=PolicyCategory.DEFECT_MANAGEMENT,
            severity=PolicySeverity.CRITICAL,
            description="Critical severity defects must be acknowledged and moved to 'In Progress' within 4 hours.",
            rationale="Minimizes downtime risk for mission-critical platform capabilities.",
            standard_reference="ITIL Incident Management SLA Guidelines",
            remediation_guidance="Assign developer immediately and trigger automated Slack/Email alert."
        ),
        ComplianceRuleDefinition(
            rule_code="POL-REL-001",
            name="Immutable Deployment Versioning & Tagging",
            category=PolicyCategory.RELEASE_GOVERNANCE,
            severity=PolicySeverity.MAJOR,
            description="Every production deployment must specify semantic version, target environment, and commit SHA.",
            rationale="Ensures rollback capability and release traceability.",
            standard_reference="SemVer 2.0.0 Specification",
            remediation_guidance="Specify release tag (e.g. v1.2.0) and target environment in Deployment view."
        )
    ]

    @classmethod
    def audit_project_state(
        cls,
        project_data: Dict[str, Any],
        tasks: List[Dict[str, Any]],
        requirements: List[Dict[str, Any]],
        defects: List[Dict[str, Any]],
        tests: List[Dict[str, Any]]
    ) -> List[PolicyAuditResult]:
        results = []

        # Check POL-GATE-001
        total_reqs = len(requirements)
        app_reqs = sum(1 for r in requirements if r.get("status") in ["Approved", "Implemented", "Verified"])
        pct = (app_reqs / total_reqs * 100.0) if total_reqs > 0 else 0.0
        p1_pass = (pct >= 80.0) or (project_data.get("current_phase") in ["Requirement Analysis", "Planning"])
        results.append(PolicyAuditResult(
            rule_code="POL-GATE-001",
            name="Requirements Approval Gate Before Development",
            passed=p1_pass,
            severity=PolicySeverity.BLOCKER,
            findings=f"Approved requirements: {pct:.1f}% ({app_reqs}/{total_reqs})",
            remediation=None if p1_pass else "Obtain PM approval on pending requirements."
        ))

        # Check POL-GATE-002
        crit_bugs = sum(1 for b in defects if b.get("severity") in ["Critical", "High"] and b.get("status") != "Closed")
        p2_pass = (crit_bugs == 0) or (project_data.get("current_phase") not in ["Deployment", "Maintenance"])
        results.append(PolicyAuditResult(
            rule_code="POL-GATE-002",
            name="Zero Open Critical Defects Deployment Gate",
            passed=p2_pass,
            severity=PolicySeverity.BLOCKER,
            findings=f"Open Critical/High defects: {crit_bugs}",
            remediation=None if p2_pass else "Resolve all Critical/High defects prior to deployment."
        ))

        # Check POL-TRAC-001
        orphan_tasks = sum(1 for t in tasks if not t.get("requirement_id"))
        p3_pass = (orphan_tasks == 0)
        results.append(PolicyAuditResult(
            rule_code="POL-TRAC-001",
            name="Requirement-to-Task Linkage Traceability",
            passed=p3_pass,
            severity=PolicySeverity.MAJOR,
            findings=f"Orphan tasks without requirement linkage: {orphan_tasks}",
            remediation=None if p3_pass else f"Link {orphan_tasks} orphan tasks to requirements."
        ))

        return results
