from dataclasses import dataclass
from typing import Any


@dataclass(frozen=True)
class Detection:
    """Normalized model detection."""

    class_id: int
    class_name: str
    confidence: float
    bbox: tuple[float, float, float, float]


def normalize_detections(
    results: Any,
    class_names: dict[int, str],
) -> list[Detection]:
    """Convert Ultralytics results into stable BUSSENSE detections."""

    detections: list[Detection] = []

    for result in results:
        boxes = getattr(result, "boxes", None)

        if boxes is None:
            continue

        for box in boxes:
            class_id = int(box.cls.item())
            confidence = float(box.conf.item())

            coordinates = box.xyxy[0].tolist()
            bbox = tuple(float(value) for value in coordinates)

            detections.append(
                Detection(
                    class_id=class_id,
                    class_name=class_names.get(
                        class_id,
                        str(class_id),
                    ),
                    confidence=confidence,
                    bbox=bbox,
                )
            )

    return detections


def filter_potholes(
    detections: list[Detection],
    confidence_threshold: float = 0.5,
    pothole_class_id: int = 0,
) -> list[Detection]:
    """Return model detections explicitly mapped to potholes."""

    return [
        detection
        for detection in detections
        if detection.class_id == pothole_class_id
        and detection.confidence >= confidence_threshold
    ]