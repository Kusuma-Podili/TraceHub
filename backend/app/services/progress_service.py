from sqlalchemy.orm import Session
from sqlalchemy import func
from backend.app.models.project import Project, SDLCPhase, ProjectMember
from backend.app.models.requirement import Requirement
from backend.app.models.task import Task
from backend.app.models.test_case import TestCase
from backend.app.models.bug import Bug
from backend.app.models.deployment import Deployment
from backend.app.models.maintenance import MaintenanceRecord

def recalculate_project_progress(db: Session, project_id: int) -> float:
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        return 0.0

    # 1. Requirements completion
    reqs = db.query(Requirement).filter(Requirement.project_id == project_id).all()
    req_pct = 0.0
    if reqs:
        completed_reqs = sum(1 for r in reqs if r.status in ["Completed", "Approved"])
        req_pct = (completed_reqs / len(reqs)) * 100.0

    # 2. Tasks completion
    tasks = db.query(Task).filter(Task.project_id == project_id).all()
    task_pct = 0.0
    if tasks:
        completed_tasks = sum(1 for t in tasks if t.status in ["Completed", "Passed"])
        testing_tasks = sum(1 for t in tasks if t.status in ["Testing", "Ready for Testing"])
        in_prog_tasks = sum(1 for t in tasks if t.status == "In Progress")
        task_score = (completed_tasks * 1.0) + (testing_tasks * 0.8) + (in_prog_tasks * 0.4)
        task_pct = (task_score / len(tasks)) * 100.0

    # 3. Test Cases pass rate
    tests = db.query(TestCase).filter(TestCase.project_id == project_id).all()
    test_pct = 0.0
    if tests:
        passed_tests = sum(1 for tc in tests if tc.status == "Passed")
        test_pct = (passed_tests / len(tests)) * 100.0

    # 4. SDLC phase index weight
    phases = db.query(SDLCPhase).filter(SDLCPhase.project_id == project_id).order_by(SDLCPhase.order_index).all()
    phase_pct = 0.0
    if phases:
        completed_phases = sum(1 for p in phases if p.status == "Completed")
        in_prog_phases = sum(1 for p in phases if p.status == "In Progress")
        phase_pct = ((completed_phases + (in_prog_phases * 0.5)) / len(phases)) * 100.0

    # Blended overall progress
    weights = [0.25, 0.35, 0.20, 0.20]
    blended = (req_pct * weights[0]) + (task_pct * weights[1]) + (test_pct * weights[2]) + (phase_pct * weights[3])
    blended = min(100.0, max(0.0, round(blended, 1)))

    project.progress_percent = blended
    db.commit()
    return blended

def get_project_phase_readiness(db: Session, project_id: int):
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        return []

    reqs = db.query(Requirement).filter(Requirement.project_id == project_id).all()
    total_reqs = len(reqs)
    approved_reqs = sum(1 for r in reqs if r.status in ["Approved", "Completed"])

    members = db.query(ProjectMember).filter(ProjectMember.project_id == project_id).all()
    team_count = len(members)

    tasks = db.query(Task).filter(Task.project_id == project_id).all()
    total_tasks = len(tasks)
    completed_tasks = sum(1 for t in tasks if t.status in ["Completed", "Passed"])
    ready_testing_tasks = sum(1 for t in tasks if t.status == "Ready for Testing")
    in_progress_tasks = sum(1 for t in tasks if t.status == "In Progress")

    tests = db.query(TestCase).filter(TestCase.project_id == project_id).all()
    total_tests = len(tests)
    passed_tests = sum(1 for tc in tests if tc.status == "Passed")
    failed_tests = sum(1 for tc in tests if tc.status == "Failed")

    bugs = db.query(Bug).filter(Bug.project_id == project_id).all()
    critical_bugs = sum(1 for b in bugs if b.severity in ["Critical", "High"] and b.status in ["Open", "Assigned", "In Progress", "Reopened"])

    deps = db.query(Deployment).filter(Deployment.project_id == project_id).all()
    successful_deps = sum(1 for d in deps if d.status == "Successful")

    maints = db.query(MaintenanceRecord).filter(MaintenanceRecord.project_id == project_id).all()
    resolved_maint = sum(1 for m in maints if m.status in ["Resolved", "Closed"])

    # Update each phase record based on actual deliverables
    phases_data = []
    has_design = bool(project.architecture_notes or project.ui_ux_notes or project.tech_design_notes)

    phase_defs = [
        {
            "name": "Requirement Analysis",
            "order": 0,
            "pct": round((approved_reqs / total_reqs * 100), 1) if total_reqs else 0.0,
            "status": "Completed" if (total_reqs > 0 and approved_reqs == total_reqs) else ("In Progress" if total_reqs > 0 else "Not Started"),
            "completed_work": f"{approved_reqs} of {total_reqs} requirements approved",
            "pending_work": f"{total_reqs - approved_reqs} requirements pending approval" if total_reqs > approved_reqs else "All requirements approved"
        },
        {
            "name": "Planning",
            "order": 1,
            "pct": 100.0 if team_count >= 2 else (50.0 if team_count == 1 else 0.0),
            "status": "Completed" if team_count >= 2 else "In Progress",
            "completed_work": f"{team_count} active contributors assigned",
            "pending_work": "Assign at least one developer and tester" if team_count < 2 else "Scope planning ready"
        },
        {
            "name": "Design",
            "order": 2,
            "pct": 100.0 if has_design else 30.0,
            "status": "Completed" if has_design else "In Progress",
            "completed_work": "Architecture & tech specifications documented" if has_design else "Initial design draft",
            "pending_work": "Complete system architecture & tech specs" if not has_design else "Design approved"
        },
        {
            "name": "Development",
            "order": 3,
            "pct": round((completed_tasks / total_tasks * 100), 1) if total_tasks else 0.0,
            "status": "Completed" if (total_tasks > 0 and completed_tasks == total_tasks) else ("In Progress" if total_tasks > 0 else "Not Started"),
            "completed_work": f"{completed_tasks} of {total_tasks} development tasks finished",
            "pending_work": f"{total_tasks - completed_tasks} tasks pending ({ready_testing_tasks} ready for QA)"
        },
        {
            "name": "Testing",
            "order": 4,
            "pct": round((passed_tests / total_tests * 100), 1) if total_tests else 0.0,
            "status": "Completed" if (total_tests > 0 and passed_tests == total_tests and critical_bugs == 0) else ("In Progress" if total_tests > 0 else "Not Started"),
            "completed_work": f"{passed_tests} of {total_tests} test cases passed",
            "pending_work": f"{critical_bugs} critical bugs open, {failed_tests} failed tests" if (critical_bugs or failed_tests) else "Zero open critical defects"
        },
        {
            "name": "Deployment",
            "order": 5,
            "pct": 100.0 if successful_deps > 0 else 0.0,
            "status": "Completed" if successful_deps > 0 else "Not Started",
            "completed_work": f"{successful_deps} releases deployed successfully",
            "pending_work": "Production release pending" if not successful_deps else "Production release live"
        },
        {
            "name": "Maintenance",
            "order": 6,
            "pct": 100.0 if resolved_maint > 0 else (50.0 if len(maints) > 0 else 0.0),
            "status": "In Progress" if successful_deps > 0 else "Not Started",
            "completed_work": f"{resolved_maint} maintenance tickets resolved",
            "pending_work": f"{len(maints) - resolved_maint} active operational tickets"
        }
    ]

    # Save to SDLCPhase table for synchronization
    for pdef in phase_defs:
        phase_record = db.query(SDLCPhase).filter(
            SDLCPhase.project_id == project_id,
            SDLCPhase.phase_name == pdef["name"]
        ).first()
        if phase_record:
            phase_record.completion_percent = pdef["pct"]
            phase_record.status = pdef["status"]
            db.commit()

    return phase_defs

def get_pm_dashboard_metrics(db: Session):
    projects = db.query(Project).all()
    total_projects = len(projects)
    active_projects = sum(1 for p in projects if p.status == "Active")
    completed_projects = sum(1 for p in projects if p.status == "Completed")

    total_reqs = db.query(Requirement).count()
    pending_tasks = db.query(Task).filter(Task.status.in_(["To Do", "In Progress", "Ready for Testing", "Testing"])).count()
    tasks_in_dev = db.query(Task).filter(Task.status == "In Progress").count()
    tasks_ready_for_testing = db.query(Task).filter(Task.status == "Ready for Testing").count()

    open_bugs = db.query(Bug).filter(Bug.status.in_(["Open", "Assigned", "In Progress", "Reopened"])).count()
    closed_bugs = db.query(Bug).filter(Bug.status == "Closed").count()
    critical_bugs = db.query(Bug).filter(
        Bug.severity.in_(["Critical", "High"]),
        Bug.status.in_(["Open", "Assigned", "In Progress", "Reopened"])
    ).count()

    total_tests = db.query(TestCase).count()
    passed_tests = db.query(TestCase).filter(TestCase.status == "Passed").count()
    testing_progress_pct = round((passed_tests / total_tests) * 100.0, 1) if total_tests > 0 else 0.0

    overall_project_progress = (
        round(sum(p.progress_percent for p in projects) / total_projects, 1)
        if total_projects > 0 else 0.0
    )

    # Detailed per-project breakdown matrix
    detailed_projects = []
    for p in projects:
        recalculate_project_progress(db, p.id)
        get_project_phase_readiness(db, p.id)

        # Reqs progress
        p_reqs = db.query(Requirement).filter(Requirement.project_id == p.id).all()
        p_reqs_total = len(p_reqs)
        p_reqs_done = sum(1 for r in p_reqs if r.status in ["Approved", "Completed"])
        reqs_prog = round((p_reqs_done / p_reqs_total * 100), 1) if p_reqs_total else 0.0

        # Dev progress
        p_tasks = db.query(Task).filter(Task.project_id == p.id).all()
        p_tasks_total = len(p_tasks)
        p_tasks_done = sum(1 for t in p_tasks if t.status in ["Completed", "Passed"])
        dev_prog = round((p_tasks_done / p_tasks_total * 100), 1) if p_tasks_total else 0.0

        # Testing progress
        p_tests = db.query(TestCase).filter(TestCase.project_id == p.id).all()
        p_tests_total = len(p_tests)
        p_tests_passed = sum(1 for tc in p_tests if tc.status == "Passed")
        test_prog = round((p_tests_passed / p_tests_total * 100), 1) if p_tests_total else 0.0

        # Bugs
        p_bugs = db.query(Bug).filter(Bug.project_id == p.id).all()
        p_bugs_total = len(p_bugs)
        p_bugs_crit = sum(1 for b in p_bugs if b.severity in ["Critical", "High"] and b.status in ["Open", "Assigned", "In Progress", "Reopened"])

        # Team
        mgr_name = p.manager.full_name if p.manager else "Unassigned"
        team_names = [m.user.full_name for m in p.members if m.user] if p.members else [mgr_name]

        detailed_projects.append({
            "id": p.id,
            "code": p.code,
            "name": p.name,
            "manager_name": mgr_name,
            "current_phase": p.current_phase,
            "requirements_progress": reqs_prog,
            "requirements_summary": f"{p_reqs_done}/{p_reqs_total}",
            "development_progress": dev_prog,
            "development_summary": f"{p_tasks_done}/{p_tasks_total}",
            "testing_progress": test_prog,
            "testing_summary": f"{p_tests_passed}/{p_tests_total}",
            "bug_count": p_bugs_total,
            "critical_bug_count": p_bugs_crit,
            "overall_completion_percentage": p.progress_percent,
            "team_members": team_names,
            "team_count": len(team_names),
            "status": p.status,
            "priority": p.priority
        })

    return {
        "total_projects": total_projects,
        "active_projects": active_projects,
        "completed_projects": completed_projects,
        "total_requirements": total_reqs,
        "pending_tasks": pending_tasks,
        "tasks_in_development": tasks_in_dev,
        "tasks_ready_for_testing": tasks_ready_for_testing,
        "open_bugs": open_bugs,
        "closed_bugs": closed_bugs,
        "critical_bugs": critical_bugs,
        "testing_progress": testing_progress_pct,
        "overall_project_progress": overall_project_progress,
        "projects_breakdown": detailed_projects
    }
