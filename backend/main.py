from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
from backend.routes import plant_routes, user_routes, recommendation_routes
from dotenv import load_dotenv

load_dotenv() 
print("🚀 API KEY:", os.getenv("WEATHER_API_KEY"))

app = FastAPI()

# ✅ CORS FIX
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ ADD PREFIXES (VERY IMPORTANT)
app.include_router(user_routes.router, prefix="")
app.include_router(plant_routes.router, prefix="")
app.include_router(recommendation_routes.router, prefix="")

@app.get("/")
def root():
    return {"message": "API running"}