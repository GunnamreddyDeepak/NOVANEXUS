from abc import ABC, abstractmethod
from pathlib import Path
from typing import Iterator

import cv2
import numpy as np


class FrameProvider(ABC):
    """Hardware-independent source of video frames."""

    @abstractmethod
    def frames(self) -> Iterator[np.ndarray]:
        """Yield frames as OpenCV BGR images."""
        raise NotImplementedError


class RecordedVideoProvider(FrameProvider):
    """Frame provider backed by a recorded video file."""

    def __init__(self, video_path: str | Path, frame_stride: int = 1):
        self.video_path = Path(video_path)
        self.frame_stride = frame_stride

        if self.frame_stride < 1:
            raise ValueError("frame_stride must be >= 1")

        if not self.video_path.is_file():
            raise FileNotFoundError(
                f"Video file not found: {self.video_path}"
            )

    def frames(self) -> Iterator[np.ndarray]:
        capture = cv2.VideoCapture(str(self.video_path))

        if not capture.isOpened():
            raise ValueError(
                f"Unable to open video: {self.video_path}"
            )

        try:
            frame_index = 0

            while True:
                success, frame = capture.read()

                if not success:
                    break

                if frame_index % self.frame_stride == 0:
                    yield frame

                frame_index += 1

        finally:
            capture.release()