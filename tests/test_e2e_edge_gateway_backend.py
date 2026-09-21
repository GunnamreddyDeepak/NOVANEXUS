import os
from pathlib import Path

import requests

from edge.config import EdgeConfig
from edge.pipeline import EdgePipeline
from gateway import BackendClient, EventBuffer, Gateway


def test_real_edge_gateway_backend_flow(tmp_path: Path):
    backend_url = os.getenv("BUSSENSE_BACKEND_URL")

    if not backend_url:
        raise RuntimeError(
            "BUSSENSE_BACKEND_URL must be set for the E2E integration test"
        )

    config = EdgeConfig(
        model_path=Path("models/pothole_model.pt"),
        video_path=Path("data/video/road_test.mp4"),
        confidence_threshold=0.80,
        frame_stride=1,
        evidence_dir=tmp_path / "evidence",
    )

    pipeline = EdgePipeline(config)
    events = pipeline.run()

    assert events, "Edge pipeline generated no events"

    event_buffer = EventBuffer(
        tmp_path / "pending_events.json"
    )

    backend_client = BackendClient(
        base_url=backend_url,
        timeout=10.0,
    )

    gateway = Gateway(
        backend_client=backend_client,
        event_buffer=event_buffer,
    )

    synchronized = 0

    for event in events:
        if gateway.receive_event(event):
            synchronized += 1

    assert synchronized == len(events)
    assert gateway.pending_count() == 0

    # Verify that every synchronized event is actually persisted
    # and retrievable from the real backend.
    for event in events:
        response = requests.get(
            f"{backend_url}/api/v1/events/{event['event_id']}",
            timeout=10.0,
        )

        assert response.status_code == 200

        stored_event = response.json()

        assert stored_event["event_id"] == event["event_id"]
        assert stored_event["event_type"] == event["event_type"]
        assert stored_event["bus_id"] == event["bus_id"]
        assert stored_event["device_id"] == event["device_id"]
        assert stored_event["source_type"] == event["source_type"]
