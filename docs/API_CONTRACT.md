# BUSSENSE V2 — API Contract

## 1. Purpose

This contract defines the HTTP interface between Edge Gateway and Central Backend and between Backend and the GIS/Control Tower frontend.

Base path: `/api/v1`

Frontend never accesses the database directly. Edge AI never accesses the central database.

## 2. General Rules

- JSON is the default representation.
- Requests/responses use `/api/v1`.
- Backend validates every event.
- `event_id` is the event idempotency key.
- Original observation time is `observed_at`.
- Backend may record `received_at`.
- Continuous raw video upload is not part of the MVP.
- Shared API changes require Integration Lead approval.

## 3. Standard Error

Errors should use an appropriate HTTP status and a predictable body:

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "confidence must be between 0 and 100"
  }
}
```

Initial codes include `VALIDATION_ERROR`, `NOT_FOUND`, `DUPLICATE_CONFLICT`, `UNAUTHORIZED`, `FORBIDDEN`, and `INTERNAL_ERROR`.

## 4. Create Event

`POST /api/v1/events`

Request body: BUSSENSE Event Contract.

Example:

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

First successful creation:

- HTTP `201 Created`
- `created: true`

```json
{
  "success": true,
  "event_id": "EVT-550e8400-e29b-41d4-a716-446655440000",
  "created": true,
  "status": "DETECTED"
}
```

Retry with the same `event_id` and equivalent payload:

- HTTP `200 OK`
- `created: false`
- no duplicate row

If the same `event_id` is reused with a materially different payload, reject it as a conflict.

## 5. List Events

`GET /api/v1/events`

Supported filters:

- `event_type`
- `sub_type`
- `severity`
- `status`
- `bus_id`
- `source_type`
- `start_time`
- `end_time`
- `latitude`
- `longitude`
- `radius`

Response:

```json
{
  "success": true,
  "events": []
}
```

Pagination should be added before large fleet deployment.

## 6. Get Event

`GET /api/v1/events/{event_id}`

- `200` if found
- `404` if not found

## 7. Update Event Status

`PATCH /api/v1/events/{event_id}/status`

Request:

```json
{"status": "ACKNOWLEDGED"}
## 8. Bus APIs

### List

`GET /api/v1/buses`

### Get

`GET /api/v1/buses/{bus_id}`

Example:

```json
{
  "success": true,
  "bus": {
    "bus_id": "BUS-101",
    "route_id": "ROUTE-42",
    "device_id": "EDGE-101",
    "status": "ONLINE"
  }
}
```

### Status

`PATCH /api/v1/buses/{bus_id}/status`

Allowed values:

`ONLINE`, `OFFLINE`, `DEGRADED`, `UNKNOWN`

## 9. Fusion API

`GET /api/v1/fusion`

Returns derived fused records. A fused record must retain references to its original event IDs.

Example:

```json
{
  "success": true,
  "fused_events": []
}
```

Fusion logic is defined by `FUSION_SPEC.md`.

## 10. Analytics API

`GET /api/v1/analytics`

Initial analytics:

- vehicle density
- congestion hotspots
- road damage hotspots
- repeated hazards
- road health
- waterlogging hotspots
- infrastructure deficiency concentration
- route delay indicators

Example:

```json
{
  "success": true,
  "analytics": {
    "total_events": 0,
    "congestion_hotspots": [],
    "road_damage_hotspots": [],
    "road_health": []
  }
}
```

## 11. Evidence API

Evidence is transferred separately from the event payload.

### Upload

`POST /api/v1/evidence`

Content type: `multipart/form-data`

Fields:

- `event_id`
- `evidence_type`
- `file`

Initial evidence types:

`IMAGE`, `VIDEO_CLIP`

The upload operation returns a stable `evidence_ref`.

Recommended flow:

```text
Capture evidence
      ↓
Upload evidence
      ↓
Receive evidence_ref
      ↓
Create event containing evidence_ref

## 12. Health

`GET /api/v1/health`

Example:

```json
{
  "status": "ok",
  "service": "bussense-api",
  "version": "v1"
}
```

Health is for service availability; it should not pretend that every dependency is healthy unless dependency checks are actually performed.

## 13. Synchronization Semantics

Gateway flow:

```text
Event
  ↓
POST /api/v1/events
  ↓
2xx success
  ├─ created=true  → mark delivered
  └─ created=false → mark delivered
  ↓
non-2xx/network failure
  ↓
keep event locally
  ↓
retry original event_id + original observed_at
```

The Gateway must not generate a new event ID during retry.

## 14. Authentication

The architecture reserves device authentication and HTTPS/TLS for deployment.

Local development may run without authentication only when explicitly configured as development mode. Production/device communication must not rely on unauthenticated HTTP.
