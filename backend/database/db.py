# creates a connection between python and sql 
# this file is made so that we dont repeat connection code for all the files
import sqlite3
import os

# Absolute path from project root
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(BASE_DIR, "garden.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn