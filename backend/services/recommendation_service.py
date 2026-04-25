from database.db import get_connection
from backend.services.weather_service import get_weather

def get_recommendations(user_id):
    conn = get_connection()
    cursor = conn.cursor()

    # 🟢 Step 1: Get user details
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()

    if not user:
        return {"error": "User not found"}

    city = user["city"]
    care_level = user["care_level"]

    # 🟢 Step 2: Get weather using user city
    weather = get_weather(city)

    # 🟢 Step 3: Get plant + pest info
    cursor.execute("""
    SELECT pests.name, pests.solution, plants.name as plant
    FROM user_plants
    JOIN plants ON user_plants.plant_id = plants.id
    JOIN plant_pests ON plants.id = plant_pests.plant_id
    JOIN pests ON plant_pests.pest_id = pests.id
    WHERE user_plants.user_id = ?
    """, (user_id,))

    data = [dict(row) for row in cursor.fetchall()]

    # 🟢 Step 4: Apply intelligent logic
    recommendations = []

    for item in data:
        advice = item["solution"]

        # 🌧️ Weather-based logic
        if weather["humidity"] > 70:
            advice += " | High humidity → fungal risk"

        if weather["temperature"] > 30:
            advice += " | Increase watering frequency"

        if weather["condition"] == "Rain":
            advice += " | Rain → monitor pests closely"

        # 👤 User preference logic
        if care_level == "beginner":
            advice += " | Simple tip: check plant daily"

        recommendations.append({
            "plant": item["plant"],
            "pest": item["name"],
            "advice": advice
        })

    conn.close()

    return {
        "city": city,
        "weather": weather,
        "recommendations": recommendations
    }