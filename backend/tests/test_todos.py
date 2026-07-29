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


def auth_headers(client, email="user@example.com", password="secret123"):
    client.post("/api/auth/register", json={"email": email, "password": password})
    login = client.post("/api/auth/login", json={"email": email, "password": password})
    token = login.get_json()["token"]
    return {"Authorization": f"Bearer {token}"}


def test_get_todos_requires_auth(client):
    res = client.get("/api/todos")
    assert res.status_code == 401


def test_get_todos_returns_empty_list_initially(client):
    headers = auth_headers(client)
    res = client.get("/api/todos", headers=headers)
    assert res.status_code == 200
    assert res.get_json() == []


def test_create_todo(client):
    headers = auth_headers(client)
    res = client.post("/api/todos", json={"title": "Learn testing"}, headers=headers)
    assert res.status_code == 201
    data = res.get_json()
    assert data["title"] == "Learn testing"
    assert data["completed"] is False


def test_create_todo_missing_title_returns_400(client):
    headers = auth_headers(client)
    res = client.post("/api/todos", json={}, headers=headers)
    assert res.status_code == 400


def test_get_todo_by_id(client):
    headers = auth_headers(client)
    created = client.post("/api/todos", json={"title": "Test todo"}, headers=headers).get_json()
    res = client.get(f"/api/todos/{created['_id']}", headers=headers)
    assert res.status_code == 200
    assert res.get_json()["title"] == "Test todo"


def test_get_todo_missing_returns_404(client):
    headers = auth_headers(client)
    res = client.get("/api/todos/64b64b64b64b64b64b64b64", headers=headers)
    assert res.status_code == 404


def test_update_todo(client):
    headers = auth_headers(client)
    created = client.post("/api/todos", json={"title": "Old title"}, headers=headers).get_json()
    res = client.put(
        f"/api/todos/{created['_id']}",
        json={"title": "New title", "completed": True},
        headers=headers,
    )
    assert res.status_code == 200
    data = res.get_json()
    assert data["title"] == "New title"
    assert data["completed"] is True


def test_delete_todo(client):
    headers = auth_headers(client)
    created = client.post("/api/todos", json={"title": "Delete me"}, headers=headers).get_json()
    res = client.delete(f"/api/todos/{created['_id']}", headers=headers)
    assert res.status_code == 200

    follow_up = client.get(f"/api/todos/{created['_id']}", headers=headers)
    assert follow_up.status_code == 404


def test_users_cannot_see_each_others_todos(client):
    headers_a = auth_headers(client, email="a@example.com")
    headers_b = auth_headers(client, email="b@example.com")

    client.post("/api/todos", json={"title": "A's task"}, headers=headers_a)

    res = client.get("/api/todos", headers=headers_b)
    assert res.status_code == 200
    assert res.get_json() == []
