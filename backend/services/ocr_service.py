# Prarabdha Sachan

import easyocr
import re

# Load model once (IMPORTANT)
reader = easyocr.Reader(['en'], gpu=False)


def extract_text(image_path):
    try:
        results = reader.readtext(image_path)

        # Join detected text
        text = " ".join([res[1] for res in results])

        print("🧠 RAW OCR:", text)

        return text.strip()

    except Exception as e:
        print("❌ OCR ERROR:", e)
        return ""


def extract_expiry(text):
    if not text:
        return "No expiry date found"

    print("🔍 TEXT BEFORE FIX:", text)

    text = text.upper()

    # ✅ Fix broken formats
    text = re.sub(r"(\d{2})\s+(\d{2})\s+(\d{4})", r"\1/\2/\3", text)
    text = re.sub(r"(\d{2})\s+(\d{2}/\d{4})", r"\1/\2", text)
    text = re.sub(r"(\d{2}/\d{2})\s+(\d{4})", r"\1/\2", text)

    print("✅ TEXT AFTER FIX:", text)

    # ✅ Strong detection
    match = re.search(r"\b\d{2}/\d{2}/\d{4}\b", text)
    if match:
        return match.group()

    return "No expiry date found"
