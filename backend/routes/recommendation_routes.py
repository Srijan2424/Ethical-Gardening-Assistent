from fastapi import APIRouter
from database.db import get_connection
import requests
import os

router = APIRouter()

# 🔑 Replace with your OpenWeather API key
API_KEY = os.getenv("WEATHER_API_KEY")


@router.get("/recommendations/{user_id}")
def get_recommendations(user_id: int):
    conn = get_connection()
    cursor = conn.cursor()

    # 🔍 Get user
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()

    if not user:
        return {"error": "User not found"}

    city = user["city"]

    # 🌦 FETCH CURRENT + FORECAST
    try:
        # 🌤 CURRENT WEATHER
        weather_url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
        current_res = requests.get(weather_url).json()

        weather = {
            "temperature": current_res["main"]["temp"],
            "humidity": current_res["main"]["humidity"],
            "condition": current_res["weather"][0]["main"]
        }

        # 📅 FORECAST (5 days)
        forecast_url = f"https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={API_KEY}&units=metric"
        forecast_res = requests.get(forecast_url).json()

        forecast = []

        # every 24 hours (8 entries per day)
        for i in range(0, len(forecast_res["list"]), 8):
            item = forecast_res["list"][i]

            forecast.append({
                "day": item["dt_txt"].split(" ")[0],  # YYYY-MM-DD
                "temp": item["main"]["temp"],
                "condition": item["weather"][0]["main"]
            })

    except Exception as e:
        print("Weather API error:", e)

        weather = {
            "temperature": None,
            "humidity": None,
            "condition": "Unavailable"
        }

        forecast = []  # fallback safe

    # 🌱 RECOMMENDATION LOGIC
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
            "plant_id": plant["id"],   # 🔥 ADD THIS
            "plant": plant["name"],
            "advice": advice
        })

    conn.close()

    return {
    "name": user["name"],  
    "city": city,
    "weather": weather,
    "forecast": forecast,   # if you already added forecast
    "recommendations": recommendations,
    "user_watering_time": user["watering_time"]
}