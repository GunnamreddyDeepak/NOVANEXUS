from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session

from ..database import SessionLocal
from ..schemas import Event
from .. import repository


router = APIRouter()


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


def event_matches(existing, event):
    return (
        existing.schema_version == event.schema_version
        and existing.event_id == event.event_id
        and existing.event_type == event.event_type
        and existing.sub_type == event.sub_type
        and existing.confidence == event.confidence
        and existing.severity == event.severity
        and existing.bus_id == event.bus_id
        and existing.device_id == event.device_id
        and existing.observed_at == event.observed_at.replace(tzinfo=None)
        and existing.latitude == event.latitude
        and existing.longitude == event.longitude
        and existing.source_type == event.source_type
        and existing.status == event.status
        and existing.evidence == event.evidence
        and existing.event_metadata == event.metadata
    )


@router.post("/api/v1/events", status_code=201)
def create_event(
    event: Event,
    db: Session = Depends(get_db)
):

    existing = repository.get_event(db, event.event_id)

    if existing:

        if event_matches(existing, event):

            return JSONResponse(
                status_code=200,
                content={
                    "success": True,
                    "event_id": event.event_id,
                    "created": False,
                    "status": existing.status
                }
            )

        raise HTTPException(
            status_code=409,
            detail="Event ID already exists with different data"
        )

    repository.create_event(db, event)

    return {
        "success": True,
        "event_id": event.event_id,
        "created": True,
        "status": event.status
    }


@router.get("/api/v1/events/{event_id}")
def get_event(
    event_id: str,
    db: Session = Depends(get_db)
):

    event = repository.get_event(db, event_id)

    if not event:
        raise HTTPException(
            status_code=404,
            detail="Event not found"
        )

    return Event(
        schema_version=event.schema_version,
        event_id=event.event_id,
        event_type=event.event_type,
        sub_type=event.sub_type,
        confidence=event.confidence,
        severity=event.severity,
        bus_id=event.bus_id,
        device_id=event.device_id,
        observed_at=event.observed_at,
        latitude=event.latitude,
        longitude=event.longitude,
        source_type=event.source_type,
        status=event.status,
        evidence=event.evidence,
        metadata=event.event_metadata,
    )


@router.get("/api/v1/events")
def get_events(
    db: Session = Depends(get_db)
):

    events = repository.get_events(db)

    return {
        "success": True,
        "events": [
            Event(
                schema_version=event.schema_version,
                event_id=event.event_id,
                event_type=event.event_type,
                sub_type=event.sub_type,
                confidence=event.confidence,
                severity=event.severity,
                bus_id=event.bus_id,
                device_id=event.device_id,
                observed_at=event.observed_at,
                latitude=event.latitude,
                longitude=event.longitude,
                source_type=event.source_type,
                status=event.status,
                evidence=event.evidence,
                metadata=event.event_metadata,
            )
            for event in events
        ]
    }