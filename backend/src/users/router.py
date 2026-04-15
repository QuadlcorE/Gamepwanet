from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select

from ..database import get_db
from ..auth.models import User as User_model
from ..auth.schemas import UserResponse

router = APIRouter(
    prefix="/users",
    tags=['Users']
)

@router.get("/", response_model=list[UserResponse])
def get_users(db: Session = Depends(get_db)):
    stmt = select(User_model)
    users = (
        db.execute(stmt).scalars().all()
    )
    return users
