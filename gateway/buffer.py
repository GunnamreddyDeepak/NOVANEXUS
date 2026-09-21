import json
from pathlib import Path
from typing import Any


class EventBuffer:
    """Simple persistent JSON-file buffer for unsynchronized events."""

    def __init__(self, path: Path | str = "gateway/data/pending_events.json"):
        self.path = Path(path)
        self.path.parent.mkdir(parents=True, exist_ok=True)

    def _read(self) -> list[dict[str, Any]]:
        if not self.path.exists():
            return []

        try:
            with self.path.open("r", encoding="utf-8") as file:
                data = json.load(file)

            if not isinstance(data, list):
                raise ValueError("Event buffer must contain a JSON list")

            return data

        except (json.JSONDecodeError, ValueError):
            return []

    def _write(self, events: list[dict[str, Any]]) -> None:
        temporary_path = self.path.with_suffix(".tmp")

        with temporary_path.open("w", encoding="utf-8") as file:
            json.dump(events, file, indent=2)

        temporary_path.replace(self.path)

    def add(self, event: dict[str, Any]) -> None:
        events = self._read()

        event_id = event.get("event_id")

        # Do not buffer the same event twice.
        if any(existing.get("event_id") == event_id for existing in events):
            return

        events.append(event)
        self._write(events)

    def get_all(self) -> list[dict[str, Any]]:
        return self._read()

    def remove(self, event_id: str) -> None:
        events = self._read()
        remaining = [
            event
            for event in events
            if event.get("event_id") != event_id
        ]

        self._write(remaining)

    def count(self) -> int:
        return len(self._read())

    def clear(self) -> None:
        self._write([])
