from sqlalchemy import Column, String, Float, DateTime, JSON

from .database import Base


class EventModel(Base):
    __tablename__ = "events"

    event_id = Column(String, primary_key=True, index=True)

    schema_version = Column(String, nullable=False)
    event_type = Column(String, nullable=False)
    sub_type = Column(String, nullable=True)

    confidence = Column(Float, nullable=False)
    severity = Column(String, nullable=False)

    bus_id = Column(String, nullable=False)
    device_id = Column(String, nullable=False)

    observed_at = Column(DateTime, nullable=False)

    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)

    source_type = Column(String, nullable=False)
    status = Column(String, nullable=False)

    evidence = Column(JSON, nullable=False)

    event_metadata = Column(
        "metadata",
        JSON,
        nullable=False
    )