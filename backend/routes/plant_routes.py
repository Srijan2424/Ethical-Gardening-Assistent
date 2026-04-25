from fastapi import APIRouter
from backend.services.plant_service import get_all_plants, search_plants

router = APIRouter()

@router.get("/plants")
def plants():
    return get_all_plants()

@router.get("/plants/search")
def search(q: str):
    return search_plants(q)