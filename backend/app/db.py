import os

from pymongo import MongoClient


def get_db():
    uri = os.environ.get("MONGO_URI", "mongodb://localhost:27017/taskflow")
    client = MongoClient(uri)
    return client.get_database()
