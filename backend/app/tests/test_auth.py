def test_user_registration_success(client):
    payload = {
        "username": "newdev",
        "email": "newdev@enterprise.com",
        "full_name": "New Developer",
        "role": "Developer",
        "password": "securepassword123"
    }
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["username"] == "newdev"
    assert data["user"]["role"] == "Developer"

def test_user_registration_duplicate_email(client):
    payload = {
        "username": "dupuser",
        "email": "dev@enterprise.com",  # Already in seed data
        "full_name": "Duplicate User",
        "role": "Developer",
        "password": "password123"
    }
    response = client.post("/api/auth/register", json=payload)
    assert response.status_code == 400
    assert "already registered" in response.json()["detail"].lower()

def test_user_login_success(client):
    response = client.post("/api/auth/login", json={
        "username_or_email": "pm@enterprise.com",
        "password": "manager123"
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["role"] == "Project Manager"

def test_user_login_invalid_password(client):
    response = client.post("/api/auth/login", json={
        "username_or_email": "pm@enterprise.com",
        "password": "wrongpassword"
    })
    assert response.status_code == 401

def test_forgot_password_reset(client):
    response = client.post("/api/auth/forgot-password", json={
        "email": "dev@enterprise.com",
        "new_password": "brandnewpassword999"
    })
    assert response.status_code == 200

    # Try login with new password
    login_res = client.post("/api/auth/login", json={
        "username_or_email": "dev@enterprise.com",
        "password": "brandnewpassword999"
    })
    assert login_res.status_code == 200
