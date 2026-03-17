#soumali(FreshTrack AI Backend)

from fastapi import FastAPI
from backend.routes import upload, inventory

app = FastAPI()

# include routes
app.include_router(upload.router)
app.include_router(inventory.router)

@app.get("/")
def home():
    return {"message": "FreshTrack AI Backend Running"}