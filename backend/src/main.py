import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .games import router as games_router
from .users import router as user_router
from .auth import router as auth_router
from .database import Base, engine
from .errors import IGDBError, igdb_error_handler

# Import models so SQLAlchemy registers them with Base before create_all
from .auth import models as auth_models  # noqa: F401
from .users import models as user_models  # noqa: F401
from .cache import models as cache_models  # noqa: F401

# logging.basicConfig(
#     level=logging.DEBUG,
#     format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
#     handlers=[
#         logging.StreamHandler(),
#     ]
# )

# Create all tables on startup
Base.metadata.create_all(bind=engine)

app = FastAPI(
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)
app.add_exception_handler(IGDBError, igdb_error_handler)

origins = settings.FRONTEND_ORIGINS


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(games_router.router)
app.include_router(user_router.router)
app.include_router(user_router.profile_router)
app.include_router(auth_router.router)

# Vercel forwards requests with /api prefix; keep local routes without prefix too.
app.include_router(games_router.router, prefix="/api")
app.include_router(user_router.router, prefix="/api")
app.include_router(user_router.profile_router, prefix="/api")
app.include_router(auth_router.router, prefix="/api")
