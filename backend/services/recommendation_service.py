from backend.database.db import get_connection
from backend.services.weather_service import get_weather

def get_recommendations(user_id):
    conn = get_connection()
    cursor = conn.cursor()

    # 🟢 Get user
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()

    if not user:
        return {"error": "User not found"}

    city = user["city"]
    care_level = user["care_level"]
    watering_time = user["watering_time"]

    # 🟢 Weather (SAFE)
    try:
        weather_data = get_weather(city)
        current_weather = weather_data["weather"]
    except:
        weather_data = {"weather": {"temperature": None, "humidity": None, "condition": "Unknown"}, "forecast": []}
        current_weather = weather_data["weather"]

    # 🟢 Get USER plants
    cursor.execute("""
        SELECT plants.id, plants.name
        FROM user_plants
        JOIN plants ON user_plants.plant_id = plants.id
        WHERE user_plants.user_id = ?
    """, (user_id,))

    user_plants = cursor.fetchall()

    recommendations = []

    # ✅ CASE 1: USER HAS PLANTS
    if user_plants:
        for row in user_plants:
            advice = "Monitor plant health"

            if current_weather["humidity"] and current_weather["humidity"] > 70:
                advice += " | High humidity → fungal risk"

            if current_weather["temperature"] and current_weather["temperature"] > 30:
                advice += " | Increase watering frequency"

            if current_weather["condition"] == "Rain":
                advice += " | Rain → check pests"

            if care_level == "beginner":
                advice += " | Beginner tip: water daily"

            recommendations.append({
                "plant_id": row["id"],  # ✅ IMPORTANT
                "plant": row["name"],
                "advice": advice
            })

    # ✅ CASE 2: NO PLANTS → SUGGEST SOME
    else:
        cursor.execute("SELECT id, name FROM plants LIMIT 5")
        fallback_plants = cursor.fetchall()

        for row in fallback_plants:
            recommendations.append({
                "plant_id": row["id"],
                "plant": row["name"],
                "advice": "Try adding this plant to your garden 🌱"
            })

    conn.close()

    return {
        "city": city,
        "weather": weather_data,
        "recommendations": recommendations,
        "user_watering_time": watering_time
    }