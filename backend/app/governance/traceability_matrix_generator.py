from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

class TraceabilityRow(BaseModel):
    requirement_code: str
    requirement_title: str
    requirement_priority: str
    requirement_status: str
    task_codes: List[str]
    task_statuses: List[str]
    test_case_codes: List[str]
    test_results: List[str]
    defect_codes: List[str]
    defect_severities: List[str]
    coverage_status: str  # "Fully Covered", "Partially Covered", "Untested", "Orphaned"

class TraceabilityMatrixGenerator:
    """
    N-Tier End-to-End Traceability Matrix (RTM) Engine.
    Correlates Requirements -> Sprint Tasks -> Test Cases -> Reported Defects -> Releases.
    Identifies blindspots, orphan requirements, and untested code components.
    """

    @classmethod
    def generate_rtm(
        cls,
        requirements: List[Dict[str, Any]],
        tasks: List[Dict[str, Any]],
        test_cases: List[Dict[str, Any]],
        defects: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        rows: List[TraceabilityRow] = []

        untested_count = 0
        fully_covered_count = 0

        for r in requirements:
            rid = r.get("id")
            rcode = r.get("code", f"REQ-{rid}")
            rtitle = r.get("title", "")
            rpriority = r.get("priority", "Medium")
            rstatus = r.get("status", "Approved")

            # Match tasks linked to this requirement
            matched_tasks = [t for t in tasks if t.get("requirement_id") == rid]
            t_codes = [t.get("code", f"TASK-{t.get('id')}") for t in matched_tasks]
            t_statuses = [t.get("status", "To Do") for t in matched_tasks]

            # Match test cases linked to this requirement or project
            matched_tests = [tc for tc in test_cases if tc.get("requirement_id") == rid]
            tc_codes = [tc.get("code", f"TC-{tc.get('id')}") for tc in matched_tests]
            tc_results = [tc.get("last_execution_status", "Untested") for tc in matched_tests]

            # Match defects linked to matched tasks or requirement
            matched_task_ids = {t.get("id") for t in matched_tasks}
            matched_bugs = [b for b in defects if b.get("task_id") in matched_task_ids or b.get("requirement_id") == rid]
            b_codes = [b.get("code", f"BUG-{b.get('id')}") for b in matched_bugs]
            b_sevs = [b.get("severity", "Medium") for b in matched_bugs]

            # Determine coverage status
            has_tasks = len(matched_tasks) > 0
            has_tests = len(matched_tests) > 0
            all_tests_passed = has_tests and all(res == "Passed" for res in tc_results)

            if has_tasks and all_tests_passed:
                cov = "Fully Covered"
                fully_covered_count += 1
            elif has_tasks and has_tests:
                cov = "Partially Covered"
            elif has_tasks and not has_tests:
                cov = "Untested"
                untested_count += 1
            else:
                cov = "Orphaned"

            rows.append(TraceabilityRow(
                requirement_code=rcode,
                requirement_title=rtitle,
                requirement_priority=rpriority,
                requirement_status=rstatus,
                task_codes=t_codes,
                task_statuses=t_statuses,
                test_case_codes=tc_codes,
                test_results=tc_results,
                defect_codes=b_codes,
                defect_severities=b_sevs,
                coverage_status=cov
            ))

        total_reqs = len(requirements)
        cov_pct = (fully_covered_count / total_reqs * 100.0) if total_reqs > 0 else 0.0

        return {
            "total_requirements": total_reqs,
            "fully_covered_requirements": fully_covered_count,
            "untested_requirements": untested_count,
            "traceability_coverage_percent": round(cov_pct, 1),
            "matrix_rows": [r.model_dump() for r in rows]
        }
