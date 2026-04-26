# testing if the tables are formed or not
from db import get_connection

conn=get_connection()
cursor=conn.cursor()

# Get all table names
cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
tables = [t["name"] for t in cursor.fetchall()]

for table in tables:
    print(f"\n📊 Table: {table}")
    print("-" * 30)

    cursor.execute(f"SELECT * FROM {table}")
    rows = cursor.fetchall()

    if not rows:
        print("No data")
    else:
        for row in rows:
            print(dict(row))

conn.close()