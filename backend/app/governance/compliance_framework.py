import logging
from typing import Dict, List, Optional, Any, Set
from pydantic import BaseModel, Field
from enum import Enum

logger = logging.getLogger("tracehub.governance.compliance")

class RegulatoryStandard(str, Enum):
    ISO_12207 = "ISO/IEC 12207 (Software Lifecycle Processes)"
    IEEE_829 = "IEEE 829 (Standard for Software Test Documentation)"
    SOC2_TYPE2 = "SOC 2 Type II (Security, Availability & Confidentiality)"
    HIPAA = "HIPAA Security Rule (Audit Controls & Integrity)"
    GDPR = "GDPR Article 25 & 32 (Privacy by Design)"

class AuditEvidence(BaseModel):
    evidence_id: str
    standard: RegulatoryStandard
    section: str
    control_title: str
    status: str = "Compliant"  # Compliant, Partial, Non-Compliant, Not Applicable
    description: str
    evidence_artifacts: List[str] = Field(default_factory=list)
    verified_by_user_id: Optional[int] = None

class ComplianceFramework:
    """
    Enterprise Compliance, Audit Standards, and Regulatory Evidence Mapper.
    Assesses repository and workflow state against ISO 12207, IEEE 829, SOC2, and GDPR controls.
    """

    @classmethod
    def evaluate_compliance_matrix(
        cls,
        has_approved_requirements: bool,
        has_version_controlled_code: bool,
        has_peer_reviews: bool,
        has_qa_test_execution_logs: bool,
        has_zero_critical_unresolved_bugs: bool,
        has_audit_logs: bool,
        has_access_control_rbac: bool
    ) -> Dict[str, Any]:
        controls: List[AuditEvidence] = [
            AuditEvidence(
                evidence_id="ISO-6.4.1",
                standard=RegulatoryStandard.ISO_12207,
                section="Stakeholder Requirements Definition Process",
                control_title="Requirement Traceability & Formal Approval",
                status="Compliant" if has_approved_requirements else "Non-Compliant",
                description="All software capabilities must trace to verified stakeholder specifications.",
                evidence_artifacts=["Requirement Matrix", "Approval Signoff Log"]
            ),
            AuditEvidence(
                evidence_id="ISO-6.4.4",
                standard=RegulatoryStandard.ISO_12207,
                section="Implementation Process",
                control_title="Configuration Management & Peer Reviews",
                status="Compliant" if (has_version_controlled_code and has_peer_reviews) else "Partial",
                description="Code changes require branch protection, commit signatures, and developer review.",
                evidence_artifacts=["Git History", "Pull Request Reviews"]
            ),
            AuditEvidence(
                evidence_id="IEEE-829-TP",
                standard=RegulatoryStandard.IEEE_829,
                section="Test Plan & Execution Logs",
                control_title="Formal Test Case Execution & Defect Linkage",
                status="Compliant" if has_qa_test_execution_logs else "Non-Compliant",
                description="Every release candidate requires reproducible step-by-step test execution telemetry.",
                evidence_artifacts=["Test Run Logs", "Defect Reports"]
            ),
            AuditEvidence(
                evidence_id="SOC2-CC6.1",
                standard=RegulatoryStandard.SOC2_TYPE2,
                section="Common Criteria - Access Control",
                control_title="Role-Based Access Control (RBAC) Enforcement",
                status="Compliant" if has_access_control_rbac else "Non-Compliant",
                description="Strict permission boundaries between PM, Developer, and Tester roles.",
                evidence_artifacts=["User Role Matrix", "JWT Security Middleware"]
            ),
            AuditEvidence(
                evidence_id="SOC2-CC7.2",
                standard=RegulatoryStandard.SOC2_TYPE2,
                section="Change Management",
                control_title="Quality Gate Validation Before Release",
                status="Compliant" if has_zero_critical_unresolved_bugs else "Non-Compliant",
                description="Zero open critical or high vulnerability defects allowed in production gates.",
                evidence_artifacts=["Phase Readiness Telemetry", "Quality Gate Checklist"]
            ),
            AuditEvidence(
                evidence_id="GDPR-Art32",
                standard=RegulatoryStandard.GDPR,
                section="Security of Processing",
                control_title="Immutable Security & Audit Trail Logging",
                status="Compliant" if has_audit_logs else "Partial",
                description="Timestamped event attribution for data modifications and phase transitions.",
                evidence_artifacts=["Audit Trail Logs", "System Access Records"]
            )
        ]

        total = len(controls)
        compliant_count = sum(1 for c in controls if c.status == "Compliant")
        score = (compliant_count / total * 100.0) if total > 0 else 0.0

        return {
            "overall_compliance_score": round(score, 1),
            "total_controls_audited": total,
            "compliant_controls": compliant_count,
            "is_audit_ready": score >= 85.0,
            "controls": [c.model_dump() for c in controls]
        }
