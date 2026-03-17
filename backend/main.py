import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes import upload 

app = FastAPI()

# Enable CORS so your React frontend can connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the upload routes
app.include_router(upload.router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "Backend is LIVE"}