import mongomock
import pytest

from app import create_app


@pytest.fixture
def client():
    db = mongomock.MongoClient().db
    app = create_app(db=db)
    app.testing = True
    with app.test_client() as test_client:
        yield test_client


def test_register_creates_user_and_returns_token(client):
    res = client.post(
        "/api/auth/register", json={"email": "a@example.com", "password": "secret123"}
    )
    assert res.status_code == 201
    data = res.get_json()
    assert "token" in data
    assert data["user"]["email"] == "a@example.com"


def test_register_duplicate_email_rejected(client):
    client.post("/api/auth/register", json={"email": "a@example.com", "password": "secret123"})
    res = client.post(
        "/api/auth/register", json={"email": "a@example.com", "password": "other123"}
    )
    assert res.status_code == 409


def test_register_missing_password_rejected(client):
    res = client.post("/api/auth/register", json={"email": "a@example.com"})
    assert res.status_code == 400


def test_register_short_password_rejected(client):
    res = client.post("/api/auth/register", json={"email": "a@example.com", "password": "123"})
    assert res.status_code == 400


def test_login_with_correct_credentials(client):
    client.post("/api/auth/register", json={"email": "a@example.com", "password": "secret123"})
    res = client.post("/api/auth/login", json={"email": "a@example.com", "password": "secret123"})
    assert res.status_code == 200
    assert "token" in res.get_json()


def test_login_with_wrong_password_rejected(client):
    client.post("/api/auth/register", json={"email": "a@example.com", "password": "secret123"})
    res = client.post("/api/auth/login", json={"email": "a@example.com", "password": "wrong"})
    assert res.status_code == 401


def test_login_with_unknown_email_rejected(client):
    res = client.post("/api/auth/login", json={"email": "nobody@example.com", "password": "x"})
    assert res.status_code == 401


def test_me_requires_token(client):
    res = client.get("/api/auth/me")
    assert res.status_code == 401


def test_me_returns_user_with_valid_token(client):
    register = client.post(
        "/api/auth/register", json={"email": "a@example.com", "password": "secret123"}
    ).get_json()
    res = client.get(
        "/api/auth/me", headers={"Authorization": f"Bearer {register['token']}"}
    )
    assert res.status_code == 200
    assert res.get_json()["email"] == "a@example.com"
