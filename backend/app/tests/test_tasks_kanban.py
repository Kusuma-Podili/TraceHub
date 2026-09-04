def get_token(client, email="pm@enterprise.com", password="manager123"):
    res = client.post("/api/auth/login", json={"username_or_email": email, "password": password})
    return res.json()["access_token"]

def test_full_sdlc_task_workflow(client):
    pm_token = get_token(client, "pm@enterprise.com", "manager123")
    pm_headers = {"Authorization": f"Bearer {pm_token}"}
    dev_token = get_token(client, "dev@enterprise.com", "developer123")
    dev_headers = {"Authorization": f"Bearer {dev_token}"}
    qa_token = get_token(client, "tester@enterprise.com", "tester123")
    qa_headers = {"Authorization": f"Bearer {qa_token}"}

    # 1. PM creates development task
    res = client.post("/api/tasks", json={
        "project_id": 1,
        "title": "Build WebGL Canvas Render Surface",
        "description": "Initialize WebGL2 context with 4x MSAA.",
        "phase_name": "Development",
        "priority": "High",
        "status": "To Do"
    }, headers=pm_headers)
    assert res.status_code == 201
    task = res.json()
    assert task["status"] == "To Do"
    task_id = task["id"]

    # 2. Developer starts development
    start_dev_res = client.post(f"/api/tasks/{task_id}/start-development", headers=dev_headers)
    assert start_dev_res.status_code == 200
    assert start_dev_res.json()["task"]["status"] == "In Progress"

    # 3. Developer updates progress
    prog_res = client.patch(f"/api/tasks/{task_id}/progress", json={
        "progress_percent": 80.0
    }, headers=dev_headers)
    assert prog_res.status_code == 200
    assert prog_res.json()["task"]["progress_percent"] == 80.0

    # 4. Developer submits task for testing
    sub_res = client.post(f"/api/tasks/{task_id}/submit-for-testing", headers=dev_headers)
    assert sub_res.status_code == 200
    assert sub_res.json()["task"]["status"] == "Ready for Testing"

    # 5. Developer CANNOT directly mark task Completed
    direct_done_res = client.patch(f"/api/tasks/{task_id}/status", json={
        "status": "Completed"
    }, headers=dev_headers)
    assert direct_done_res.status_code == 400
    assert "Workflow validation error" in direct_done_res.json()["detail"]

    # 6. Tester starts testing
    start_test_res = client.post(f"/api/tasks/{task_id}/start-testing", headers=qa_headers)
    assert start_test_res.status_code == 200
    assert start_test_res.json()["task"]["status"] == "Testing"
    assert start_test_res.json()["task"]["testing_status"] == "In Testing"

    # 7. Tester passes testing -> Task completes!
    pass_res = client.post(f"/api/tasks/{task_id}/pass-testing", headers=qa_headers)
    assert pass_res.status_code == 200
    assert pass_res.json()["task"]["status"] == "Completed"
    assert pass_res.json()["task"]["testing_status"] == "Passed"
    assert pass_res.json()["task"]["progress_percent"] == 100.0

def test_qa_fail_testing_generates_defect_and_returns_task_to_dev(client):
    pm_token = get_token(client, "pm@enterprise.com", "manager123")
    pm_headers = {"Authorization": f"Bearer {pm_token}"}
    dev_token = get_token(client, "dev@enterprise.com", "developer123")
    dev_headers = {"Authorization": f"Bearer {dev_token}"}
    qa_token = get_token(client, "tester@enterprise.com", "tester123")
    qa_headers = {"Authorization": f"Bearer {qa_token}"}

    # 1. Create task and submit for testing
    res = client.post("/api/tasks", json={
        "project_id": 1,
        "title": "Implement WebRTC Audio Buffer",
        "phase_name": "Development",
        "priority": "High"
    }, headers=pm_headers)
    task_id = res.json()["id"]

    client.post(f"/api/tasks/{task_id}/start-development", headers=dev_headers)
    client.patch(f"/api/tasks/{task_id}/progress", json={"progress_percent": 90.0}, headers=dev_headers)
    client.post(f"/api/tasks/{task_id}/submit-for-testing", headers=dev_headers)
    client.post(f"/api/tasks/{task_id}/start-testing", headers=qa_headers)

    # 2. Tester fails testing
    fail_res = client.post(f"/api/tasks/{task_id}/fail-testing", json={
        "bug_title": "Buffer underrun under packet loss",
        "bug_description": "Observed 150ms audio glitch when packet loss simulated at 5%.",
        "bug_severity": "High",
        "bug_priority": "High"
    }, headers=qa_headers)
    assert fail_res.status_code == 200
    data = fail_res.json()
    assert data["task"]["status"] == "In Progress"
    assert data["task"]["testing_status"] == "Failed"
    assert data["bug"]["title"] == "Buffer underrun under packet loss"
    assert data["bug"]["task_id"] == task_id
    assert data["bug"]["status"] == "Open"

