def get_event_data(event_id="TEST-001"):
    return {
        "schema_version": "1.0",
        "event_id": event_id,
        "event_type": "ROAD_DAMAGE",
        "sub_type": "POTHOLE",
        "confidence": 87.4,
        "severity": "HIGH",
        "bus_id": "BUS-101",
        "device_id": "EDGE-101",
        "observed_at": "2026-09-20T11:45:00Z",
        "latitude": 13.0821,
        "longitude": 80.2691,
        "source_type": "SIMULATED_EDGE",
        "status": "DETECTED",
        "evidence": {},
        "metadata": {}
    }


def test_create_event(client):

    response = client.post(
        "/api/v1/events",
        json=get_event_data()
    )

    assert response.status_code == 201

    data = response.json()

    assert data["success"] is True
    assert data["event_id"] == "TEST-001"
    assert data["created"] is True
    assert data["status"] == "DETECTED"


def test_get_event(client):

    event = get_event_data("TEST-002")

    client.post(
        "/api/v1/events",
        json=event
    )

    response = client.get("/api/v1/events/TEST-002")

    assert response.status_code == 200


def test_get_missing_event(client):

    response = client.get("/api/v1/events/NOT-FOUND")

    assert response.status_code == 404


def test_get_events(client):

    event = get_event_data("TEST-003")

    client.post(
        "/api/v1/events",
        json=event
    )

    response = client.get("/api/v1/events")

    assert response.status_code == 200


def test_duplicate_event(client):

    event = get_event_data("TEST-DUPLICATE")

    first_response = client.post(
        "/api/v1/events",
        json=event
    )

    assert first_response.status_code == 201

    second_response = client.post(
        "/api/v1/events",
        json=event
    )

    assert second_response.status_code == 200

    data = second_response.json()

    assert data["success"] is True
    assert data["event_id"] == "TEST-DUPLICATE"
    assert data["created"] is False
    assert data["status"] == "DETECTED"


def test_changed_duplicate(client):

    event = get_event_data("TEST-CHANGED")

    first_response = client.post(
        "/api/v1/events",
        json=event
    )

    assert first_response.status_code == 201

    event["severity"] = "MEDIUM"

    second_response = client.post(
        "/api/v1/events",
        json=event
    )

    assert second_response.status_code == 409


def test_invalid_event(client):

    event = get_event_data("TEST-INVALID")

    event["confidence"] = "invalid"

    response = client.post(
        "/api/v1/events",
        json=event
    )

    assert response.status_code == 422