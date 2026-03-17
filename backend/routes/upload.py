from fastapi import APIRouter, UploadFile, File, HTTPException
import os
# Import your OCR service - make sure this file exists!
from backend.services.ocr_service import extract_expiry_date 

router = APIRouter()

@router.post("/upload")
async def upload_image(file: UploadFile = File(...)):
    # 1. Ensure uploads folder exists
    upload_dir = "uploads"
    if not os.path.exists(upload_dir):
        os.makedirs(upload_dir)

    file_path = os.path.join(upload_dir, file.filename)
    
    try:
        # 2. Save the uploaded file
        content = await file.read()
        with open(file_path, "wb") as f:
            f.write(content)

        # 3. CALL REAL AI (No more hardcoded dates!)
        # This will now attempt to read "03/10/24" from your milk bottle
        detected_date = extract_expiry_date(file_path)
        
        if not detected_date:
            return {"expiry_date": None, "error": "No date detected"}

        return {"expiry_date": detected_date}

    except Exception as e:
        print(f"Backend Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
    finally:
        # Clean up the file after processing to save space
        if os.path.exists(file_path):
            os.remove(file_path)