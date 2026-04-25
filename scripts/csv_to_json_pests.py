import pandas as pd
import json

# Load CSV
df = pd.read_csv("scripts/pests.csv")

# Group by plant
grouped = {}

for _, row in df.iterrows():
    plant = row["plant"].capitalize()
    pest = row["pest"]
    solution = row["solution"]

    if plant not in grouped:
        grouped[plant] = []

    grouped[plant].append({
        "name": pest,
        "solution": solution
    })

# Convert to required JSON format
result = []

for plant, pests in grouped.items():
    result.append({
        "plant": plant,
        "pests": pests
    })

# Save JSON
with open("database/pests.json", "w") as f:
    json.dump(result, f, indent=2)

print("✅ pests.json created from CSV!")