from fastapi import APIRouter
from database.db import get_connection
import requests
import os

router = APIRouter()


@router.get("/recommendations/{user_id}")
def get_recommendations(user_id: int):

    # ✅ ALWAYS GET API KEY INSIDE FUNCTION
    API_KEY = os.getenv("WEATHER_API_KEY")
    print("🔑 API KEY:", API_KEY)

    conn = get_connection()
    cursor = conn.cursor()

    # 🔍 Get user
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()

    if not user:
        return {"error": "User not found"}

    city = user["city"]
    print("🌍 Fetching weather for:", city)

    # 🌦 DEFAULT WEATHER
    weather = {
        "temperature": None,
        "humidity": None,
        "condition": "Unavailable"
    }

    forecast = []

    try:
        if not API_KEY:
            raise Exception("Missing API key")

        # ✅ ADD COUNTRY CODE FOR RELIABILITY
        weather_url = f"https://api.openweathermap.org/data/2.5/weather?q={city},IN&appid={API_KEY}&units=metric"
        current_res = requests.get(weather_url, timeout=5).json()

        print("🌦 WEATHER RAW:", current_res)

        # ✅ SAFE PARSING
        if current_res.get("cod") == 200:
            weather = {
                "temperature": current_res["main"]["temp"],
                "humidity": current_res["main"]["humidity"],
                "condition": current_res["weather"][0]["main"]
            }
        else:
            print("❌ WEATHER ERROR:", current_res)

        # 📅 FORECAST
        forecast_url = f"https://api.openweathermap.org/data/2.5/forecast?q={city},IN&appid={API_KEY}&units=metric"
        forecast_res = requests.get(forecast_url, timeout=5).json()

        print("📅 FORECAST RAW:", forecast_res)

        if forecast_res.get("cod") == "200":
            for i in range(0, len(forecast_res["list"]), 8):
                item = forecast_res["list"][i]

                forecast.append({
                    "day": item["dt_txt"].split(" ")[0],
                    "temp": item["main"]["temp"],
                    "condition": item["weather"][0]["main"]
                })
        else:
            print("❌ FORECAST ERROR:", forecast_res)

    except Exception as e:
        print("❌ Weather API error:", e)

    # 🌱 GET PLANTS
    cursor.execute("""
        SELECT * FROM plants
        WHERE care_level = ?
        LIMIT 5
    """, (user["care_level"],))

    plants = cursor.fetchall()

    recommendations = []

    for plant in plants:
        advice = "Good match for your experience level"

        if weather["temperature"] is not None:
            if weather["temperature"] < plant["ideal_temp_min"]:
                advice = "Too cold currently"
            elif weather["temperature"] > plant["ideal_temp_max"]:
                advice = "Too hot currently"
            else:
                advice = "Perfect weather for this plant"

        recommendations.append({
            "plant_id": plant["id"],   # ✅ REQUIRED FOR FRONTEND
            "plant": plant["name"],
            "advice": advice
        })

    conn.close()

    return {
        "name": user["name"],
        "city": city,
        "weather": weather,
        "forecast": forecast,
        "recommendations": recommendations,
        "user_watering_time": user["watering_time"]
    }