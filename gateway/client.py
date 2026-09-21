import os
from typing import Any

import requests


class BackendClient:
    """HTTP client used by the bus-side gateway to deliver events."""

    def __init__(
        self,
        base_url: str | None = None,
        timeout: float = 5.0,
    ):
        self.base_url = (
            base_url
            or os.getenv("BUSSENSE_BACKEND_URL")
            or "http://127.0.0.1:8000"
        ).rstrip("/")

        self.timeout = timeout

    def send_event(self, event: dict[str, Any]) -> bool:
        """Send one canonical event to the backend.

        Returns True when the backend accepts the event.
        Returns False when delivery fails and the event should remain buffered.
        """

        try:
            response = requests.post(
                f"{self.base_url}/api/v1/events",
                json=event,
                timeout=self.timeout,
            )

            # 201 = newly created
            # 200 = duplicate identical event already accepted
            if response.status_code in (200, 201):
                return True

            return False

        except requests.RequestException:
            return False
