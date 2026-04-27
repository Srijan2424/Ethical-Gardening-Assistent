from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

# ✅ LOAD ENV
load_dotenv()

# ✅ CREATE APP FIRST
app = FastAPI()

# ✅ ADD CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://ethical-gardening-assistent.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ IMPORT ROUTES AFTER APP CREATION
from backend.routes import (
    plant_routes,
    user_routes,
    recommendation_routes,
    community_routes   # 👈 ADD THIS
)

# ✅ INCLUDE ROUTERS
app.include_router(user_routes.router)
app.include_router(plant_routes.router)
app.include_router(recommendation_routes.router)
app.include_router(community_routes.router)  # 👈 ADD HERE

# ✅ ROOT
@app.get("/")
def root():
    return {"message": "API running"}