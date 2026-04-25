import pandas as pd
import json

df = pd.read_csv("/Users/srijanchopra/Desktop/Coding/college projects/Software Engineering Project New/ethical_gardening_assistent/scripts/Crop_recommendation.csv")

plants = []

REGION_MAP = {
    "rice": "West Bengal, Uttar Pradesh, Punjab, Andhra Pradesh, Tamil Nadu",
    "maize": "Karnataka, Madhya Pradesh, Bihar, Uttar Pradesh",
    "chickpea": "Madhya Pradesh, Rajasthan, Maharashtra, Uttar Pradesh",
    "kidneybeans": "Himachal Pradesh, Jammu & Kashmir, Uttarakhand",
    "pigeonpeas": "Maharashtra, Karnataka, Telangana, Uttar Pradesh",
    "mothbeans": "Rajasthan, Gujarat",
    "mungbean": "Rajasthan, Maharashtra, Andhra Pradesh",
    "blackgram": "Madhya Pradesh, Uttar Pradesh, Tamil Nadu",
    "lentil": "Uttar Pradesh, Madhya Pradesh, Bihar",
    "pomegranate": "Maharashtra, Karnataka, Gujarat",
    "banana": "Tamil Nadu, Maharashtra, Gujarat, Andhra Pradesh",
    "mango": "Uttar Pradesh, Andhra Pradesh, Maharashtra, Bihar",
    "grapes": "Maharashtra, Karnataka",
    "watermelon": "Uttar Pradesh, Karnataka, Punjab",
    "muskmelon": "Punjab, Haryana, Uttar Pradesh",
    "apple": "Himachal Pradesh, Jammu & Kashmir, Uttarakhand",
    "orange": "Maharashtra, Punjab, Assam, Madhya Pradesh",
    "papaya": "Andhra Pradesh, Gujarat, Maharashtra",
    "coconut": "Kerala, Tamil Nadu, Karnataka",
    "cotton": "Gujarat, Maharashtra, Telangana, Punjab",
    "jute": "West Bengal, Assam, Bihar",
    "coffee": "Karnataka, Kerala, Tamil Nadu"
}

unique_plants = df["label"].unique()

for plant in unique_plants:
    plant_data = df[df["label"] == plant]

    temp_min = round(plant_data["temperature"].min(), 1)
    temp_max = round(plant_data["temperature"].max(), 1)

    humidity_min = round(plant_data["humidity"].min(), 1)
    humidity_max = round(plant_data["humidity"].max(), 1)

    ph_min = round(plant_data["ph"].min(), 1)
    ph_max = round(plant_data["ph"].max(), 1)

    rainfall_min = round(plant_data["rainfall"].min(), 1)
    rainfall_max = round(plant_data["rainfall"].max(), 1)

    # Water logic
    if rainfall_max > 200:
        water = "high"
    elif rainfall_max > 100:
        water = "moderate"
    else:
        water = "low"

    # Soil logic
    if ph_min < 6:
        soil = "acidic soil"
    elif ph_max > 7:
        soil = "alkaline soil"
    else:
        soil = "neutral soil"

    # Region mapping
    region = REGION_MAP.get(plant, "Various regions in India")

    # Description
    description = (
        f"{plant.capitalize()} grows best in {region}. "
        f"It prefers temperatures between {temp_min}-{temp_max}°C, "
        f"humidity {humidity_min}-{humidity_max}%, pH {ph_min}-{ph_max}, "
        f"and rainfall {rainfall_min}-{rainfall_max} mm."
    )

    plants.append({
        "name": plant.capitalize(),
        "description": description,
        "region": region,
        "water_frequency": water,
        "sunlight": "full sun",
        "soil": soil,
        "ph_range": f"{ph_min}-{ph_max}",
        "temperature_range": f"{temp_min}-{temp_max}",
        "humidity_range": f"{humidity_min}-{humidity_max}",
        "rainfall_range": f"{rainfall_min}-{rainfall_max}"
    })

with open("/Users/srijanchopra/Desktop/Coding/college projects/Software Engineering Project New/ethical_gardening_assistent/database/plants.json", "w") as f:
    json.dump(plants, f, indent=2)

print("plants.json created with region info!")