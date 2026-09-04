def get_token(client, email="pm@enterprise.com", password="manager123"):
    res = client.post("/api/auth/login", json={"username_or_email": email, "password": password})
    return res.json()["access_token"]

def test_project_creation_and_phase_generation(client):
    token = get_token(client, "pm@enterprise.com", "manager123")
    headers = {"Authorization": f"Bearer {token}"}

    payload = {
        "name": "Cloud MMO Server Mesh",
        "code": "MMO-01",
        "description": "Distributed spatial simulation architecture for high concurrency.",
        "priority": "Critical"
    }
    response = client.post("/api/projects", json=payload, headers=headers)
    assert response.status_code == 201
    project = response.json()
    assert project["code"] == "MMO-01"
    assert project["current_phase"] == "Requirement Analysis"

    # Verify project details has all 7 SDLC phases generated
    detail_res = client.get(f"/api/projects/{project['id']}", headers=headers)
    assert detail_res.status_code == 200
    details = detail_res.json()
    assert len(details["phases"]) == 7
    phase_names = [ph["phase_name"] for ph in details["phases"]]
    assert "Requirement Analysis" in phase_names
    assert "Deployment" in phase_names
    assert "Maintenance" in phase_names

def test_project_sdlc_advance_gate_requirement_block(client):
    token = get_token(client, "pm@enterprise.com", "manager123")
    headers = {"Authorization": f"Bearer {token}"}

    # Create empty project
    proj_res = client.post("/api/projects", json={
        "name": "Empty Project",
        "code": "EMPTY-01",
        "priority": "Low"
    }, headers=headers)
    proj_id = proj_res.json()["id"]

    # Try advancing without any requirements
    adv_res = client.post(f"/api/projects/{proj_id}/phases/advance", json={
        "target_phase": "Planning"
    }, headers=headers)
    assert adv_res.status_code == 400
    assert "Gate Blocked" in adv_res.json()["detail"]

def test_project_sdlc_advance_success_with_requirements(client):
    token = get_token(client, "pm@enterprise.com", "manager123")
    headers = {"Authorization": f"Bearer {token}"}

    # Create project
    proj_res = client.post("/api/projects", json={
        "name": "Game Shading Pipeline",
        "code": "SHD-01",
        "priority": "High"
    }, headers=headers)
    proj_id = proj_res.json()["id"]

    # Add approved requirement
    req_res = client.post("/api/requirements", json={
        "project_id": proj_id,
        "title": "SPIR-V Shader Precompilation",
        "priority": "High",
        "status": "Approved"
    }, headers=headers)
    assert req_res.status_code == 201

    # Advance to Planning
    adv_res = client.post(f"/api/projects/{proj_id}/phases/advance", json={
        "target_phase": "Planning"
    }, headers=headers)
    assert adv_res.status_code == 200
    assert adv_res.json()["project"]["current_phase"] == "Planning"
