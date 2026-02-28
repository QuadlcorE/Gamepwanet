from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .games import router as games_router

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(games_router.router)

@app.get("/")
def root():
    return {"message": "Making sure this works!"}
