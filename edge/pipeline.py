from typing import Any

import cv2

from edge.config import EdgeConfig
from edge.detection import normalize_detections, filter_potholes
from edge.event import create_event
from edge.inference import YOLOInference
from edge.tracking import TemporalTracker
from edge.video import RecordedVideoProvider


class EdgePipeline:
    """End-to-end Edge AI pipeline for pothole detection."""

    def __init__(self, config: EdgeConfig):
        self.config = config

        if config.video_path is None:
            raise ValueError("video_path must be configured")

        self.video_provider = RecordedVideoProvider(
            config.video_path,
            frame_stride=config.frame_stride,
        )

        self.inference = YOLOInference(config.model_path)

        self.tracker = TemporalTracker(
            iou_threshold=config.tracker_iou_threshold,
            max_missing=config.tracker_max_missing,
            min_hits=config.tracker_min_hits,
        )

        self.config.evidence_dir.mkdir(
            parents=True,
            exist_ok=True,
        )

    def run(self) -> list[dict[str, Any]]:
        """Run inference, temporal validation, and event generation."""

        events: list[dict[str, Any]] = []

        for frame_number, frame in enumerate(
            self.video_provider.frames()
        ):
            results = self.inference.predict(frame)

            detections = normalize_detections(
                results,
                self.inference.class_names,
            )

            potholes = filter_potholes(
                detections,
                confidence_threshold=self.config.confidence_threshold,
                pothole_class_id=self.config.pothole_class_id,
            )

            confirmed_tracks = self.tracker.update(
                potholes,
                frame_number,
            )

            for track in confirmed_tracks:
                detection = track.detection

                x1, y1, x2, y2 = map(
                    int,
                    detection.bbox,
                )

                height, width = frame.shape[:2]

                x1 = max(0, min(x1, width - 1))
                y1 = max(0, min(y1, height - 1))
                x2 = max(0, min(x2, width - 1))
                y2 = max(0, min(y2, height - 1))

                evidence_frame = frame.copy()

                cv2.rectangle(
                    evidence_frame,
                    (x1, y1),
                    (x2, y2),
                    (0, 255, 0),
                    3,
                )

                label = (
                    f"POTHOLE "
                    f"{detection.confidence * 100:.1f}% "
                    f"TRACK {track.track_id}"
                )

                cv2.putText(
                    evidence_frame,
                    label,
                    (x1, max(30, y1 - 10)),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.8,
                    (0, 255, 0),
                    2,
                    cv2.LINE_AA,
                )

                evidence_name = (
                    f"pothole_track_{track.track_id:04d}.jpg"
                )

                evidence_path = (
                    self.config.evidence_dir / evidence_name
                )

                saved = cv2.imwrite(
                    str(evidence_path),
                    evidence_frame,
                )

                if not saved:
                    raise RuntimeError(
                        f"Failed to save evidence: {evidence_path}"
                    )

                event = create_event(
                    confidence=detection.confidence,
                    bus_id=self.config.bus_id,
                    device_id=self.config.device_id,
                    latitude=self.config.simulated_latitude,
                    longitude=self.config.simulated_longitude,
                    evidence_image=evidence_path,
                    model_name=self.config.model_path.name,
                )

                event["metadata"]["track_id"] = track.track_id
                event["metadata"]["first_frame"] = track.first_frame
                event["metadata"]["last_frame"] = track.last_frame
                event["metadata"]["detection_hits"] = track.hits
                event["metadata"]["bbox"] = detection.bbox
                event["metadata"]["class_id"] = detection.class_id

                events.append(event)

        return events