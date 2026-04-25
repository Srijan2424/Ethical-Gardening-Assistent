from fastapi import APIRouter
from database.db import get_connection
from passlib.hash import bcrypt

router = APIRouter()


# 🔍 CHECK USER
@router.post("/check-user")
def check_user(data: dict):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE email = ?", (data.get("email"),))
    user = cursor.fetchone()

    conn.close()

    return {"exists": bool(user and user["password"])}


# 🔐 LOGIN
@router.post("/login")
def login(data: dict):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE email = ?", (data.get("email"),))
    user = cursor.fetchone()

    conn.close()

    if user and bcrypt.verify(data.get("password", ""), user["password"]):
        return {"user_id": user["id"]}

    return {"error": "Invalid credentials"}


# 🆕 REGISTER
@router.post("/register")
def register(data: dict):
    conn = get_connection()
    cursor = conn.cursor()

    hashed_password = bcrypt.hash(data["password"])

    cursor.execute("""
        INSERT INTO users (name, email, password, city, watering_time, care_level)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (
        data["name"],
        data["email"],
        hashed_password,
        data["city"],
        data["watering_time"],
        data["care_level"]
    ))

    conn.commit()
    user_id = cursor.lastrowid
    conn.close()

    return {"user_id": user_id}


# 🌱 GET USER PLANTS
@router.get("/user-plants/{user_id}")
def get_user_plants(user_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT plants.id, plants.name, plants.description, plants.image
        FROM user_plants
        JOIN plants ON plants.id = user_plants.plant_id
        WHERE user_plants.user_id = ?
    """, (user_id,))

    plants = cursor.fetchall()
    conn.close()

    return [dict(p) for p in plants]


# ➕ ADD PLANT (FIXED SAFE)
@router.post("/user-plants")
def add_plant(data: dict):
    try:
        user_id = data.get("user_id")
        plant_id = data.get("plant_id")

        if not user_id or not plant_id:
            return {"error": "Missing user_id or plant_id"}

        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            INSERT INTO user_plants (user_id, plant_id)
            SELECT ?, ?
            WHERE NOT EXISTS (
                SELECT 1 FROM user_plants
                WHERE user_id = ? AND plant_id = ?
            )
        """, (user_id, plant_id, user_id, plant_id))

        conn.commit()
        conn.close()

        return {"message": "Plant added"}

    except Exception as e:
        print("Add plant error:", e)
        return {"error": "Failed to add plant"}


# ❌ REMOVE PLANT
@router.delete("/user-plants")
def remove_plant(data: dict):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            DELETE FROM user_plants
            WHERE user_id = ? AND plant_id = ?
        """, (data.get("user_id"), data.get("plant_id")))

        conn.commit()
        conn.close()

        return {"message": "Plant removed"}

    except Exception as e:
        print("Remove plant error:", e)
        return {"error": "Failed to remove plant"}


# 📄 GET USER DETAILS
@router.get("/user/{user_id}")
def get_user(user_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        SELECT id, name, email, city, watering_time, care_level 
        FROM users WHERE id = ?
    """, (user_id,))

    user = cursor.fetchone()
    conn.close()

    return dict(user) if user else {"error": "User not found"}


# ✏️ UPDATE USER
@router.put("/user/{user_id}")
def update_user(user_id: int, data: dict):
    try:
        conn = get_connection()
        cursor = conn.cursor()

        cursor.execute("""
            UPDATE users
            SET name=?, city=?, watering_time=?, care_level=?
            WHERE id=?
        """, (
            data.get("name"),
            data.get("city"),
            data.get("watering_time"),
            data.get("care_level"),
            user_id
        ))

        conn.commit()
        conn.close()

        return {"message": "User updated successfully"}

    except Exception as e:
        print("Update user error:", e)
        return {"error": "Update failed"}