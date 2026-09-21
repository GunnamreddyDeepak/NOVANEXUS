from pathlib import Path

from gateway.buffer import EventBuffer
from gateway.gateway import Gateway


EVENT = {
    "schema_version": "1.0",
    "event_id": "EVT-GATEWAY-001",
    "event_type": "ROAD_DAMAGE",
    "sub_type": "POTHOLE",
    "confidence": 85.0,
    "severity": "HIGH",
    "bus_id": "BUS-101",
    "device_id": "EDGE-101",
    "observed_at": "2026-09-21T10:00:00+00:00",
    "latitude": 13.0821,
    "longitude": 80.2691,
    "source_type": "SIMULATED_EDGE",
    "status": "DETECTED",
    "evidence": {
        "image_ref": "evidence/test.jpg",
        "video_ref": None,
    },
    "metadata": {
        "gps_source": "SIMULATED_GPS",
        "model_name": "pothole_model.pt",
    },
}


class FakeBackendClient:
    def __init__(self, result: bool):
        self.result = result
        self.sent_events = []

    def send_event(self, event):
        self.sent_events.append(event)
        return self.result


def test_event_is_buffered_when_backend_is_unavailable(tmp_path: Path):
    buffer = EventBuffer(tmp_path / "pending.json")
    backend = FakeBackendClient(False)

    gateway = Gateway(
        backend_client=backend,
        event_buffer=buffer,
    )

    result = gateway.receive_event(EVENT)

    assert result is False
    assert gateway.pending_count() == 1
    assert buffer.get_all()[0]["event_id"] == "EVT-GATEWAY-001"


def test_event_is_removed_after_successful_sync(tmp_path: Path):
    buffer = EventBuffer(tmp_path / "pending.json")
    backend = FakeBackendClient(True)

    gateway = Gateway(
        backend_client=backend,
        event_buffer=buffer,
    )

    result = gateway.receive_event(EVENT)

    assert result is True
    assert gateway.pending_count() == 0
    assert backend.sent_events[0]["event_id"] == "EVT-GATEWAY-001"


def test_retry_synchronizes_pending_event(tmp_path: Path):
    buffer = EventBuffer(tmp_path / "pending.json")
    backend = FakeBackendClient(False)

    gateway = Gateway(
        backend_client=backend,
        event_buffer=buffer,
    )

    gateway.receive_event(EVENT)

    assert gateway.pending_count() == 1

    backend.result = True

    synchronized = gateway.sync_pending()

    assert synchronized == 1
    assert gateway.pending_count() == 0


def test_duplicate_event_is_not_buffered_twice(tmp_path: Path):
    buffer = EventBuffer(tmp_path / "pending.json")
    backend = FakeBackendClient(False)

    gateway = Gateway(
        backend_client=backend,
        event_buffer=buffer,
    )

    gateway.receive_event(EVENT)
    gateway.receive_event(EVENT)

    assert gateway.pending_count() == 1

def test_event_survives_backend_outage_and_syncs_after_recovery(tmp_path: Path):
    buffer = EventBuffer(tmp_path / "pending.json")

    # Backend is initially unavailable.
    backend = FakeBackendClient(False)

    gateway = Gateway(
        backend_client=backend,
        event_buffer=buffer,
    )

    result = gateway.receive_event(EVENT)

    assert result is False
    assert gateway.pending_count() == 1

    # Backend recovers.
    backend.result = True

    synchronized = gateway.sync_pending()

    assert synchronized == 1
    assert gateway.pending_count() == 0
    assert backend.sent_events[-1]["event_id"] == "EVT-GATEWAY-001"
