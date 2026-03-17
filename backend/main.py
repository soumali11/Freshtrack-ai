import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes import upload # Ensure this path matches your folder!

app = FastAPI()

# THIS IS CRITICAL: It tells the backend to trust your React app
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Backend is LIVE"}