from flask import Flask
from flask_cors import CORS

from .db import get_db
from .routes import todos_bp


def create_app(db=None):
    """Application factory. Pass a db object (e.g. mongomock) for testing."""
    app = Flask(__name__)
    CORS(app)

    app.db = db if db is not None else get_db()

    app.register_blueprint(todos_bp)

    @app.route("/api/health")
    def health():
        return {"status": "ok"}

    return app
