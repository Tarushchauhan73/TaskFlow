from datetime import datetime, timezone

from bson import ObjectId
from bson.errors import InvalidId
from flask import Blueprint, current_app, jsonify, request
from pymongo import ReturnDocument

from .auth import login_required

todos_bp = Blueprint("todos", __name__, url_prefix="/api/todos")


def serialize(todo):
    return {
        "_id": str(todo["_id"]),
        "title": todo["title"],
        "completed": todo.get("completed", False),
        "createdAt": todo.get("createdAt"),
        "updatedAt": todo.get("updatedAt"),
    }


def to_object_id(id_str):
    try:
        return ObjectId(id_str)
    except (InvalidId, TypeError):
        return None


@todos_bp.route("", methods=["GET"])
@login_required
def get_todos():
    db = current_app.db
    todos = list(db.todos.find({"user_id": request.user_id}).sort("createdAt", -1))
    return jsonify([serialize(t) for t in todos])


@todos_bp.route("/<id>", methods=["GET"])
@login_required
def get_todo(id):
    db = current_app.db
    oid = to_object_id(id)
    if oid is None:
        return jsonify({"error": "Todo not found"}), 404

    todo = db.todos.find_one({"_id": oid, "user_id": request.user_id})
    if not todo:
        return jsonify({"error": "Todo not found"}), 404
    return jsonify(serialize(todo))


@todos_bp.route("", methods=["POST"])
@login_required
def create_todo():
    db = current_app.db
    data = request.get_json(silent=True) or {}
    title = (data.get("title") or "").strip()
    if not title:
        return jsonify({"error": "Title is required"}), 400

    now = datetime.now(timezone.utc).isoformat()
    doc = {
        "title": title,
        "completed": False,
        "createdAt": now,
        "updatedAt": now,
        "user_id": request.user_id,
    }
    result = db.todos.insert_one(doc)
    doc["_id"] = result.inserted_id
    return jsonify(serialize(doc)), 201


@todos_bp.route("/<id>", methods=["PUT"])
@login_required
def update_todo(id):
    db = current_app.db
    oid = to_object_id(id)
    if oid is None:
        return jsonify({"error": "Todo not found"}), 404

    data = request.get_json(silent=True) or {}
    update = {}
    if "title" in data:
        update["title"] = data["title"]
    if "completed" in data:
        update["completed"] = data["completed"]
    update["updatedAt"] = datetime.now(timezone.utc).isoformat()

    todo = db.todos.find_one_and_update(
        {"_id": oid, "user_id": request.user_id},
        {"$set": update},
        return_document=ReturnDocument.AFTER,
    )
    if not todo:
        return jsonify({"error": "Todo not found"}), 404
    return jsonify(serialize(todo))


@todos_bp.route("/<id>", methods=["DELETE"])
@login_required
def delete_todo(id):
    db = current_app.db
    oid = to_object_id(id)
    if oid is None:
        return jsonify({"error": "Todo not found"}), 404

    result = db.todos.delete_one({"_id": oid, "user_id": request.user_id})
    if result.deleted_count == 0:
        return jsonify({"error": "Todo not found"}), 404
    return jsonify({"message": "Todo deleted"})
