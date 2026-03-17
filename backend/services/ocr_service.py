# Prarabdha Sachan

import easyocr
import re

# load model once
reader = easyocr.Reader(['en'], gpu=False)

def extract_text(image_path):
    try:
        results = reader.readtext(image_path)
        text = " ".join([res[1] for res in results])
        print("🔍 RAW OCR:", text)
        return text.strip()
    except Exception as e:
        print("❌ OCR ERROR:", e)
        return ""

def extract_expiry(text):
    text = text.upper()

    # normalize formats
    text = re.sub(r"(\d{2})\s+(\d{2})\s+(\d{4})", r"\1/\2/\3", text)
    text = re.sub(r"(\d{2})-(\d{2})-(\d{4})", r"\1/\2/\3", text)

    print("🧹 CLEAN TEXT:", text)

    # detect date
    match = re.search(r"\b\d{2}/\d{2}/\d{4}\b", text)

    if match:
        return match.group()

    return "No expiry date found"
