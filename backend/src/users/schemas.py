from pydantic import BaseModel


class GameListItemCreate(BaseModel):
    game_id: int
    game_slug: str
    game_name: str
    game_background_image: str | None = None


class GameListItemDelete(BaseModel):
    game_id: int


class GameListActionResponse(BaseModel):
    message: str
    game_id: int


class UserProfileResponse(BaseModel):
    favorite_ids: list[int]
    wishlist_ids: list[int]
