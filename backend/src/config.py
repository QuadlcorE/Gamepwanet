from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    IGDB_CLIENT_ID: str 
    IGDB_ACCESS_TOKEN: str
    DATABASE_URL: str = "sqlite:///./gamepwanet.db"

    # JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"

settings = Settings()
