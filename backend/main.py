from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from backend.routes import plant_routes, user_routes, recommendation_routes
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# 🔥 ADD THIS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# routes
app.include_router(user_routes.router)
app.include_router(plant_routes.router)
app.include_router(recommendation_routes.router)