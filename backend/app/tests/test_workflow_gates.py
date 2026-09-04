def get_token(client, email="pm@enterprise.com", password="manager123"):
    res = client.post("/api/auth/login", json={"username_or_email": email, "password": password})
    return res.json()["access_token"]

def test_project_completion_blocked_by_critical_bugs(client):
    token = get_token(client, "pm@enterprise.com", "manager123")
    headers = {"Authorization": f"Bearer {token}"}

    # Project 1 has open High/Critical bug (BUG-AETH-401)
    res = client.put("/api/projects/1", json={
        "status": "Completed"
    }, headers=headers)
    assert res.status_code == 400
    assert "Cannot mark project as Completed" in res.json()["detail"]

def test_deployment_tracking_and_maintenance(client):
    token = get_token(client, "pm@enterprise.com", "manager123")
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Record Staging Deployment
    dep_res = client.post("/api/deployments", json={
        "project_id": 1,
        "version": "v1.0.0-gold",
        "environment": "Production",
        "status": "Successful",
        "release_notes": "Official gold master release."
    }, headers=headers)
    assert dep_res.status_code == 201
    dep_id = dep_res.json()["id"]

    # 2. Log Post-Deployment Maintenance Ticket
    maint_res = client.post("/api/maintenance", json={
        "project_id": 1,
        "title": "Monitor cloud game server CPU spikes under heavy concurrency",
        "type": "Issue",
        "priority": "High",
        "status": "Open",
        "resolution_details": "Configuring Prometheus alerts."
    }, headers=headers)
    assert maint_res.status_code == 201
    assert maint_res.json()["type"] == "Issue"

def test_reports_custom_filter(client):
    token = get_token(client, "pm@enterprise.com", "manager123")
    headers = {"Authorization": f"Bearer {token}"}

    res = client.get("/api/reports/custom?report_type=bugs&priority=High", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert data["report_type"] == "bugs"
    assert "data" in data

def test_notifications_lifecycle(client):
    token = get_token(client, "dev@enterprise.com", "developer123")
    headers = {"Authorization": f"Bearer {token}"}

    # Check unread count
    count_res = client.get("/api/notifications/unread-count", headers=headers)
    assert count_res.status_code == 200
    assert "unread_count" in count_res.json()

    # Mark all read
    read_all = client.post("/api/notifications/read-all", headers=headers)
    assert read_all.status_code == 200

    # Unread count should now be 0
    count_after = client.get("/api/notifications/unread-count", headers=headers)
    assert count_after.json()["unread_count"] == 0

def test_end_to_end_pm_dev_qa_lifecycle(client):
    pm_token = get_token(client, "pm@enterprise.com", "manager123")
    pm_headers = {"Authorization": f"Bearer {pm_token}"}
    dev_token = get_token(client, "dev@enterprise.com", "developer123")
    dev_headers = {"Authorization": f"Bearer {dev_token}"}
    qa_token = get_token(client, "tester@enterprise.com", "tester123")
    qa_headers = {"Authorization": f"Bearer {qa_token}"}

    # Step 1: PM creates project
    p_res = client.post("/api/projects", json={
        "name": "Orbital Space Simulator",
        "code": "ORB-01",
        "description": "Next-gen physics simulator",
        "priority": "High"
    }, headers=pm_headers)
    assert p_res.status_code == 201
    proj_id = p_res.json()["id"]

    # Step 2: PM creates requirement
    req_res = client.post("/api/requirements", json={
        "project_id": proj_id,
        "title": "Orbital Trajectory Calculation",
        "description": "Implement Runge-Kutta 4th order integrator",
        "priority": "High"
    }, headers=pm_headers)
    assert req_res.status_code == 201
    req_id = req_res.json()["id"]

    # PM approves requirement
    app_res = client.put(f"/api/requirements/{req_id}", json={
        "status": "Approved"
    }, headers=pm_headers)
    assert app_res.status_code == 200

    # Step 3: PM creates task assigned to developer
    t_res = client.post("/api/tasks", json={
        "project_id": proj_id,
        "requirement_id": req_id,
        "title": "Implement RK4 Integrator Kernel",
        "phase_name": "Development",
        "priority": "High",
        "assigned_to_id": 2 # dev_user id
    }, headers=pm_headers)
    assert t_res.status_code == 201
    task_id = t_res.json()["id"]

    # Step 4: Developer starts development and works on task
    client.post(f"/api/tasks/{task_id}/start-development", headers=dev_headers)
    client.patch(f"/api/tasks/{task_id}/progress", json={"progress_percent": 100.0}, headers=dev_headers)

    # Developer submits task for testing
    sub_res = client.post(f"/api/tasks/{task_id}/submit-for-testing", headers=dev_headers)
    assert sub_res.status_code == 200
    assert sub_res.json()["task"]["status"] == "Ready for Testing"

    # Step 5: Tester starts testing and fails it (generates bug)
    client.post(f"/api/tasks/{task_id}/start-testing", headers=qa_headers)
    fail_res = client.post(f"/api/tasks/{task_id}/fail-testing", json={
        "bug_title": "Numerical drift at step size > 0.05s",
        "bug_description": "Integration errors accumulate after 100 orbital steps.",
        "bug_severity": "High",
        "bug_priority": "High"
    }, headers=qa_headers)
    assert fail_res.status_code == 200
    bug_id = fail_res.json()["bug"]["id"]

    # Step 6: Developer sees bug, starts fix, and marks as fixed
    client.post(f"/api/bugs/{bug_id}/start-fix", headers=dev_headers)
    fix_res = client.post(f"/api/bugs/{bug_id}/mark-fixed", json={
        "resolution_notes": "Added adaptive timestep controller to bound floating point error."
    }, headers=dev_headers)
    assert fix_res.status_code == 200
    assert fix_res.json()["bug"]["status"] == "Ready for Retesting"

    # Step 7: Tester retests bug -> Pass & Closes bug
    retest_res = client.post(f"/api/bugs/{bug_id}/retest", json={
        "passed": True,
        "retest_notes": "Verified zero numerical drift across 1,000 orbital revolutions."
    }, headers=qa_headers)
    assert retest_res.status_code == 200
    assert retest_res.json()["bug"]["status"] == "Closed"

    # Step 8: Developer resubmits task for testing and QA passes testing -> Task completed!
    resub_res = client.post(f"/api/tasks/{task_id}/submit-for-testing", headers=dev_headers)
    assert resub_res.status_code == 200
    assert resub_res.json()["task"]["status"] == "Ready for Testing"

    client.post(f"/api/tasks/{task_id}/start-testing", headers=qa_headers)
    pass_res = client.post(f"/api/tasks/{task_id}/pass-testing", headers=qa_headers)
    assert pass_res.status_code == 200
    assert pass_res.json()["task"]["status"] == "Completed"

    # Step 9: PM Dashboard reflects live progress
    pm_dash = client.get("/api/reports/pm-dashboard", headers=pm_headers)
    assert pm_dash.status_code == 200
    dash_data = pm_dash.json()
    assert dash_data["total_projects"] >= 2
    assert dash_data["closed_bugs"] >= 1

