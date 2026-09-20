from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class EdgeConfig:
    model_path: Path = Path("models/pothole_model.pt")
    video_path: Path | None = None

    bus_id: str = "BUS-101"
    device_id: str = "EDGE-101"

    simulated_latitude: float = 13.0821
    simulated_longitude: float = 80.2691

    confidence_threshold: float = 0.5
    pothole_class_id: int = 0
    frame_stride: int = 1

    tracker_iou_threshold: float = 0.3
    tracker_max_missing: int = 2
    tracker_min_hits: int = 3

    evidence_dir: Path = Path("evidence")


DEFAULT_CONFIG = EdgeConfig()