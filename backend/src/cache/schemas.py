from datetime import datetime
from typing import Any

from pydantic import BaseModel


class CachedGameDetailsRead(BaseModel):
    """
    Returned by cache read paths.

    `payload` is intentionally typed as a dict so we can store combined
    """

    cache_key: str
    payload: dict[str, Any]
    expires_at: datetime

    model_config = {"from_attributes": True}


class CachedGameDetailsWrite(BaseModel):
    """
    Input DTO for cache write/upsert operations.
    """

    cache_key: str
    payload: dict[str, Any]
    expires_at: datetime
