from fastapi import APIRouter, UploadFile, File, HTTPException
import os
import shutil
# ✅ This matches the function name in your ocr_service.py
from backend.services.ocr_service import extract_text, extract_expiry 

router = APIRouter()

@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    os.makedirs("uploads", exist_ok=True)
    file_path = os.path.join("uploads", file.filename)
    
    try:
        # Save the uploaded file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # ✅ 1. Get raw text from image
        raw_text = extract_text(file_path)
        
        # ✅ 2. Extract date from that text
        detected_date = extract_expiry(raw_text)
        
        return {"expiry_date": detected_date if detected_date else "Not Detected"}

    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
    finally:
        if os.path.exists(file_path):
            os.remove(file_path)