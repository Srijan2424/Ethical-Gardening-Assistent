import sys
import os
import json

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from backend.database.db import get_connection

conn = get_connection()
cursor = conn.cursor()

file_path = os.path.join("backend/database", "pests.json")

with open(file_path) as f:
    data = json.load(f)

for entry in data:
    plant_name = entry["plant"].capitalize()

    cursor.execute("SELECT id FROM plants WHERE name = ?", (plant_name,))
    plant_row = cursor.fetchone()

    if not plant_row:
        print(f"⚠️ Plant not found: {plant_name}")
        continue

    plant_id = plant_row["id"]

    for pest in entry["pests"]:
        pest_name = pest["name"]
        solution = pest["solution"]

        cursor.execute(
            "INSERT OR IGNORE INTO pests (name, solution) VALUES (?, ?)",
            (pest_name, solution)
        )

        cursor.execute("SELECT id FROM pests WHERE name = ?", (pest_name,))
        pest_id = cursor.fetchone()["id"]

        cursor.execute(
            "INSERT OR IGNORE INTO plant_pests (plant_id, pest_id) VALUES (?, ?)",
            (plant_id, pest_id)
        )

conn.commit()
conn.close()

print("✅ Pests and mappings loaded successfully!")