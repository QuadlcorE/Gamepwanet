from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select

from ..auth.dependencies import get_current_user
from ..auth.models import User
from ..database import get_db
from ..auth.models import User as User_model
from ..auth.schemas import UserResponse
from .models import Favourite, WishlistItem
from .schemas import UserProfileResponse

router = APIRouter(
    prefix="/users",
    tags=['Users']
)

profile_router = APIRouter(
    prefix="/user",
    tags=["Users"],
)

@router.get("/", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    stmt = select(User_model)
    users = (
        db.execute(stmt).scalars().all()
    )
    return users


@profile_router.get("/profile", response_model=UserProfileResponse)
def get_user_profile(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    favorite_ids = db.execute(
        select(Favourite.game_id).filter(Favourite.user_id == current_user.id)
    ).scalars().all()
    wishlist_ids = db.execute(
        select(WishlistItem.game_id).filter(WishlistItem.user_id == current_user.id)
    ).scalars().all()

    return {
        "favorite_ids": favorite_ids,
        "wishlist_ids": wishlist_ids,
    }
