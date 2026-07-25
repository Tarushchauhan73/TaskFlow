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


def test_get_todos_returns_empty_list_initially(client):
    res = client.get("/api/todos")
    assert res.status_code == 200
    assert res.get_json() == []


def test_create_todo(client):
    res = client.post("/api/todos", json={"title": "Learn testing"})
    assert res.status_code == 201
    data = res.get_json()
    assert data["title"] == "Learn testing"
    assert data["completed"] is False


def test_create_todo_missing_title_returns_400(client):
    res = client.post("/api/todos", json={})
    assert res.status_code == 400


def test_get_todo_by_id(client):
    created = client.post("/api/todos", json={"title": "Test todo"}).get_json()
    res = client.get(f"/api/todos/{created['_id']}")
    assert res.status_code == 200
    assert res.get_json()["title"] == "Test todo"


def test_get_todo_missing_returns_404(client):
    res = client.get("/api/todos/64b64b64b64b64b64b64b64")
    assert res.status_code == 404


def test_update_todo(client):
    created = client.post("/api/todos", json={"title": "Old title"}).get_json()
    res = client.put(
        f"/api/todos/{created['_id']}",
        json={"title": "New title", "completed": True},
    )
    assert res.status_code == 200
    data = res.get_json()
    assert data["title"] == "New title"
    assert data["completed"] is True


def test_delete_todo(client):
    created = client.post("/api/todos", json={"title": "Delete me"}).get_json()
    res = client.delete(f"/api/todos/{created['_id']}")
    assert res.status_code == 200

    follow_up = client.get(f"/api/todos/{created['_id']}")
    assert follow_up.status_code == 404
