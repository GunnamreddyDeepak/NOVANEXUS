from pathlib import Path
from typing import Any

from ultralytics import YOLO


class YOLOInference:
    """Loads and runs a real Ultralytics YOLO model."""

    def __init__(self, model_path: str | Path):
        self.model_path = Path(model_path)

        if not self.model_path.is_file():
            raise FileNotFoundError(
                f"YOLO model not found: {self.model_path}"
            )

        try:
            self.model = YOLO(str(self.model_path))
        except Exception as exc:
            raise RuntimeError(
                f"Failed to load YOLO model: {self.model_path}"
            ) from exc

    @property
    def class_names(self) -> dict[int, str]:
        names = self.model.names

        if isinstance(names, list):
            return {index: name for index, name in enumerate(names)}

        return dict(names)

    def predict(self, frame: Any) -> Any:
        """Run real YOLO inference on one frame."""
        if frame is None:
            raise ValueError("frame must not be None")

        return self.model.predict(source=frame, verbose=False)