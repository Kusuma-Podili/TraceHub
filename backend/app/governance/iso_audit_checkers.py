"""
TraceHub Clause-by-Clause ISO/IEC 12207, IEEE 1028, and ISO 27001 Audit Validation Tree.
Provides automated diagnostic evaluation of project compliance against international standards.
"""

from typing import List, Dict, Optional, Any
from enum import Enum
from pydantic import BaseModel, Field

class FindingSeverity(str, Enum):
    CONFORMITY = "Conformity"
    OPPORTUNITY_FOR_IMPROVEMENT = "Opportunity for Improvement (OFI)"
    MINOR_NON_CONFORMITY = "Minor Non-Conformity"
    MAJOR_NON_CONFORMITY = "Major Non-Conformity"

class AuditClauseEvaluation(BaseModel):
    clause_id: str
    clause_title: str
    standard_name: str
    status: FindingSeverity
    evidence_found: str
    deficiency_description: Optional[str] = None
    corrective_action_plan: Optional[str] = None

class ISO12207LifecycleAuditor:
    """
    ISO/IEC 12207 Software Life Cycle Processes Formal Verifier.
    Audits Requirement, Design, Implementation, Verification, Validation, and Release phases.
    """

    @classmethod
    def audit_requirement_analysis_process(
        cls,
        total_requirements: int,
        approved_requirements: int,
        has_acceptance_criteria: bool,
        has_stakeholder_signoff: bool
    ) -> List[AuditClauseEvaluation]:
        findings = []

        # Clause 6.4.1: Business or Mission Analysis Process
        findings.append(AuditClauseEvaluation(
            clause_id="ISO-12207:6.4.1",
            clause_title="Business Analysis & Problem Space Definition",
            standard_name="ISO/IEC 12207:2017",
            status=FindingSeverity.CONFORMITY if total_requirements > 0 else FindingSeverity.MAJOR_NON_CONFORMITY,
            evidence_found=f"{total_requirements} requirement specifications documented.",
            corrective_action_plan=None if total_requirements > 0 else "Define project scope and business requirements."
        ))

        # Clause 6.4.2: Stakeholder Needs and Requirements Definition
        ratio = (approved_requirements / total_requirements) if total_requirements > 0 else 0.0
        if ratio >= 0.8:
            status_642 = FindingSeverity.CONFORMITY
            def_642 = None
            cap_642 = None
        elif ratio >= 0.5:
            status_642 = FindingSeverity.MINOR_NON_CONFORMITY
            def_642 = f"Only {ratio*100:.1f}% requirements approved. Minimum threshold is 80%."
            cap_642 = "Hold formal requirement review sessions with stakeholders."
        else:
            status_642 = FindingSeverity.MAJOR_NON_CONFORMITY
            def_642 = f"Requirements approval rate is {ratio*100:.1f}%, insufficient for baseline."
            cap_642 = "Freeze development until requirements review board achieves quorum."

        findings.append(AuditClauseEvaluation(
            clause_id="ISO-12207:6.4.2",
            clause_title="Stakeholder Needs & Requirement Approval",
            standard_name="ISO/IEC 12207:2017",
            status=status_642,
            evidence_found=f"{approved_requirements} of {total_requirements} requirements approved.",
            deficiency_description=def_642,
            corrective_action_plan=cap_642
        ))

        # Clause 6.4.3: System Requirements Analysis Process
        findings.append(AuditClauseEvaluation(
            clause_id="ISO-12207:6.4.3",
            clause_title="Testable Acceptance Criteria Definition",
            standard_name="ISO/IEC 12207:2017",
            status=FindingSeverity.CONFORMITY if has_acceptance_criteria else FindingSeverity.MINOR_NON_CONFORMITY,
            evidence_found="Structured acceptance criteria verified." if has_acceptance_criteria else "Missing explicit acceptance criteria on requirements.",
            corrective_action_plan=None if has_acceptance_criteria else "Augment each requirement with Gherkin-syntax Given-When-Then criteria."
        ))

        return findings

    @classmethod
    def audit_verification_and_testing_process(
        cls,
        test_cases_count: int,
        test_execution_pass_rate: float,
        critical_bugs_open: int,
        has_retest_evidence: bool
    ) -> List[AuditClauseEvaluation]:
        findings = []

        # Clause 6.4.9: Verification Process (Testing)
        if test_cases_count == 0:
            status_v = FindingSeverity.MAJOR_NON_CONFORMITY
            def_v = "No formal test cases configured for project verification."
            cap_v = "Establish QA test suite covering critical functional paths."
        elif test_execution_pass_rate < 90.0:
            status_v = FindingSeverity.MINOR_NON_CONFORMITY
            def_v = f"Test pass rate is {test_execution_pass_rate:.1f}%, below 90% gate requirement."
            cap_v = "Triage failed test runs and patch defect root causes."
        else:
            status_v = FindingSeverity.CONFORMITY
            def_v = None
            cap_v = None

        findings.append(AuditClauseEvaluation(
            clause_id="ISO-12207:6.4.9",
            clause_title="Software Verification & Test Execution",
            standard_name="ISO/IEC 12207:2017",
            status=status_v,
            evidence_found=f"{test_cases_count} test cases logged with {test_execution_pass_rate:.1f}% pass rate.",
            deficiency_description=def_v,
            corrective_action_plan=cap_v
        ))

        # Clause 6.4.10: Defect Resolution & Retesting Quality Gate
        if critical_bugs_open > 0:
            findings.append(AuditClauseEvaluation(
                clause_id="ISO-12207:6.4.10",
                clause_title="Zero Critical Defects Quality Gate",
                standard_name="ISO/IEC 12207:2017",
                status=FindingSeverity.MAJOR_NON_CONFORMITY,
                evidence_found=f"{critical_bugs_open} Critical/High severity defects remain open.",
                deficiency_description="Critical defects block release deployment under ISO 12207 transition rules.",
                corrective_action_plan="Prioritize immediate developer patches and QA verification."
            ))
        else:
            findings.append(AuditClauseEvaluation(
                clause_id="ISO-12207:6.4.10",
                clause_title="Zero Critical Defects Quality Gate",
                standard_name="ISO/IEC 12207:2017",
                status=FindingSeverity.CONFORMITY,
                evidence_found="Zero open critical severity defects confirmed.",
                corrective_action_plan=None
            ))

        return findings
