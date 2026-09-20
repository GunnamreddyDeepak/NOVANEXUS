from fastapi import APIRouter

router = APIRouter()


@router.get("/api/v1/health")
def health():
    return {
        "status": "ok",
        "service": "bussense-api",
        "version": "v1"
    }