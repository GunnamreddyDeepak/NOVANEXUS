from pathlib import Path

import pytest

from edge.config import EdgeConfig
from edge.detection import Detection, filter_potholes
from edge.event import create_event
from edge.inference import YOLOInference
from edge.tracking import TemporalTracker, iou
from edge.video import FrameProvider, RecordedVideoProvider


def test_frame_provider_is_abstract():
    assert issubclass(RecordedVideoProvider, FrameProvider)


def test_recorded_video_missing_input():
    with pytest.raises(FileNotFoundError):
        RecordedVideoProvider("missing-video.mp4")


def test_invalid_frame_stride():
    with pytest.raises(ValueError):
        RecordedVideoProvider(
            "missing-video.mp4",
            frame_stride=0,
        )


def test_detection_normalization():
    detection = Detection(
        class_id=3,
        class_name="pothole",
        confidence=0.91,
        bbox=(10.0, 20.0, 100.0, 200.0),
    )

    assert detection.class_id == 3
    assert detection.class_name == "pothole"
    assert detection.confidence == 0.91
    assert detection.bbox == (
        10.0,
        20.0,
        100.0,
        200.0,
    )


def test_pothole_filtering():
    detections = [
        Detection(
            0,
            "pothole",
            0.91,
            (1, 2, 3, 4),
        ),
        Detection(
            1,
            "car",
            0.99,
            (5, 6, 7, 8),
        ),
        Detection(
            0,
            "pothole",
            0.30,
            (9, 10, 11, 12),
        ),
    ]

    potholes = filter_potholes(
        detections,
        0.5,
        pothole_class_id=0,
    )

    assert len(potholes) == 1
    assert potholes[0].class_name == "pothole"
    assert potholes[0].confidence == 0.91


def test_no_pothole_means_no_event():
    detections = [
        Detection(
            1,
            "car",
            0.99,
            (1, 2, 3, 4),
        ),
    ]

    assert filter_potholes(
        detections,
        0.5,
        pothole_class_id=0,
    ) == []


def test_canonical_event_structure():
    event = create_event(
        confidence=0.91,
        bus_id="BUS-101",
        device_id="EDGE-101",
        latitude=13.0821,
        longitude=80.2691,
        evidence_image="evidence/EVT-test.jpg",
        model_name="pothole-model",
    )

    assert event["schema_version"] == "1.0"
    assert event["event_id"].startswith("EVT-")
    assert event["event_type"] == "ROAD_DAMAGE"
    assert event["sub_type"] == "POTHOLE"
    assert event["confidence"] == 91.0
    assert event["bus_id"] == "BUS-101"
    assert event["device_id"] == "EDGE-101"
    assert "observed_at" in event
    assert "timestamp" not in event
    assert event["source_type"] == "SIMULATED_EDGE"
    assert event["status"] == "DETECTED"

    assert event["evidence"]["image_ref"] == "evidence/EVT-test.jpg"
    assert event["evidence"]["video_ref"] is None

    assert "image" not in event["evidence"]
    assert "video" not in event["evidence"]


def test_simulated_gps_consistency():
    event = create_event(
        confidence=0.85,
        bus_id="BUS-101",
        device_id="EDGE-101",
        latitude=13.0821,
        longitude=80.2691,
        evidence_image="evidence/EVT-test.jpg",
        model_name="pothole-model",
    )

    assert event["latitude"] == 13.0821
    assert event["longitude"] == 80.2691
    assert event["metadata"]["gps_source"] == "SIMULATED_GPS"


def test_invalid_confidence():
    with pytest.raises(ValueError):
        create_event(
            confidence=1.5,
            bus_id="BUS-101",
            device_id="EDGE-101",
            latitude=13.0821,
            longitude=80.2691,
            evidence_image="evidence/test.jpg",
            model_name="pothole-model",
        )


def test_invalid_gps_source():
    with pytest.raises(ValueError):
        create_event(
            confidence=0.9,
            bus_id="BUS-101",
            device_id="EDGE-101",
            latitude=13.0821,
            longitude=80.2691,
            evidence_image="evidence/test.jpg",
            model_name="pothole-model",
            gps_source="HARDWARE_GPS",
        )


def test_missing_model():
    with pytest.raises(FileNotFoundError):
        YOLOInference(Path("models/missing.pt"))


def test_iou_identical_boxes():
    assert iou(
        (0, 0, 100, 100),
        (0, 0, 100, 100),
    ) == 1.0


def test_temporal_tracker_requires_multiple_hits():
    tracker = TemporalTracker(
        iou_threshold=0.3,
        max_missing=2,
        min_hits=3,
    )

    detection = Detection(
        0,
        "0",
        0.9,
        (10, 10, 100, 100),
    )

    assert tracker.update([detection], 0) == []
    assert tracker.update([detection], 1) == []

    confirmed = tracker.update(
        [detection],
        2,
    )

    assert len(confirmed) == 1
    assert confirmed[0].hits == 3


def test_temporal_tracker_emits_track_only_once():
    tracker = TemporalTracker(
        iou_threshold=0.3,
        max_missing=2,
        min_hits=2,
    )

    detection = Detection(
        0,
        "0",
        0.9,
        (10, 10, 100, 100),
    )

    assert tracker.update([detection], 0) == []
    assert len(tracker.update([detection], 1)) == 1
    assert tracker.update([detection], 2) == []