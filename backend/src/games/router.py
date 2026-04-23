from src.games.service import retrieve_weekly_games
from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from ..auth.dependencies import get_current_user
from ..auth.models import User
from ..database import get_db
from ..users.models import Favourite, WishlistItem
from ..users.schemas import (
    GameListActionResponse,
    GameListItemCreate,
    GameListItemDelete,
)
from .service import *

router = APIRouter(
    prefix="/games",
    tags=['Games']
)

PUBLIC_CACHE_CONTROL = "public, s-maxage=300, max-age=60, stale-while-revalidate=120"


def set_public_cache(response: Response) -> None:
    response.headers["Cache-Control"] = PUBLIC_CACHE_CONTROL

@router.get("/week")
def get_weekly_games(response: Response, count: int=5):
    set_public_cache(response)
    results = retrieve_weekly_games(count)
    return results

@router.get("/top")
def get_top_games(response: Response, time: str="month", count: int=5):
    set_public_cache(response)
    results = retrieve_top_games(count)
    return results

@router.get("/upcoming")
def get_upcoming_games(response: Response, count: int=3):
    set_public_cache(response)
    results = retrieve_upcoming_games(count)
    return results

@router.get("/hot")
def get_hot_games(response: Response, count: int=10):
    set_public_cache(response)
    results = retrieve_hot_games(count)
    return results
    
@router.get("/hot/{month_id}")
def get_upcoming_games(response: Response, month_id, count: int=10):
    set_public_cache(response)
    results = retrieve_hot_games_by_month(count, month_id)
    return results

@router.get("/search")
def search_game(response: Response, search: str, count: int=15, page: int=1):
    set_public_cache(response)
    results = get_search_game(search, count, page)
    return results

@router.post(
    "/favorite",
    response_model=GameListActionResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_favorite(
    payload: GameListItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = db.execute(
        select(Favourite).filter(
            Favourite.user_id == current_user.id,
            Favourite.game_id == payload.game_id,
        )
    ).scalar_one_or_none()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Game is already in favorites",
        )

    favorite = Favourite(user_id=current_user.id, **payload.model_dump())
    db.add(favorite)
    db.commit()

    return {"message": "Game added to favorites", "game_id": payload.game_id}


@router.delete("/favorite", response_model=GameListActionResponse)
def remove_favorite(
    payload: GameListItemDelete,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    favorite = db.execute(
        select(Favourite).filter(
            Favourite.user_id == current_user.id,
            Favourite.game_id == payload.game_id,
        )
    ).scalar_one_or_none()
    if favorite is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Game is not in favorites",
        )

    db.delete(favorite)
    db.commit()

    return {"message": "Game removed from favorites", "game_id": payload.game_id}


@router.post(
    "/wishlist",
    response_model=GameListActionResponse,
    status_code=status.HTTP_201_CREATED,
)
def add_wishlist_item(
    payload: GameListItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = db.execute(
        select(WishlistItem).filter(
            WishlistItem.user_id == current_user.id,
            WishlistItem.game_id == payload.game_id,
        )
    ).scalar_one_or_none()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Game is already in wishlist",
        )

    wishlist_item = WishlistItem(user_id=current_user.id, **payload.model_dump())
    db.add(wishlist_item)
    db.commit()

    return {"message": "Game added to wishlist", "game_id": payload.game_id}


@router.delete("/wishlist", response_model=GameListActionResponse)
def remove_wishlist_item(
    payload: GameListItemDelete,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    wishlist_item = db.execute(
        select(WishlistItem).filter(
            WishlistItem.user_id == current_user.id,
            WishlistItem.game_id == payload.game_id,
        )
    ).scalar_one_or_none()
    if wishlist_item is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Game is not in wishlist",
        )

    db.delete(wishlist_item)
    db.commit()

    return {"message": "Game removed from wishlist", "game_id": payload.game_id}


@router.get("/{game_id}")
def get_game_details(response: Response, game_id: int | str):
    set_public_cache(response)
    results = retrieve_game_details(game_id)
    return results