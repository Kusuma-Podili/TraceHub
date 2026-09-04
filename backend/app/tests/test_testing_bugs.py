def get_token(client, email="tester@enterprise.com", password="tester123"):
    res = client.post("/api/auth/login", json={"username_or_email": email, "password": password})
    return res.json()["access_token"]

def test_test_case_execution_and_bug_lifecycle(client):
    qa_token = get_token(client, "tester@enterprise.com", "tester123")
    qa_headers = {"Authorization": f"Bearer {qa_token}"}

    # 1. Create Test Case
    tc_res = client.post("/api/testing/test-cases", json={
        "project_id": 1,
        "name": "Verify 60fps frame rate under ray tracing load",
        "test_steps": "1. Launch demo.\n2. Enable BVH ray tracing.\n3. Measure framerate.",
        "expected_result": "Maintain minimum 60 FPS.",
        "priority": "High"
    }, headers=qa_headers)
    assert tc_res.status_code == 201
    tc = tc_res.json()
    tc_id = tc["id"]

    # 2. Execute Test Case with status: Failed
    exec_res = client.post(f"/api/testing/test-cases/{tc_id}/execute", json={
        "status": "Failed",
        "actual_result": "Frame rate dropped to 22 FPS during BVH rebuild.",
        "execution_time_ms": 320
    }, headers=qa_headers)
    assert exec_res.status_code == 200
    assert exec_res.json()["test_case"]["status"] == "Failed"

    # 3. Report Bug linked to failed test
    bug_res = client.post("/api/bugs", json={
        "project_id": 1,
        "test_case_id": tc_id,
        "title": "Severe FPS drop during BVH tree rebuilding",
        "description": "BVH tree rebuild occurs on main render thread causing 40ms stalls.",
        "severity": "High",
        "priority": "High"
    }, headers=qa_headers)
    assert bug_res.status_code == 201
    bug = bug_res.json()
    assert bug["status"] == "Open"
    bug_id = bug["id"]

    # 4. Developer starts fix and marks as fixed
    dev_token = get_token(client, "dev@enterprise.com", "developer123")
    dev_headers = {"Authorization": f"Bearer {dev_token}"}

    start_fix_res = client.post(f"/api/bugs/{bug_id}/start-fix", headers=dev_headers)
    assert start_fix_res.status_code == 200
    assert start_fix_res.json()["bug"]["status"] == "In Progress"

    fix_res = client.post(f"/api/bugs/{bug_id}/mark-fixed", json={
        "resolution_notes": "Offloaded BVH builder to worker compute thread pool."
    }, headers=dev_headers)
    assert fix_res.status_code == 200
    assert fix_res.json()["bug"]["status"] == "Ready for Retesting"

    # Developer cannot close bug directly
    dev_close_res = client.put(f"/api/bugs/{bug_id}", json={
        "status": "Closed"
    }, headers=dev_headers)
    assert dev_close_res.status_code == 400

    # 5. Tester retests bug and closes it
    retest_res = client.post(f"/api/bugs/{bug_id}/retest", json={
        "passed": True,
        "retest_notes": "Verified BVH now builds on worker thread. 64 FPS stable."
    }, headers=qa_headers)
    assert retest_res.status_code == 200
    assert retest_res.json()["bug"]["status"] == "Closed"

def test_bug_retest_failure_reopens_defect(client):
    qa_token = get_token(client, "tester@enterprise.com", "tester123")
    qa_headers = {"Authorization": f"Bearer {qa_token}"}

    # Bug 2 in seed data is currently status: "Ready for Retesting"
    retest_res = client.post("/api/bugs/2/retest", json={
        "passed": False,
        "retest_notes": "Still reproducing on driver 545.29."
    }, headers=qa_headers)
    assert retest_res.status_code == 200
    assert retest_res.json()["bug"]["status"] == "Reopened"
