import requests
import os

API_KEY = os.getenv("WEATHER_API_KEY")

def get_weather(city):
    current_url = f"https://api.openweathermap.org/data/2.5/weather?q={city}&appid={API_KEY}&units=metric"
    forecast_url = f"https://api.openweathermap.org/data/2.5/forecast?q={city}&appid={API_KEY}&units=metric"

    current_res = requests.get(current_url).json()
    forecast_res = requests.get(forecast_url).json()

    # 🌤 CURRENT WEATHER
    weather = {
        "temperature": current_res["main"]["temp"],
        "humidity": current_res["main"]["humidity"],
        "condition": current_res["weather"][0]["main"]
    }

    # 📅 5 DAY FORECAST (1 per day)
    forecast = []
    for i in range(0, len(forecast_res["list"]), 8):
        item = forecast_res["list"][i]

        forecast.append({
            "date": item["dt_txt"],
            "temp": item["main"]["temp"],
            "condition": item["weather"][0]["main"]
        })

    return {
        "weather": weather,
        "forecast": forecast
    }