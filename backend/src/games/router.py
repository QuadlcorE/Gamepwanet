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

@router.get("/hot")
def get_hot_games(count: int=10):
    results = retrieve_hot_games(count)
    return results
    
@router.get("/hot/{month_id}")
def get_upcoming_games(month_id, count: int=10):
    results = retrieve_hot_games_by_month(count, month_id)
    return results