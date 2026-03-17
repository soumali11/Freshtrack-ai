from fastapi import APIRouter

router = APIRouter()

@router.get("/inventory")
def get_inventory():
    return {
        "items": [],
        "message": "Inventory is empty (for now)"
    }