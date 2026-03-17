# Prarabdha Sachan

from fastapi import APIRouter, UploadFile, File
import os
from backend.services.ocr_service import extract_text, extract_expiry

router = APIRouter()

UPLOAD_DIR = "backend/uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        file_path = os.path.join(UPLOAD_DIR, f"temp_{file.filename}")

        # save file
        with open(file_path, "wb") as buffer:
            content = await file.read()
            buffer.write(content)

        print("📁 FILE SAVED:", file_path)

        # OCR
        text = extract_text(file_path)
        print("🧠 OCR TEXT:", text if text else "EMPTY")

        # expiry extraction
        expiry = extract_expiry(text)
        print("📅 EXPIRY:", expiry)

        return {
            "filename": file.filename,
            "extracted_text": text,
            "expiry_date": expiry
        }

    except Exception as e:
        print("❌ ERROR:", e)
        return {"error": str(e)}