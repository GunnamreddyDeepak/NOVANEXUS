# BUSSENSE V2 — Bus & Edge Device Specification

## 1. Purpose

Defines the logical bus/device boundary while keeping the software independent of a specific hardware vendor.

## 2. Bus Identity

Each bus has a stable `bus_id`.

Example:

```json
{
  "bus_id": "BUS-101",
  "route_id": "ROUTE-42",
  "status": "ONLINE"
}
```

## 3. Device Identity

Each edge device has a stable `device_id`.

Example:

`EDGE-101`

A device replacement receives a new `device_id`; historical events retain the original device identity.

## 4. Camera Interface

Camera hardware is accessed through a logical frame-provider interface.

Prototype sources may include:

- USB camera
- recorded road video
- controlled simulator

Production hardware is not assumed by the software contract.

## 5. GPS

Location provider exposes:

- latitude
- longitude
- timestamp
- validity/status
- optional accuracy

Allowed prototype source labels:

- `HARDWARE_GPS`
- `SIMULATED_GPS`

Simulated GPS must never be presented as physical GPS measurements.

## 6. Connectivity

Network state:

- `ONLINE`
- `OFFLINE`
- `DEGRADED`
- `UNKNOWN`

The application must assume connectivity can fail.

## 7. Persistent Offline Queue

The Gateway must persist unsent events.

Each queue record must preserve at least:

- event_id
- original event payload
- observed_at
- evidence references
- delivery state
- retry information

Initial delivery states:

`PENDING`, `RETRYING`, `SENT`, `FAILED`

`SENT` means the Central API has returned a successful response for the event.

A locally queued event must not be deleted solely because a network request was attempted. It may be removed from the active queue only after successful delivery is confirmed.

The queue must survive process restart and unexpected process termination.

## 8. Retry

On recovery:

1. identify pending events
2. send the original payload
3. wait for a successful API response
4. mark delivered
5. continue with remaining events

Never create a new event ID for a retry.
When multiple events are pending, synchronization should normally process them in observed-time order, oldest first.

A permanently failing event must not block synchronization of all later events indefinitely. Failed events should follow the retry policy and remain independently trackable.

## 9. Duplicate Protection

The Backend uses `event_id` as the idempotency key.

Lost response + retry must result in one central observation.

## 10. Evidence

Edge may temporarily store event-specific JPEGs or short clips.

Evidence is associated with `event_id` and must have a configurable local retention policy.

Evidence should be retained locally only as long as required for synchronization and configured investigation/audit needs. Retention limits must prevent unbounded storage growth.

Do not continuously stream raw camera footage to the central platform.

## 11. Gateway Responsibilities

Gateway owns:

- local event persistence
- network state
- synchronization
- GPS integration
- evidence transfer
- device health
- transport details

Gateway does not own:

- central database schema
- Fusion decisions
- city-level confirmation
- authority decisions

## 12. Device Health

Useful health fields:

```json
{
  "device_id": "EDGE-101",
  "bus_id": "BUS-101",
  "software_version": "0.1.0",
  "ai_status": "RUNNING",
  "camera_status": "OK",
  "gps_status": "OK",
  "network_status": "ONLINE",
  "storage_status": "OK",
  "last_sync_at": "2026-09-09T18:29:00Z"
}
```

Only report values actually measured by the device.

## 13. Software and Model Version

Edge-generated events should identify the software/model version in metadata where useful.

Example:

```json
{
  "model_name": "RDD2022-YOLO11s",
  "model_version": "1.0"
}
```

## 14. Time

Prefer synchronized system time.

When offline, local clock time may be used.

The original `observed_at` must remain unchanged during later synchronization.

## 15. Communication

Initial Central API transport is HTTP/REST over a documented API.

MQTT may be introduced for a specific telemetry/event requirement, but it is not mandatory merely because it is available.

Production communication requires TLS and device authentication.

## 16. Hardware Abstraction

Use logical interfaces:

```text
Camera → FrameProvider
GPS    → LocationProvider
Network → ConnectivityProvider
Storage → EventQueue
Transport → CentralTransport
```

This allows prototype hardware to be replaced without rewriting Edge/Event logic.

## 17. Cost Principle

Prefer reuse of existing bus cameras and lightweight edge compute where technically appropriate.

Do not assume an expensive dedicated computer, camera or connectivity package is required for every bus without a measured justification.

## 18. Responsibility Boundary

- Edge AI: inference, tracking, model execution
- Gateway/Hardware: GPS, network, queue, device interfaces
- Backend: registration, validation, persistence, authentication
- Fusion: cross-bus correlation
- Integration Lead: shared interfaces and end-to-end behavior
