from sqlalchemy.orm import Session

from .models import EventModel
from .schemas import Event


def create_event(db: Session, event: Event):
    data = event.model_dump()

    data["event_metadata"] = data.pop("metadata")

    db_event = EventModel(**data)

    db.add(db_event)
    db.commit()
    db.refresh(db_event)

    return db_event


def get_event(db: Session, event_id: str):
    return (
        db.query(EventModel)
        .filter(EventModel.event_id == event_id)
        .first()
    )


def get_events(db: Session):
    return db.query(EventModel).all()