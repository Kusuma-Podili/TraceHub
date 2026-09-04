from typing import List, Dict, Optional, Any
from pydantic import BaseModel

class QualityGateEvaluation(BaseModel):
    project_id: int
    phase_name: str
    passed: bool
    score_percent: float
    gate_criteria_met: List[str]
    gate_criteria_unmet: List[str]
    blocker_defects_count: int
    readiness_status: str

class QualityGateTelemetry:
    """
    Quality Gate Regression and Phase Advancement Validation Engine.
    Computes empirical compliance against SDLC gate rules.
    """

    @staticmethod
    def evaluate_gate(
        project_id: int,
        phase_name: str,
        requirements_approved_pct: float,
        tasks_completed_pct: float,
        tests_passed_pct: float,
        critical_bugs_open: int,
        releases_count: int = 0
    ) -> QualityGateEvaluation:
        met = []
        unmet = []

        if phase_name == "Requirement Analysis":
            if requirements_approved_pct >= 80.0:
                met.append("Approved requirements >= 80%")
            else:
                unmet.append(f"Approved requirements at {requirements_approved_pct:.1f}% (required >= 80%)")

        elif phase_name == "Development":
            if tasks_completed_pct >= 90.0:
                met.append("Development tasks completed >= 90%")
            else:
                unmet.append(f"Development tasks completed at {tasks_completed_pct:.1f}% (required >= 90%)")

        elif phase_name == "Testing":
            if tests_passed_pct >= 95.0:
                met.append("Test cases executed and passed >= 95%")
            else:
                unmet.append(f"Test cases passed at {tests_passed_pct:.1f}% (required >= 95%)")

            if critical_bugs_open == 0:
                met.append("Zero open Critical or High severity defects")
            else:
                unmet.append(f"{critical_bugs_open} Critical/High defects remaining unresolved")

        elif phase_name == "Deployment":
            if critical_bugs_open == 0:
                met.append("Zero blocking production defects")
            else:
                unmet.append(f"{critical_bugs_open} blocking defects")
            if releases_count > 0:
                met.append("Deployment release candidate tagged")
            else:
                unmet.append("Missing deployment release candidate")

        total_rules = len(met) + len(unmet)
        score = (len(met) / total_rules * 100.0) if total_rules > 0 else 100.0
        passed = (len(unmet) == 0)

        readiness = "Gate Passed - Ready to Advance" if passed else "Gate Blocked - Action Required"

        return QualityGateEvaluation(
            project_id=project_id,
            phase_name=phase_name,
            passed=passed,
            score_percent=round(score, 1),
            gate_criteria_met=met,
            gate_criteria_unmet=unmet,
            blocker_defects_count=critical_bugs_open,
            readiness_status=readiness
        )
