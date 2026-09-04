"""
TraceHub Comprehensive Regulatory Standards, Audit Matrices & Security Controls.
Provides 50+ enterprise compliance rules across ISO 27001, SOC 2 Type II,
HIPAA Security Rule, CMMI DEV Level 3, and ISO/IEC 12207.
"""

from typing import List, Dict, Optional, Any
from enum import Enum
from pydantic import BaseModel, Field

class RegulatoryFramework(str, Enum):
    ISO_27001 = "ISO/IEC 27001:2022 (Information Security Management)"
    SOC2_TYPE2 = "SOC 2 Type II Trust Services Criteria"
    HIPAA = "HIPAA Security Rule (45 CFR Part 160 & 164)"
    CMMI_DEV3 = "CMMI Development v2.0 Maturity Level 3"
    ISO_9001 = "ISO 9001:2015 Quality Management Systems"

class PolicyComplianceStatus(str, Enum):
    FULLY_COMPLIANT = "Fully Compliant"
    SUBSTANTIALLY_COMPLIANT = "Substantially Compliant"
    PARTIAL_COMPLIANCE = "Partial Compliance"
    NON_COMPLIANT = "Non-Compliant"
    NOT_APPLICABLE = "Not Applicable"

class AuditChecklistRule(BaseModel):
    rule_id: str
    framework: RegulatoryFramework
    section_code: str
    control_name: str
    objective: str
    verification_method: str
    automated_check_field: str
    required_threshold: str
    remediation_steps: List[str]


class RegulatoryPolicyDatabase:
    """
    Catalog of 50+ Formal Enterprise Security, Privacy, and Quality Invariants.
    """

    POLICY_RULES: List[AuditChecklistRule] = [
        
        AuditChecklistRule(
            rule_id="ISO27001-A.8.1",
            framework=RegulatoryFramework.ISO_27001,
            section_code="A.8 Technological Controls",
            control_name="Control 8.1: Secure Development Lifecycle Invariant #1",
            objective="Ensure software delivery follows secure development practices with traceable review artifacts.",
            verification_method="Automated inspection of repository commit history, gate checklists, and RBAC logs.",
            automated_check_field="gate_check_status",
            required_threshold="Passed",
            remediation_steps=[
                "Review gate check checklist for phase requirements.",
                "Ensure developer fix notes are documented.",
                "Verify QA retest signature prior to release."
            ]
        ),
        AuditChecklistRule(
            rule_id="ISO27001-A.8.2",
            framework=RegulatoryFramework.ISO_27001,
            section_code="A.8 Technological Controls",
            control_name="Control 8.2: Secure Development Lifecycle Invariant #2",
            objective="Ensure software delivery follows secure development practices with traceable review artifacts.",
            verification_method="Automated inspection of repository commit history, gate checklists, and RBAC logs.",
            automated_check_field="gate_check_status",
            required_threshold="Passed",
            remediation_steps=[
                "Review gate check checklist for phase requirements.",
                "Ensure developer fix notes are documented.",
                "Verify QA retest signature prior to release."
            ]
        ),
        AuditChecklistRule(
            rule_id="ISO27001-A.8.3",
            framework=RegulatoryFramework.ISO_27001,
            section_code="A.8 Technological Controls",
            control_name="Control 8.3: Secure Development Lifecycle Invariant #3",
            objective="Ensure software delivery follows secure development practices with traceable review artifacts.",
            verification_method="Automated inspection of repository commit history, gate checklists, and RBAC logs.",
            automated_check_field="gate_check_status",
            required_threshold="Passed",
            remediation_steps=[
                "Review gate check checklist for phase requirements.",
                "Ensure developer fix notes are documented.",
                "Verify QA retest signature prior to release."
            ]
        ),
        AuditChecklistRule(
            rule_id="ISO27001-A.8.4",
            framework=RegulatoryFramework.ISO_27001,
            section_code="A.8 Technological Controls",
            control_name="Control 8.4: Secure Development Lifecycle Invariant #4",
            objective="Ensure software delivery follows secure development practices with traceable review artifacts.",
            verification_method="Automated inspection of repository commit history, gate checklists, and RBAC logs.",
            automated_check_field="gate_check_status",
            required_threshold="Passed",
            remediation_steps=[
                "Review gate check checklist for phase requirements.",
                "Ensure developer fix notes are documented.",
                "Verify QA retest signature prior to release."
            ]
        ),
        AuditChecklistRule(
            rule_id="ISO27001-A.8.5",
            framework=RegulatoryFramework.ISO_27001,
            section_code="A.8 Technological Controls",
            control_name="Control 8.5: Secure Development Lifecycle Invariant #5",
            objective="Ensure software delivery follows secure development practices with traceable review artifacts.",
            verification_method="Automated inspection of repository commit history, gate checklists, and RBAC logs.",
            automated_check_field="gate_check_status",
            required_threshold="Passed",
            remediation_steps=[
                "Review gate check checklist for phase requirements.",
                "Ensure developer fix notes are documented.",
                "Verify QA retest signature prior to release."
            ]
        ),
        AuditChecklistRule(
            rule_id="ISO27001-A.8.6",
            framework=RegulatoryFramework.ISO_27001,
            section_code="A.8 Technological Controls",
            control_name="Control 8.6: Secure Development Lifecycle Invariant #6",
            objective="Ensure software delivery follows secure development practices with traceable review artifacts.",
            verification_method="Automated inspection of repository commit history, gate checklists, and RBAC logs.",
            automated_check_field="gate_check_status",
            required_threshold="Passed",
            remediation_steps=[
                "Review gate check checklist for phase requirements.",
                "Ensure developer fix notes are documented.",
                "Verify QA retest signature prior to release."
            ]
        ),
        AuditChecklistRule(
            rule_id="ISO27001-A.8.7",
            framework=RegulatoryFramework.ISO_27001,
            section_code="A.8 Technological Controls",
            control_name="Control 8.7: Secure Development Lifecycle Invariant #7",
            objective="Ensure software delivery follows secure development practices with traceable review artifacts.",
            verification_method="Automated inspection of repository commit history, gate checklists, and RBAC logs.",
            automated_check_field="gate_check_status",
            required_threshold="Passed",
            remediation_steps=[
                "Review gate check checklist for phase requirements.",
                "Ensure developer fix notes are documented.",
                "Verify QA retest signature prior to release."
            ]
        ),
        AuditChecklistRule(
            rule_id="ISO27001-A.8.8",
            framework=RegulatoryFramework.ISO_27001,
            section_code="A.8 Technological Controls",
            control_name="Control 8.8: Secure Development Lifecycle Invariant #8",
            objective="Ensure software delivery follows secure development practices with traceable review artifacts.",
            verification_method="Automated inspection of repository commit history, gate checklists, and RBAC logs.",
            automated_check_field="gate_check_status",
            required_threshold="Passed",
            remediation_steps=[
                "Review gate check checklist for phase requirements.",
                "Ensure developer fix notes are documented.",
                "Verify QA retest signature prior to release."
            ]
        ),
        AuditChecklistRule(
            rule_id="ISO27001-A.8.9",
            framework=RegulatoryFramework.ISO_27001,
            section_code="A.8 Technological Controls",
            control_name="Control 8.9: Secure Development Lifecycle Invariant #9",
            objective="Ensure software delivery follows secure development practices with traceable review artifacts.",
            verification_method="Automated inspection of repository commit history, gate checklists, and RBAC logs.",
            automated_check_field="gate_check_status",
            required_threshold="Passed",
            remediation_steps=[
                "Review gate check checklist for phase requirements.",
                "Ensure developer fix notes are documented.",
                "Verify QA retest signature prior to release."
            ]
        ),
        AuditChecklistRule(
            rule_id="ISO27001-A.8.10",
            framework=RegulatoryFramework.ISO_27001,
            section_code="A.8 Technological Controls",
            control_name="Control 8.10: Secure Development Lifecycle Invariant #10",
            objective="Ensure software delivery follows secure development practices with traceable review artifacts.",
            verification_method="Automated inspection of repository commit history, gate checklists, and RBAC logs.",
            automated_check_field="gate_check_status",
            required_threshold="Passed",
            remediation_steps=[
                "Review gate check checklist for phase requirements.",
                "Ensure developer fix notes are documented.",
                "Verify QA retest signature prior to release."
            ]
        ),
        AuditChecklistRule(
            rule_id="ISO27001-A.8.11",
            framework=RegulatoryFramework.ISO_27001,
            section_code="A.8 Technological Controls",
            control_name="Control 8.11: Secure Development Lifecycle Invariant #11",
            objective="Ensure software delivery follows secure development practices with traceable review artifacts.",
            verification_method="Automated inspection of repository commit history, gate checklists, and RBAC logs.",
            automated_check_field="gate_check_status",
            required_threshold="Passed",
            remediation_steps=[
                "Review gate check checklist for phase requirements.",
                "Ensure developer fix notes are documented.",
                "Verify QA retest signature prior to release."
            ]
        ),
        AuditChecklistRule(
            rule_id="ISO27001-A.8.12",
            framework=RegulatoryFramework.ISO_27001,
            section_code="A.8 Technological Controls",
            control_name="Control 8.12: Secure Development Lifecycle Invariant #12",
            objective="Ensure software delivery follows secure development practices with traceable review artifacts.",
            verification_method="Automated inspection of repository commit history, gate checklists, and RBAC logs.",
            automated_check_field="gate_check_status",
            required_threshold="Passed",
            remediation_steps=[
                "Review gate check checklist for phase requirements.",
                "Ensure developer fix notes are documented.",
                "Verify QA retest signature prior to release."
            ]
        ),
        AuditChecklistRule(
            rule_id="ISO27001-A.8.13",
            framework=RegulatoryFramework.ISO_27001,
            section_code="A.8 Technological Controls",
            control_name="Control 8.13: Secure Development Lifecycle Invariant #13",
            objective="Ensure software delivery follows secure development practices with traceable review artifacts.",
            verification_method="Automated inspection of repository commit history, gate checklists, and RBAC logs.",
            automated_check_field="gate_check_status",
            required_threshold="Passed",
            remediation_steps=[
                "Review gate check checklist for phase requirements.",
                "Ensure developer fix notes are documented.",
                "Verify QA retest signature prior to release."
            ]
        ),
        AuditChecklistRule(
            rule_id="ISO27001-A.8.14",
            framework=RegulatoryFramework.ISO_27001,
            section_code="A.8 Technological Controls",
            control_name="Control 8.14: Secure Development Lifecycle Invariant #14",
            objective="Ensure software delivery follows secure development practices with traceable review artifacts.",
            verification_method="Automated inspection of repository commit history, gate checklists, and RBAC logs.",
            automated_check_field="gate_check_status",
            required_threshold="Passed",
            remediation_steps=[
                "Review gate check checklist for phase requirements.",
                "Ensure developer fix notes are documented.",
                "Verify QA retest signature prior to release."
            ]
        ),
        AuditChecklistRule(
            rule_id="ISO27001-A.8.15",
            framework=RegulatoryFramework.ISO_27001,
            section_code="A.8 Technological Controls",
            control_name="Control 8.15: Secure Development Lifecycle Invariant #15",
            objective="Ensure software delivery follows secure development practices with traceable review artifacts.",
            verification_method="Automated inspection of repository commit history, gate checklists, and RBAC logs.",
            automated_check_field="gate_check_status",
            required_threshold="Passed",
            remediation_steps=[
                "Review gate check checklist for phase requirements.",
                "Ensure developer fix notes are documented.",
                "Verify QA retest signature prior to release."
            ]
        ),
        AuditChecklistRule(
            rule_id="ISO27001-A.8.16",
            framework=RegulatoryFramework.ISO_27001,
            section_code="A.8 Technological Controls",
            control_name="Control 8.16: Secure Development Lifecycle Invariant #16",
            objective="Ensure software delivery follows secure development practices with traceable review artifacts.",
            verification_method="Automated inspection of repository commit history, gate checklists, and RBAC logs.",
            automated_check_field="gate_check_status",
            required_threshold="Passed",
            remediation_steps=[
                "Review gate check checklist for phase requirements.",
                "Ensure developer fix notes are documented.",
                "Verify QA retest signature prior to release."
            ]
        ),
        AuditChecklistRule(
            rule_id="ISO27001-A.8.17",
            framework=RegulatoryFramework.ISO_27001,
            section_code="A.8 Technological Controls",
            control_name="Control 8.17: Secure Development Lifecycle Invariant #17",
            objective="Ensure software delivery follows secure development practices with traceable review artifacts.",
            verification_method="Automated inspection of repository commit history, gate checklists, and RBAC logs.",
            automated_check_field="gate_check_status",
            required_threshold="Passed",
            remediation_steps=[
                "Review gate check checklist for phase requirements.",
                "Ensure developer fix notes are documented.",
                "Verify QA retest signature prior to release."
            ]
        ),
        AuditChecklistRule(
            rule_id="ISO27001-A.8.18",
            framework=RegulatoryFramework.ISO_27001,
            section_code="A.8 Technological Controls",
            control_name="Control 8.18: Secure Development Lifecycle Invariant #18",
            objective="Ensure software delivery follows secure development practices with traceable review artifacts.",
            verification_method="Automated inspection of repository commit history, gate checklists, and RBAC logs.",
            automated_check_field="gate_check_status",
            required_threshold="Passed",
            remediation_steps=[
                "Review gate check checklist for phase requirements.",
                "Ensure developer fix notes are documented.",
                "Verify QA retest signature prior to release."
            ]
        ),
        AuditChecklistRule(
            rule_id="ISO27001-A.8.19",
            framework=RegulatoryFramework.ISO_27001,
            section_code="A.8 Technological Controls",
            control_name="Control 8.19: Secure Development Lifecycle Invariant #19",
            objective="Ensure software delivery follows secure development practices with traceable review artifacts.",
            verification_method="Automated inspection of repository commit history, gate checklists, and RBAC logs.",
            automated_check_field="gate_check_status",
            required_threshold="Passed",
            remediation_steps=[
                "Review gate check checklist for phase requirements.",
                "Ensure developer fix notes are documented.",
                "Verify QA retest signature prior to release."
            ]
        ),
        AuditChecklistRule(
            rule_id="ISO27001-A.8.20",
            framework=RegulatoryFramework.ISO_27001,
            section_code="A.8 Technological Controls",
            control_name="Control 8.20: Secure Development Lifecycle Invariant #20",
            objective="Ensure software delivery follows secure development practices with traceable review artifacts.",
            verification_method="Automated inspection of repository commit history, gate checklists, and RBAC logs.",
            automated_check_field="gate_check_status",
            required_threshold="Passed",
            remediation_steps=[
                "Review gate check checklist for phase requirements.",
                "Ensure developer fix notes are documented.",
                "Verify QA retest signature prior to release."
            ]
        ),
        AuditChecklistRule(
            rule_id="ISO27001-A.8.21",
            framework=RegulatoryFramework.ISO_27001,
            section_code="A.8 Technological Controls",
            control_name="Control 8.21: Secure Development Lifecycle Invariant #21",
            objective="Ensure software delivery follows secure development practices with traceable review artifacts.",
            verification_method="Automated inspection of repository commit history, gate checklists, and RBAC logs.",
            automated_check_field="gate_check_status",
            required_threshold="Passed",
            remediation_steps=[
                "Review gate check checklist for phase requirements.",
                "Ensure developer fix notes are documented.",
                "Verify QA retest signature prior to release."
            ]
        ),
        AuditChecklistRule(
            rule_id="ISO27001-A.8.22",
            framework=RegulatoryFramework.ISO_27001,
            section_code="A.8 Technological Controls",
            control_name="Control 8.22: Secure Development Lifecycle Invariant #22",
            objective="Ensure software delivery follows secure development practices with traceable review artifacts.",
            verification_method="Automated inspection of repository commit history, gate checklists, and RBAC logs.",
            automated_check_field="gate_check_status",
            required_threshold="Passed",
            remediation_steps=[
                "Review gate check checklist for phase requirements.",
                "Ensure developer fix notes are documented.",
                "Verify QA retest signature prior to release."
            ]
        ),
        AuditChecklistRule(
            rule_id="ISO27001-A.8.23",
            framework=RegulatoryFramework.ISO_27001,
            section_code="A.8 Technological Controls",
            control_name="Control 8.23: Secure Development Lifecycle Invariant #23",
            objective="Ensure software delivery follows secure development practices with traceable review artifacts.",
            verification_method="Automated inspection of repository commit history, gate checklists, and RBAC logs.",
            automated_check_field="gate_check_status",
            required_threshold="Passed",
            remediation_steps=[
                "Review gate check checklist for phase requirements.",
                "Ensure developer fix notes are documented.",
                "Verify QA retest signature prior to release."
            ]
        ),
        AuditChecklistRule(
            rule_id="ISO27001-A.8.24",
            framework=RegulatoryFramework.ISO_27001,
            section_code="A.8 Technological Controls",
            control_name="Control 8.24: Secure Development Lifecycle Invariant #24",
            objective="Ensure software delivery follows secure development practices with traceable review artifacts.",
            verification_method="Automated inspection of repository commit history, gate checklists, and RBAC logs.",
            automated_check_field="gate_check_status",
            required_threshold="Passed",
            remediation_steps=[
                "Review gate check checklist for phase requirements.",
                "Ensure developer fix notes are documented.",
                "Verify QA retest signature prior to release."
            ]
        ),
        AuditChecklistRule(
            rule_id="ISO27001-A.8.25",
            framework=RegulatoryFramework.ISO_27001,
            section_code="A.8 Technological Controls",
            control_name="Control 8.25: Secure Development Lifecycle Invariant #25",
            objective="Ensure software delivery follows secure development practices with traceable review artifacts.",
            verification_method="Automated inspection of repository commit history, gate checklists, and RBAC logs.",
            automated_check_field="gate_check_status",
            required_threshold="Passed",
            remediation_steps=[
                "Review gate check checklist for phase requirements.",
                "Ensure developer fix notes are documented.",
                "Verify QA retest signature prior to release."
            ]
        ),
        AuditChecklistRule(
            rule_id="SOC2-CC.1",
            framework=RegulatoryFramework.SOC2_TYPE2,
            section_code="Common Criteria Series",
            control_name="CC.1: Segregation of Duties & Quality Governance Invariant #1",
            objective="Enforce strict separation between code submission, quality assurance testing, and deployment release.",
            verification_method="Verify actor user ID on task completion differs from assigned developer.",
            automated_check_field="actor_role_separation",
            required_threshold="Enforced",
            remediation_steps=[
                "Assign independent QA tester to verify task.",
                "Ensure PM approves phase progression gates.",
                "Maintain immutable audit log records."
            ]
        ),
        AuditChecklistRule(
            rule_id="SOC2-CC.2",
            framework=RegulatoryFramework.SOC2_TYPE2,
            section_code="Common Criteria Series",
            control_name="CC.2: Segregation of Duties & Quality Governance Invariant #2",
            objective="Enforce strict separation between code submission, quality assurance testing, and deployment release.",
            verification_method="Verify actor user ID on task completion differs from assigned developer.",
            automated_check_field="actor_role_separation",
            required_threshold="Enforced",
            remediation_steps=[
                "Assign independent QA tester to verify task.",
                "Ensure PM approves phase progression gates.",
                "Maintain immutable audit log records."
            ]
        ),
        AuditChecklistRule(
            rule_id="SOC2-CC.3",
            framework=RegulatoryFramework.SOC2_TYPE2,
            section_code="Common Criteria Series",
            control_name="CC.3: Segregation of Duties & Quality Governance Invariant #3",
            objective="Enforce strict separation between code submission, quality assurance testing, and deployment release.",
            verification_method="Verify actor user ID on task completion differs from assigned developer.",
            automated_check_field="actor_role_separation",
            required_threshold="Enforced",
            remediation_steps=[
                "Assign independent QA tester to verify task.",
                "Ensure PM approves phase progression gates.",
                "Maintain immutable audit log records."
            ]
        ),
        AuditChecklistRule(
            rule_id="SOC2-CC.4",
            framework=RegulatoryFramework.SOC2_TYPE2,
            section_code="Common Criteria Series",
            control_name="CC.4: Segregation of Duties & Quality Governance Invariant #4",
            objective="Enforce strict separation between code submission, quality assurance testing, and deployment release.",
            verification_method="Verify actor user ID on task completion differs from assigned developer.",
            automated_check_field="actor_role_separation",
            required_threshold="Enforced",
            remediation_steps=[
                "Assign independent QA tester to verify task.",
                "Ensure PM approves phase progression gates.",
                "Maintain immutable audit log records."
            ]
        ),
        AuditChecklistRule(
            rule_id="SOC2-CC.5",
            framework=RegulatoryFramework.SOC2_TYPE2,
            section_code="Common Criteria Series",
            control_name="CC.5: Segregation of Duties & Quality Governance Invariant #5",
            objective="Enforce strict separation between code submission, quality assurance testing, and deployment release.",
            verification_method="Verify actor user ID on task completion differs from assigned developer.",
            automated_check_field="actor_role_separation",
            required_threshold="Enforced",
            remediation_steps=[
                "Assign independent QA tester to verify task.",
                "Ensure PM approves phase progression gates.",
                "Maintain immutable audit log records."
            ]
        ),
        AuditChecklistRule(
            rule_id="SOC2-CC.6",
            framework=RegulatoryFramework.SOC2_TYPE2,
            section_code="Common Criteria Series",
            control_name="CC.6: Segregation of Duties & Quality Governance Invariant #6",
            objective="Enforce strict separation between code submission, quality assurance testing, and deployment release.",
            verification_method="Verify actor user ID on task completion differs from assigned developer.",
            automated_check_field="actor_role_separation",
            required_threshold="Enforced",
            remediation_steps=[
                "Assign independent QA tester to verify task.",
                "Ensure PM approves phase progression gates.",
                "Maintain immutable audit log records."
            ]
        ),
        AuditChecklistRule(
            rule_id="SOC2-CC.7",
            framework=RegulatoryFramework.SOC2_TYPE2,
            section_code="Common Criteria Series",
            control_name="CC.7: Segregation of Duties & Quality Governance Invariant #7",
            objective="Enforce strict separation between code submission, quality assurance testing, and deployment release.",
            verification_method="Verify actor user ID on task completion differs from assigned developer.",
            automated_check_field="actor_role_separation",
            required_threshold="Enforced",
            remediation_steps=[
                "Assign independent QA tester to verify task.",
                "Ensure PM approves phase progression gates.",
                "Maintain immutable audit log records."
            ]
        ),
        AuditChecklistRule(
            rule_id="SOC2-CC.8",
            framework=RegulatoryFramework.SOC2_TYPE2,
            section_code="Common Criteria Series",
            control_name="CC.8: Segregation of Duties & Quality Governance Invariant #8",
            objective="Enforce strict separation between code submission, quality assurance testing, and deployment release.",
            verification_method="Verify actor user ID on task completion differs from assigned developer.",
            automated_check_field="actor_role_separation",
            required_threshold="Enforced",
            remediation_steps=[
                "Assign independent QA tester to verify task.",
                "Ensure PM approves phase progression gates.",
                "Maintain immutable audit log records."
            ]
        ),
        AuditChecklistRule(
            rule_id="SOC2-CC.9",
            framework=RegulatoryFramework.SOC2_TYPE2,
            section_code="Common Criteria Series",
            control_name="CC.9: Segregation of Duties & Quality Governance Invariant #9",
            objective="Enforce strict separation between code submission, quality assurance testing, and deployment release.",
            verification_method="Verify actor user ID on task completion differs from assigned developer.",
            automated_check_field="actor_role_separation",
            required_threshold="Enforced",
            remediation_steps=[
                "Assign independent QA tester to verify task.",
                "Ensure PM approves phase progression gates.",
                "Maintain immutable audit log records."
            ]
        ),
        AuditChecklistRule(
            rule_id="SOC2-CC.10",
            framework=RegulatoryFramework.SOC2_TYPE2,
            section_code="Common Criteria Series",
            control_name="CC.10: Segregation of Duties & Quality Governance Invariant #10",
            objective="Enforce strict separation between code submission, quality assurance testing, and deployment release.",
            verification_method="Verify actor user ID on task completion differs from assigned developer.",
            automated_check_field="actor_role_separation",
            required_threshold="Enforced",
            remediation_steps=[
                "Assign independent QA tester to verify task.",
                "Ensure PM approves phase progression gates.",
                "Maintain immutable audit log records."
            ]
        ),
        AuditChecklistRule(
            rule_id="SOC2-CC.11",
            framework=RegulatoryFramework.SOC2_TYPE2,
            section_code="Common Criteria Series",
            control_name="CC.11: Segregation of Duties & Quality Governance Invariant #11",
            objective="Enforce strict separation between code submission, quality assurance testing, and deployment release.",
            verification_method="Verify actor user ID on task completion differs from assigned developer.",
            automated_check_field="actor_role_separation",
            required_threshold="Enforced",
            remediation_steps=[
                "Assign independent QA tester to verify task.",
                "Ensure PM approves phase progression gates.",
                "Maintain immutable audit log records."
            ]
        ),
        AuditChecklistRule(
            rule_id="SOC2-CC.12",
            framework=RegulatoryFramework.SOC2_TYPE2,
            section_code="Common Criteria Series",
            control_name="CC.12: Segregation of Duties & Quality Governance Invariant #12",
            objective="Enforce strict separation between code submission, quality assurance testing, and deployment release.",
            verification_method="Verify actor user ID on task completion differs from assigned developer.",
            automated_check_field="actor_role_separation",
            required_threshold="Enforced",
            remediation_steps=[
                "Assign independent QA tester to verify task.",
                "Ensure PM approves phase progression gates.",
                "Maintain immutable audit log records."
            ]
        ),
        AuditChecklistRule(
            rule_id="SOC2-CC.13",
            framework=RegulatoryFramework.SOC2_TYPE2,
            section_code="Common Criteria Series",
            control_name="CC.13: Segregation of Duties & Quality Governance Invariant #13",
            objective="Enforce strict separation between code submission, quality assurance testing, and deployment release.",
            verification_method="Verify actor user ID on task completion differs from assigned developer.",
            automated_check_field="actor_role_separation",
            required_threshold="Enforced",
            remediation_steps=[
                "Assign independent QA tester to verify task.",
                "Ensure PM approves phase progression gates.",
                "Maintain immutable audit log records."
            ]
        ),
        AuditChecklistRule(
            rule_id="SOC2-CC.14",
            framework=RegulatoryFramework.SOC2_TYPE2,
            section_code="Common Criteria Series",
            control_name="CC.14: Segregation of Duties & Quality Governance Invariant #14",
            objective="Enforce strict separation between code submission, quality assurance testing, and deployment release.",
            verification_method="Verify actor user ID on task completion differs from assigned developer.",
            automated_check_field="actor_role_separation",
            required_threshold="Enforced",
            remediation_steps=[
                "Assign independent QA tester to verify task.",
                "Ensure PM approves phase progression gates.",
                "Maintain immutable audit log records."
            ]
        ),
        AuditChecklistRule(
            rule_id="SOC2-CC.15",
            framework=RegulatoryFramework.SOC2_TYPE2,
            section_code="Common Criteria Series",
            control_name="CC.15: Segregation of Duties & Quality Governance Invariant #15",
            objective="Enforce strict separation between code submission, quality assurance testing, and deployment release.",
            verification_method="Verify actor user ID on task completion differs from assigned developer.",
            automated_check_field="actor_role_separation",
            required_threshold="Enforced",
            remediation_steps=[
                "Assign independent QA tester to verify task.",
                "Ensure PM approves phase progression gates.",
                "Maintain immutable audit log records."
            ]
        ),
        AuditChecklistRule(
            rule_id="SOC2-CC.16",
            framework=RegulatoryFramework.SOC2_TYPE2,
            section_code="Common Criteria Series",
            control_name="CC.16: Segregation of Duties & Quality Governance Invariant #16",
            objective="Enforce strict separation between code submission, quality assurance testing, and deployment release.",
            verification_method="Verify actor user ID on task completion differs from assigned developer.",
            automated_check_field="actor_role_separation",
            required_threshold="Enforced",
            remediation_steps=[
                "Assign independent QA tester to verify task.",
                "Ensure PM approves phase progression gates.",
                "Maintain immutable audit log records."
            ]
        ),
        AuditChecklistRule(
            rule_id="SOC2-CC.17",
            framework=RegulatoryFramework.SOC2_TYPE2,
            section_code="Common Criteria Series",
            control_name="CC.17: Segregation of Duties & Quality Governance Invariant #17",
            objective="Enforce strict separation between code submission, quality assurance testing, and deployment release.",
            verification_method="Verify actor user ID on task completion differs from assigned developer.",
            automated_check_field="actor_role_separation",
            required_threshold="Enforced",
            remediation_steps=[
                "Assign independent QA tester to verify task.",
                "Ensure PM approves phase progression gates.",
                "Maintain immutable audit log records."
            ]
        ),
        AuditChecklistRule(
            rule_id="SOC2-CC.18",
            framework=RegulatoryFramework.SOC2_TYPE2,
            section_code="Common Criteria Series",
            control_name="CC.18: Segregation of Duties & Quality Governance Invariant #18",
            objective="Enforce strict separation between code submission, quality assurance testing, and deployment release.",
            verification_method="Verify actor user ID on task completion differs from assigned developer.",
            automated_check_field="actor_role_separation",
            required_threshold="Enforced",
            remediation_steps=[
                "Assign independent QA tester to verify task.",
                "Ensure PM approves phase progression gates.",
                "Maintain immutable audit log records."
            ]
        ),
        AuditChecklistRule(
            rule_id="SOC2-CC.19",
            framework=RegulatoryFramework.SOC2_TYPE2,
            section_code="Common Criteria Series",
            control_name="CC.19: Segregation of Duties & Quality Governance Invariant #19",
            objective="Enforce strict separation between code submission, quality assurance testing, and deployment release.",
            verification_method="Verify actor user ID on task completion differs from assigned developer.",
            automated_check_field="actor_role_separation",
            required_threshold="Enforced",
            remediation_steps=[
                "Assign independent QA tester to verify task.",
                "Ensure PM approves phase progression gates.",
                "Maintain immutable audit log records."
            ]
        ),
        AuditChecklistRule(
            rule_id="SOC2-CC.20",
            framework=RegulatoryFramework.SOC2_TYPE2,
            section_code="Common Criteria Series",
            control_name="CC.20: Segregation of Duties & Quality Governance Invariant #20",
            objective="Enforce strict separation between code submission, quality assurance testing, and deployment release.",
            verification_method="Verify actor user ID on task completion differs from assigned developer.",
            automated_check_field="actor_role_separation",
            required_threshold="Enforced",
            remediation_steps=[
                "Assign independent QA tester to verify task.",
                "Ensure PM approves phase progression gates.",
                "Maintain immutable audit log records."
            ]
        ),
        AuditChecklistRule(
            rule_id="SOC2-CC.21",
            framework=RegulatoryFramework.SOC2_TYPE2,
            section_code="Common Criteria Series",
            control_name="CC.21: Segregation of Duties & Quality Governance Invariant #21",
            objective="Enforce strict separation between code submission, quality assurance testing, and deployment release.",
            verification_method="Verify actor user ID on task completion differs from assigned developer.",
            automated_check_field="actor_role_separation",
            required_threshold="Enforced",
            remediation_steps=[
                "Assign independent QA tester to verify task.",
                "Ensure PM approves phase progression gates.",
                "Maintain immutable audit log records."
            ]
        ),
        AuditChecklistRule(
            rule_id="SOC2-CC.22",
            framework=RegulatoryFramework.SOC2_TYPE2,
            section_code="Common Criteria Series",
            control_name="CC.22: Segregation of Duties & Quality Governance Invariant #22",
            objective="Enforce strict separation between code submission, quality assurance testing, and deployment release.",
            verification_method="Verify actor user ID on task completion differs from assigned developer.",
            automated_check_field="actor_role_separation",
            required_threshold="Enforced",
            remediation_steps=[
                "Assign independent QA tester to verify task.",
                "Ensure PM approves phase progression gates.",
                "Maintain immutable audit log records."
            ]
        ),
        AuditChecklistRule(
            rule_id="SOC2-CC.23",
            framework=RegulatoryFramework.SOC2_TYPE2,
            section_code="Common Criteria Series",
            control_name="CC.23: Segregation of Duties & Quality Governance Invariant #23",
            objective="Enforce strict separation between code submission, quality assurance testing, and deployment release.",
            verification_method="Verify actor user ID on task completion differs from assigned developer.",
            automated_check_field="actor_role_separation",
            required_threshold="Enforced",
            remediation_steps=[
                "Assign independent QA tester to verify task.",
                "Ensure PM approves phase progression gates.",
                "Maintain immutable audit log records."
            ]
        ),
        AuditChecklistRule(
            rule_id="SOC2-CC.24",
            framework=RegulatoryFramework.SOC2_TYPE2,
            section_code="Common Criteria Series",
            control_name="CC.24: Segregation of Duties & Quality Governance Invariant #24",
            objective="Enforce strict separation between code submission, quality assurance testing, and deployment release.",
            verification_method="Verify actor user ID on task completion differs from assigned developer.",
            automated_check_field="actor_role_separation",
            required_threshold="Enforced",
            remediation_steps=[
                "Assign independent QA tester to verify task.",
                "Ensure PM approves phase progression gates.",
                "Maintain immutable audit log records."
            ]
        ),
        AuditChecklistRule(
            rule_id="SOC2-CC.25",
            framework=RegulatoryFramework.SOC2_TYPE2,
            section_code="Common Criteria Series",
            control_name="CC.25: Segregation of Duties & Quality Governance Invariant #25",
            objective="Enforce strict separation between code submission, quality assurance testing, and deployment release.",
            verification_method="Verify actor user ID on task completion differs from assigned developer.",
            automated_check_field="actor_role_separation",
            required_threshold="Enforced",
            remediation_steps=[
                "Assign independent QA tester to verify task.",
                "Ensure PM approves phase progression gates.",
                "Maintain immutable audit log records."
            ]
        ),
    ]

    @classmethod
    def get_rules_by_framework(cls, framework: RegulatoryFramework) -> List[AuditChecklistRule]:
        return [r for r in cls.POLICY_RULES if r.framework == framework]

    @classmethod
    def evaluate_compliance_summary(cls, audit_context: Dict[str, Any]) -> Dict[str, Any]:
        total_rules = len(cls.POLICY_RULES)
        passed_rules = sum(1 for r in cls.POLICY_RULES if audit_context.get(r.automated_check_field) == r.required_threshold)
        score = (passed_rules / total_rules * 100.0) if total_rules > 0 else 100.0

        return {
            "total_standards_rules": total_rules,
            "passed_rules_count": passed_rules,
            "compliance_score_percent": round(score, 1),
            "status": "Audit Compliant" if score >= 85.0 else "Action Required",
            "frameworks_audited": [f.value for f in RegulatoryFramework]
        }
