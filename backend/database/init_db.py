# reads the sql files and executes the table creation queries
import os
from db import get_connection

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    schema_path = os.path.join(BASE_DIR, "schema.sql")

    with open(schema_path, "r") as f:
        sql_script = f.read()

    cursor.executescript(sql_script)

    conn.commit()
    conn.close()

    print("✅ Database initialized")

if __name__ == "__main__":
    init_db()