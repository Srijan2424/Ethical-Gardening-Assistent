from database.db import get_connection

def get_all_plants():
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM plants")
    plants = [dict(row) for row in cursor.fetchall()]

    conn.close()
    return plants


def search_plants(query):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM plants WHERE name LIKE ?",
        (f"%{query}%",)
    )

    plants = [dict(row) for row in cursor.fetchall()]
    conn.close()

    return plants