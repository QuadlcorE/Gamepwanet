from typing import Annotated

from pydantic_settings import BaseSettings, NoDecode
from pydantic import field_validator

class Settings(BaseSettings):
    IGDB_CLIENT_ID: str 
    IGDB_ACCESS_TOKEN: str
    DATABASE_URL: str = "sqlite:///./gamepwanet.db"
    FRONTEND_ORIGINS: Annotated[list[str], NoDecode] = [
        "https://gamepwanet.vercel.app",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]

    # JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    @field_validator("FRONTEND_ORIGINS", mode="before")
    @classmethod
    def parse_frontend_origins(cls, value):
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value

    class Config:
        env_file = ".env"

settings = Settings()
