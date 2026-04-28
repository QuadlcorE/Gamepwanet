import json
import logging
from datetime import datetime, timezone

from sqlalchemy.orm import Session

from .repository import get_game_cache_by_key, upsert_game_cache
from .schemas import CachedGameDetailsRead, CachedGameDetailsWrite

logger = logging.getLogger(__name__)


def _utc_now() -> datetime:
    return datetime.now(timezone.utc)


def _to_utc(value: datetime) -> datetime:
    if value.tzinfo is None:
        return value.replace(tzinfo=timezone.utc)
    return value.astimezone(timezone.utc)


def get_cached_game_details(
    db: Session,
    *,
    cache_key: str,
) -> CachedGameDetailsRead | None:
    """
    Read and validate a non-expired cache entry for `cache_key`.
    Returns None when missing, expired, or malformed.
    """
    row = get_game_cache_by_key(db, cache_key)
    if row is None:
        return None

    expires_at = _to_utc(row.expires_at)
    if expires_at <= _utc_now():
        return None

    if isinstance(row.payload_json, dict):
        payload = row.payload_json
    elif row.payload_json:
        payload = json.loads(row.payload_json)
    else:
        payload = None

    if not isinstance(payload, dict):
        logger.warning("Cache row has invalid payload shape for key '%s'.", cache_key)
        return None

    return CachedGameDetailsRead(
        cache_key=row.cache_key,
        payload=payload,
        expires_at=row.expires_at,
    )


def upsert_cached_game_details(
    db: Session,
    payload: CachedGameDetailsWrite,
) -> CachedGameDetailsRead:
    """
    Create or update cached game details by `cache_key`.
    """
    row = upsert_game_cache(db, payload)

    return CachedGameDetailsRead(
        cache_key=row.cache_key,
        payload=payload.payload,
        expires_at=row.expires_at,
    )