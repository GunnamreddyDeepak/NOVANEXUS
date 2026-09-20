from datetime import datetime, timezone
from pathlib import Path
from typing import Any
from uuid import uuid4


def create_event(
    *,
    confidence: float,
    bus_id: str,
    device_id: str,
    latitude: float,
    longitude: float,
    evidence_image: Path | str,
    model_name: str,
    gps_source: str = "SIMULATED_GPS",
) -> dict[str, Any]:
    """Build a canonical BUSSENSE ROAD_DAMAGE/POTHOLE event."""

    if not 0.0 <= confidence <= 1.0:
        raise ValueError("confidence must be between 0.0 and 1.0")

    if gps_source != "SIMULATED_GPS":
        raise ValueError(
            "Prototype event builder requires gps_source=SIMULATED_GPS"
        )

    evidence_path = Path(evidence_image).as_posix()

    event_id = f"EVT-{uuid4().hex[:12].upper()}"

    return {
        "schema_version": "1.0",
        "event_id": event_id,
        "event_type": "ROAD_DAMAGE",
        "sub_type": "POTHOLE",
        "confidence": round(confidence * 100, 2),
        "severity": "HIGH" if confidence >= 0.8 else "MEDIUM",
        "bus_id": bus_id,
        "device_id": device_id,
        "observed_at": datetime.now(timezone.utc).isoformat(),
        "latitude": latitude,
        "longitude": longitude,
        "source_type": "SIMULATED_EDGE",
        "status": "DETECTED",
        "evidence": {
            "image_ref": evidence_path,
            "video_ref": None,
        },
        "metadata": {
            "gps_source": gps_source,
            "model_name": model_name,
        },
    }