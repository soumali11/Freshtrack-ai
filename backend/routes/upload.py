# Prarabdha Sachan

from fastapi import APIRouter, UploadFile, File
import os
from backend.services.ocr_service import extract_text, extract_expiry

router = APIRouter()

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    # Save file
    file_path = os.path.join("backend", f"temp_{file.filename}")

    with open(file_path, "wb") as buffer:
        content = await file.read()
        buffer.write(content)

    print("📁 FILE SAVED AT:", file_path)

    # OCR processing
    text = extract_text(file_path)

    print("🧠 RAW OCR:", text if text else "EMPTY")

    # Extract expiry
    expiry = extract_expiry(text)

    print("📅 EXPIRY DETECTED:", expiry)

    # Response
    return {
        "filename": file.filename,
        "extracted_text": text,
        "expiry_date": expiry
    }