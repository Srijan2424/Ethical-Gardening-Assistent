import sqlite3
import json
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "garden.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def seed_data():
    conn = get_connection()
    cursor = conn.cursor()

    plants_file = os.path.join(os.path.dirname(__file__), "plants.json")

    if not os.path.exists(plants_file):
        print("❌ plants.json not found")
        return

    with open(plants_file) as f:
        plants = json.load(f)

    # 🌿 Better image queries
    image_query_map = {
        "rice": "rice field",
        "maize": "corn plant",
        "chickpea": "chickpea plant",
        "pigeonpeas": "pigeon pea plant",
        "mungbean": "green gram plant",
        "blackgram": "black gram plant",
        "lentil": "lentil plant",
        "cotton": "cotton plant",
        "jute": "jute plant",
        "coffee": "coffee plant"
    }

    for plant in plants:
        name = plant["name"]

        print("Inserting:", plant["name"])

        
        query = image_query_map.get(name.lower(), name)
        image_url = f"https://source.unsplash.com/featured/?{query}"

        cursor.execute("""
        INSERT INTO plants 
        (name, description, image, ideal_temp_min, ideal_temp_max, ideal_humidity_min, ideal_humidity_max, care_level)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            name,
            plant.get("description", ""),
            image_url,
            plant.get("ideal_temp_min", 0),
            plant.get("ideal_temp_max", 50),
            plant.get("ideal_humidity_min", 0),
            plant.get("ideal_humidity_max", 100),
            plant.get("care_level", "medium")
        ))

    conn.commit()
    conn.close()

    print("✅ Plants seeded successfully with full data!")
    

if __name__ == "__main__":
    seed_data()