from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class Event(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    schema_version: str
    event_id: str
    event_type: str
    sub_type: str | None = None

    # Canonical BUSSENSE confidence:
    # percentage value from 0 to 100.
    confidence: float = Field(
        ge=0.0,
        le=100.0,
        description="Detection confidence as a percentage from 0 to 100",
    )

    severity: str
    bus_id: str
    device_id: str
    observed_at: datetime
    latitude: float
    longitude: float
    source_type: str
    status: str
    evidence: dict
    metadata: dict