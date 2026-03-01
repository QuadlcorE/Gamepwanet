from fastapi import FastAPI, Response, status, HTTPException, APIRouter, Depends
from .service import *

router = APIRouter(
    prefix="/games",
    tags=['Games']
)

@router.get("/top")
def get_top_games(time: str="month", count: int=5):
    results = retrieve_top_games(count)
    return results

@router.get("/upcoming")
def get_upcoming_games(count: int=3):
    results = retrieve_upcoming_games(count)
    return results