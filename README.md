# 🚀 FreshTrack AI

AI-powered system to detect product expiry dates from images using OCR.

---

## 🧠 Features

- 📷 Upload or scan product
- 🤖 OCR-based text extraction
- 📅 Automatic expiry date detection
- 🔴 Expiry status (Expired / Safe)
- 🎨 Premium UI with animations
- 📦 Drag & drop + camera support

---

## 🏗 Tech Stack

### Frontend
- React (Vite)
- Framer Motion

### Backend
- FastAPI
- EasyOCR

---

## ⚙️ Setup

### Backend

```bash
pip install fastapi uvicorn easyocr
python -m uvicorn backend.main:app --reload --port 8001