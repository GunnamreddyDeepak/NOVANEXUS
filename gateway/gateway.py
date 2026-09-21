from typing import Any

from .buffer import EventBuffer
from .client import BackendClient


class Gateway:
    """Bus-side event gateway.

    Events are always persisted locally before synchronization is attempted.
    An event is removed from the buffer only after backend acceptance.
    """

    def __init__(
        self,
        backend_client: BackendClient | None = None,
        event_buffer: EventBuffer | None = None,
    ):
        self.backend_client = backend_client or BackendClient()
        self.event_buffer = event_buffer or EventBuffer()

    def receive_event(self, event: dict[str, Any]) -> bool:
        """Receive an event and attempt immediate synchronization.

        The event is first stored locally. This guarantees that a backend
        outage does not cause event loss.
        """

        self.event_buffer.add(event)

        return self.sync_event(event)

    def sync_event(self, event: dict[str, Any]) -> bool:
        """Attempt to synchronize one buffered event."""

        event_id = event["event_id"]

        success = self.backend_client.send_event(event)

        if success:
            self.event_buffer.remove(event_id)
            return True

        return False

    def sync_pending(self) -> int:
        """Retry all currently buffered events.

        Returns the number of events successfully synchronized.
        """

        synchronized = 0

        for event in self.event_buffer.get_all():
            if self.sync_event(event):
                synchronized += 1

        return synchronized

    def pending_count(self) -> int:
        return self.event_buffer.count()
