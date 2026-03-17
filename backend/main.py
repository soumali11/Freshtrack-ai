# Prarabdha Sachan

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import upload

app = FastAPI()

# ✅ CORS (VERY IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# routes
app.include_router(upload.router)

@app.get("/")
def home():
    return {"message": "FreshTrack AI Backend Running"}