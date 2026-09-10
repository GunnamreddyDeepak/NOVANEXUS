# BUSSENSE V2 — Event Contract

## 1. Purpose

The BUSSENSE Event is the canonical communication object between Edge AI, Event Intelligence, Edge Gateway, Central API, Event Store, Fusion, Analytics and the GIS Control Tower.

All meaningful observations that cross a module boundary must use this contract.

## 2. Ownership

- Edge/Event Intelligence creates the original observation.
- Gateway transports the observation without changing its meaning.
- Backend validates and persists it.
- Fusion/Analytics derive higher-level records from observations.
- Original observations remain immutable for traceability.
- System-managed processing state may be updated by the Backend/Fusion layers.

## 3. Canonical Schema

```json
{
  "schema_version": "1.0",
  "event_id": "EVT-550e8400-e29b-41d4-a716-446655440000",
  "event_type": "ROAD_DAMAGE",
  "sub_type": "POTHOLE",
  "confidence": 87.4,
  "severity": "HIGH",
  "bus_id": "BUS-101",
  "device_id": "EDGE-101",
  "latitude": 13.0821,
  "longitude": 80.2691,
  "observed_at": "2026-09-09T18:30:00Z",
  "source_type": "REAL_EDGE_AI",
  "status": "DETECTED",
  "evidence": {
    "image_ref": "EVT-550e8400-e29b-41d4-a716-446655440000.jpg",
    "video_ref": null
  },
  "metadata": {}
}
```

## 4. Field Rules

| Field | Required | Rule |
|---|---|---|
| schema_version | yes | Contract version, currently `1.0` |
| event_id | yes | Globally unique; also the idempotency key |
| event_type | yes | Controlled event category |
| sub_type | no | Event-specific classification |
| confidence | yes | Number from 0 to 100 |
| severity | yes | `LOW`, `MEDIUM`, `HIGH`, `CRITICAL` |
| bus_id | yes | Stable bus identity |
| device_id | yes | Device that produced the observation |
| latitude | no | Decimal degrees; null if unavailable |
| longitude | no | Decimal degrees; null if unavailable |
| observed_at | yes | Time the observation occurred; ISO-8601 UTC |
| source_type | yes | Controlled source label |
| status | yes | Processing/operational state |
| evidence | no | References to event-specific evidence |
| metadata | no | Event-specific non-core attributes |

`latitude` and `longitude` must either both be present or both be null. Never invent coordinates or GPS accuracy.

## 5. Event Types

Initial controlled values:

- `ROAD_DAMAGE`
- `WATERLOGGING`
- `INFRASTRUCTURE_DAMAGE`
- `CONGESTION`
- `PEDESTRIAN_RISK`
- `SUSPECTED_INCIDENT`

New event types require Integration Lead approval.

## 6. Source Types

- `REAL_EDGE_AI`
- `SIMULATED_EDGE`
- `HARDWARE_SENSOR`
- `TEST_DATA`
- `MANUAL`

Simulated/test observations must remain explicitly labelled.

## 7. Status

Initial lifecycle:

`DETECTED → VALIDATED → FUSED → CONFIRMED → ACKNOWLEDGED → RESOLVED`

Not every observation must pass through every state. A same-bus observation may remain `VALIDATED` without becoming a multi-bus confirmation.

The Edge should normally submit `DETECTED` or `VALIDATED`; Backend/Fusion own later processing transitions.

## 8. Time Semantics

`observed_at` is the authoritative event time and must not be replaced during retry/synchronization.

Backend may record an additional system timestamp such as `received_at`. It is not part of the original observation.

This distinction is required for offline operation.

## 9. Evidence

Evidence fields are references, not shared filesystem paths.

Recommended references:

- `image_ref`
- `video_ref`

Evidence is uploaded/served through the Evidence API. Continuous raw video is outside the MVP.

## 10. Metadata

`metadata` contains optional event-specific attributes such as:

```json
{
  "model_name": "RDD2022-YOLO11s",
  "model_version": "1.0",
  "tracking_id": "TRK-42",
  "confirmed_frames": 3
}
```

Do not duplicate universal fields inside metadata.

## 11. Idempotency and Immutability

`event_id` is the idempotency key.

If the Gateway retries the same event, the Backend must not create another observation.

The original event payload should remain traceable after ingestion. Derived fusion/analytics records must reference original `event_id` values.

## 12. Validation

Backend validation must reject:

- missing required fields
- invalid event types
- confidence outside 0–100
- invalid severity/source/status values
- invalid timestamps
- only one of latitude/longitude being supplied
- malformed evidence structures

The contract is authoritative for module integration.
