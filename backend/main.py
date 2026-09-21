from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from backend.database import Base, engine
from backend.routers import events, health


# Create database tables
Base.metadata.create_all(bind=engine)


# Create FastAPI application
app = FastAPI(
    title="BUSSENSE Backend",
)


# Allow the Vite frontend to communicate with the backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# API routers
app.include_router(health.router)
app.include_router(events.router)


# ---------------------------------------------------------------------------
# Evidence delivery
# ---------------------------------------------------------------------------

EVIDENCE_DIR = Path("evidence").resolve()


@app.get("/api/v1/evidence/{filename}")
def get_evidence(filename: str):
    """Return a locally captured Edge evidence image."""

    # Keep the prototype endpoint restricted to image filenames.
    allowed_extensions = {".jpg", ".jpeg", ".png", ".webp"}

    evidence_path = (EVIDENCE_DIR / filename).resolve()

    # Prevent path traversal outside the evidence directory.
    if EVIDENCE_DIR not in evidence_path.parents:
        raise HTTPException(
            status_code=400,
            detail="Invalid evidence path",
        )

    if evidence_path.suffix.lower() not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail="Unsupported evidence format",
        )

    if not evidence_path.is_file():
        raise HTTPException(
            status_code=404,
            detail="Evidence file not found",
        )

    return FileResponse(evidence_path)