from fastapi import APIRouter
from backend.database.db import get_connection
import requests
import os

router = APIRouter()


@router.get("/recommendations/{user_id}")
def get_recommendations(user_id: int):

    API_KEY = os.getenv("WEATHER_API_KEY")

    conn = get_connection()
    cursor = conn.cursor()

    # 🔍 Get user
    cursor.execute("SELECT * FROM users WHERE id = ?", (user_id,))
    user = cursor.fetchone()

    if not user:
        return {"error": "User not found"}

    city = user["city"]

    # 🌦 DEFAULT WEATHER
    weather = {
        "temperature": None,
        "humidity": None,
        "condition": "Unavailable"
    }

    forecast = []

    try:
        if API_KEY:
            # CURRENT WEATHER
            weather_url = f"https://api.openweathermap.org/data/2.5/weather?q={city},IN&appid={API_KEY}&units=metric"
            current_res = requests.get(weather_url, timeout=5).json()

            if current_res.get("cod") == 200:
                weather = {
                    "temperature": current_res["main"]["temp"],
                    "humidity": current_res["main"]["humidity"],
                    "condition": current_res["weather"][0]["main"]
                }

            # FORECAST
            forecast_url = f"https://api.openweathermap.org/data/2.5/forecast?q={city},IN&appid={API_KEY}&units=metric"
            forecast_res = requests.get(forecast_url, timeout=5).json()

            if forecast_res.get("cod") == "200":
                for i in range(0, len(forecast_res["list"]), 8):
                    item = forecast_res["list"][i]

                    forecast.append({
                        "day": item["dt_txt"].split(" ")[0],
                        "temp": item["main"]["temp"],
                        "condition": item["weather"][0]["main"]
                    })

    except Exception as e:
        print("Weather API error:", e)

    # 🌱 GET PLANTS (NO FILTER — SAFE)
    cursor.execute("SELECT * FROM plants LIMIT 5")
    plants = cursor.fetchall()

    recommendations = []

    for plant in plants:
        advice = "Suitable plant for your garden"

        # 🌦 SIMPLE WEATHER LOGIC (SAFE)
        if weather["temperature"]:
            if weather["temperature"] > 35:
                advice = "Hot weather → water frequently"
            elif weather["temperature"] < 15:
                advice = "Cold weather → protect plant"

        if weather["humidity"]:
            if weather["humidity"] > 70:
                advice += " | Watch for fungus"

        recommendations.append({
            "plant_id": plant["id"],
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