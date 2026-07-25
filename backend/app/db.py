import os

from pymongo import MongoClient

DB_NAME = os.environ.get("MONGO_DB_NAME", "taskflow")


def get_db():
    uri = os.environ.get("MONGO_URI", "mongodb://localhost:27017/taskflow")
    client = MongoClient(uri)
    return client[DB_NAME]
