from datetime import datetime, timezone

from sqlalchemy import Column, DateTime, Integer, JSON, String

from ..database import Base


class GameDetailsCache(Base):
    __tablename__ = "game_details_cache"

    id = Column(Integer, primary_key=True, index=True)
    cache_key = Column(String(255), unique=True, nullable=False, index=True)
    payload_json = Column(JSON, nullable=False)
    created_at = Column(DateTime(timezone=True), nullable=False, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(
        DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )
    expires_at = Column(DateTime(timezone=True), nullable=False)