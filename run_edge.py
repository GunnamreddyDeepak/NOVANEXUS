from pathlib import Path

from edge.config import EdgeConfig
from edge.pipeline import EdgePipeline


config = EdgeConfig(
    model_path=Path("models/pothole_model.pt"),
    video_path=Path("data/video/road_test.mp4"),
    confidence_threshold=0.80,
    frame_stride=1,
    evidence_dir=Path("evidence"),
)

pipeline = EdgePipeline(config)

events = pipeline.run()

print(f"Events generated: {len(events)}")

for event in events[:10]:
    print(event)