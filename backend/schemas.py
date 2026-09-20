from datetime import datetime

from pydantic import BaseModel, ConfigDict


class Event(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    schema_version: str
    event_id: str
    event_type: str
    sub_type: str | None = None
    confidence: float
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