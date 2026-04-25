from database.db import get_connection

def register_user(user):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
    INSERT INTO users (name, email, city, watering_time, care_level)
    VALUES (?, ?, ?, ?, ?)
    """, (
        user["name"],
        user["email"],
        user["city"],
        user["watering_time"],
        user["care_level"]
    ))

    conn.commit()
    conn.close()

    return {"message": "User registered successfully"}


def login_user(user):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute(
        "SELECT * FROM users WHERE email = ?",
        (user["email"],)
    )

    db_user = cursor.fetchone()
    conn.close()

    if db_user:
        return {"user_id": db_user["id"], "message": "Login successful"}
    else:
        return {"error": "User not found"}