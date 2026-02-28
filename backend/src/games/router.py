from fastapi import FastAPI, Response, status, HTTPException, APIRouter, Depends
from .service import retrieve_top_games

router = APIRouter(
    prefix="/games",
    tags=['Games']
)

@router.get("/top")
def get_top_games(time: str="month", count: int=5):
    results = retrieve_top_games(5)
    return results