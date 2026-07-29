from bson import ObjectId
from flask import Blueprint, current_app, jsonify, request
from werkzeug.security import check_password_hash, generate_password_hash

from .auth import generate_token, login_required

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")


def serialize_user(user):
    return {"_id": str(user["_id"]), "email": user["email"]}


@auth_bp.route("/register", methods=["POST"])
def register():
    db = current_app.db
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400
    if db.users.find_one({"email": email}):
        return jsonify({"error": "An account with this email already exists"}), 409

    user_doc = {"email": email, "password_hash": generate_password_hash(password)}
    result = db.users.insert_one(user_doc)
    token = generate_token(result.inserted_id)
    return (
        jsonify({"token": token, "user": {"_id": str(result.inserted_id), "email": email}}),
        201,
    )


@auth_bp.route("/login", methods=["POST"])
def login():
    db = current_app.db
    data = request.get_json(silent=True) or {}
    email = (data.get("email") or "").strip().lower()
    password = data.get("password") or ""

    user = db.users.find_one({"email": email})
    if not user or not check_password_hash(user["password_hash"], password):
        return jsonify({"error": "Invalid email or password"}), 401

    token = generate_token(user["_id"])
    return jsonify({"token": token, "user": serialize_user(user)})


@auth_bp.route("/me", methods=["GET"])
@login_required
def me():
    db = current_app.db
    user = db.users.find_one({"_id": ObjectId(request.user_id)})
    if not user:
        return jsonify({"error": "User not found"}), 404
    return jsonify(serialize_user(user))
