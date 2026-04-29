from sqlalchemy import select
from sqlalchemy.orm import Session

from .models import GameDetailsCache
from .schemas import CachedGameDetailsWrite


def get_game_cache_by_key(db: Session, cache_key: str) -> GameDetailsCache | None:
    stmt = select(GameDetailsCache).where(GameDetailsCache.cache_key == cache_key)
    result = db.execute(stmt).scalar_one_or_none()
    return result


def upsert_game_cache(db: Session, payload: CachedGameDetailsWrite) -> GameDetailsCache:
    row = get_game_cache_by_key(db, payload.cache_key)
    serialized_payload = payload.payload
    if row is None:
        row = GameDetailsCache(
            cache_key=payload.cache_key,
            payload_json=serialized_payload,
            expires_at=payload.expires_at,
        )
        db.add(row)
    else:
        row.payload_json = serialized_payload
        row.expires_at = payload.expires_at

    db.commit()
    db.refresh(row)
    return row

