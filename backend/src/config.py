from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    RAWG_API_KEY: str
    RAWG_BASE_URL: str = "https://api.rawg.io/api"
    DATABASE_URL: str = "sqlite:///./gamepwanet.db"

    # JWT
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    class Config:
        env_file = ".env"

settings = Settings()