from dataclasses import dataclass
from typing import Optional

from edge.detection import Detection


def iou(
    box_a: tuple[float, float, float, float],
    box_b: tuple[float, float, float, float],
) -> float:
    """Calculate intersection over union for two bounding boxes."""

    ax1, ay1, ax2, ay2 = box_a
    bx1, by1, bx2, by2 = box_b

    ix1 = max(ax1, bx1)
    iy1 = max(ay1, by1)
    ix2 = min(ax2, bx2)
    iy2 = min(ay2, by2)

    width = max(0.0, ix2 - ix1)
    height = max(0.0, iy2 - iy1)

    intersection = width * height

    area_a = max(0.0, ax2 - ax1) * max(0.0, ay2 - ay1)
    area_b = max(0.0, bx2 - bx1) * max(0.0, by2 - by1)

    union = area_a + area_b - intersection

    if union <= 0.0:
        return 0.0

    return intersection / union


@dataclass
class Track:
    track_id: int
    detection: Detection
    hits: int = 1
    missed: int = 0
    emitted: bool = False
    first_frame: int = 0
    last_frame: int = 0


class TemporalTracker:
    """Lightweight IoU-based tracker for temporal event validation."""

    def __init__(
        self,
        iou_threshold: float = 0.3,
        max_missing: int = 2,
        min_hits: int = 3,
    ):
        if not 0.0 <= iou_threshold <= 1.0:
            raise ValueError("iou_threshold must be between 0.0 and 1.0")

        if max_missing < 0:
            raise ValueError("max_missing must be >= 0")

        if min_hits < 1:
            raise ValueError("min_hits must be >= 1")

        self.iou_threshold = iou_threshold
        self.max_missing = max_missing
        self.min_hits = min_hits

        self._next_id = 1
        self._tracks: list[Track] = []

    @property
    def tracks(self) -> list[Track]:
        return list(self._tracks)

    def update(
        self,
        detections: list[Detection],
        frame_number: int,
    ) -> list[Track]:
        """Update tracks and return newly confirmed tracks."""

        confirmed: list[Track] = []
        matched_track_ids: set[int] = set()
        matched_detection_ids: set[int] = set()

        candidates = []

        for track in self._tracks:
            for index, detection in enumerate(detections):
                if index in matched_detection_ids:
                    continue

                score = iou(
                    track.detection.bbox,
                    detection.bbox,
                )

                if score >= self.iou_threshold:
                    candidates.append(
                        (score, track, index, detection)
                    )

        candidates.sort(
            key=lambda item: item[0],
            reverse=True,
        )

        for score, track, index, detection in candidates:
            if track.track_id in matched_track_ids:
                continue

            if index in matched_detection_ids:
                continue

            track.detection = detection
            track.hits += 1
            track.missed = 0
            track.last_frame = frame_number

            matched_track_ids.add(track.track_id)
            matched_detection_ids.add(index)

            if track.hits >= self.min_hits and not track.emitted:
                track.emitted = True
                confirmed.append(track)

        for track in self._tracks:
            if track.track_id not in matched_track_ids:
                track.missed += 1

        for index, detection in enumerate(detections):
            if index in matched_detection_ids:
                continue

            track = Track(
                track_id=self._next_id,
                detection=detection,
                first_frame=frame_number,
                last_frame=frame_number,
            )

            self._next_id += 1
            self._tracks.append(track)

        self._tracks = [
            track
            for track in self._tracks
            if track.missed <= self.max_missing
        ]

        return confirmed