from fastapi import APIRouter
from database.db import get_connection
from passlib.hash import bcrypt

router = APIRouter()

# 🔍 CHECK USER
@router.post("/check-user")
def check_user(data: dict):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE email = ?", (data["email"],))
    user = cursor.fetchone()

    conn.close()

    if user and user["password"]:
        return {"exists": True}
    else:
        return {"exists": False}


# 🔐 LOGIN
@router.post("/login")
def login(data: dict):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM users WHERE email = ?", (data["email"],))
    user = cursor.fetchone()

    conn.close()

    if user and bcrypt.verify(data["password"], user["password"]):
        return {"user_id": user["id"]}

    return {"error": "Invalid credentials"}


# 🆕 REGISTER (ONBOARDING)
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


# 🌱 GET USER PLANTS (FOR GARDEN)
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

    # Convert rows to dict
    return [dict(p) for p in plants]


# ➕ ADD PLANT (NO DUPLICATES)
@router.post("/user-plants")
def add_plant(data: dict):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        INSERT INTO user_plants (user_id, plant_id)
        SELECT ?, ?
        WHERE NOT EXISTS (
            SELECT 1 FROM user_plants
            WHERE user_id = ? AND plant_id = ?
        )
    """, (
        data["user_id"],
        data["plant_id"],
        data["user_id"],
        data["plant_id"]
    ))

    conn.commit()
    conn.close()

    return {"message": "Plant added"}


# ❌ REMOVE PLANT (NEW)
@router.delete("/user-plants")
def remove_plant(data: dict):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        DELETE FROM user_plants
        WHERE user_id = ? AND plant_id = ?
    """, (data["user_id"], data["plant_id"]))

    conn.commit()
    conn.close()

    return {"message": "Plant removed"}
# 📄 GET USER DETAILS
@router.get("/user/{user_id}")
def get_user(user_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT id, name, email, city, watering_time, care_level FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()

    conn.close()

    if user:
        return dict(user)

    return {"error": "User not found"}


# ✏️ UPDATE USER DETAILS
@router.put("/user/{user_id}")
def update_user(user_id: int, data: dict):
    conn = get_connection()
    cursor = conn.cursor()

    cursor.execute("""
        UPDATE users
        SET name=?, city=?, watering_time=?, care_level=?
        WHERE id=?
    """, (
        data["name"],
        data["city"],
        data["watering_time"],
        data["care_level"],
        user_id
    ))

    conn.commit()
    conn.close()

    return {"message": "User updated successfully"}