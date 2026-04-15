from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from ..database import Base


class Favourite(Base):
    __tablename__ = "favourites"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    game_id = Column(Integer, nullable=False)          # RAWG game ID
    game_slug = Column(String, nullable=False)
    game_name = Column(String, nullable=False)
    game_background_image = Column(String, nullable=True)
    added_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("user_id", "game_id", name="uq_favourite_user_game"),
    )

    # Relationships
    user = relationship("User", back_populates="favourites")


class WishlistItem(Base):
    __tablename__ = "wishlist"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    game_id = Column(Integer, nullable=False)          # RAWG game ID
    game_slug = Column(String, nullable=False)
    game_name = Column(String, nullable=False)
    game_background_image = Column(String, nullable=True)
    added_at = Column(DateTime(timezone=True), server_default=func.now())

    __table_args__ = (
        UniqueConstraint("user_id", "game_id", name="uq_wishlist_user_game"),
    )

    # Relationships
    user = relationship("User", back_populates="wishlist")
