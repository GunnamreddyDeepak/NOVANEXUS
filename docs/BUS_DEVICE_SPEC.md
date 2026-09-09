# BUSSENSE V2 — Bus & Edge Device Specification

## 1. Purpose

This document defines the logical structure and interface requirements of a BUSSENSE-equipped public bus.

A BUSSENSE bus acts as a mobile urban sensing unit.

The bus collects camera/sensor observations, processes them at the edge, associates validated events with location and time, and transmits event information to the Central Platform.

---

# 2. Bus-Level Architecture

Each BUSSENSE-enabled bus contains:

PUBLIC BUS
    |
    +-- Edge Computing Device
    |
    +-- Camera System
    |
    +-- GPS
    |
    +-- Network Connectivity
    |
    +-- Local Storage
    |
    +-- BUSSENSE Edge Gateway

Logical flow:

CAMERAS
    ↓
EDGE AI
    ↓
EVENT INTELLIGENCE
    ↓
EDGE GATEWAY
    ↓
GPS + EVIDENCE + CONNECTIVITY
    ↓
CENTRAL API

---

# 3. Bus Identity

Every participating bus must have a unique bus_id.

Example:

BUS-101

Recommended bus information:

{
  "bus_id": "BUS-101",
  "route_id": "ROUTE-42",
  "device_id": "EDGE-101",
  "status": "ONLINE"
}

The bus_id identifies the physical bus.

The device_id identifies the BUSSENSE edge computing device installed on that bus.

These identifiers must not be confused.

---

# 4. Device Identity

Each edge computing device should have a unique device_id.

Example:

EDGE-101

Relationship:

BUS-101
    ↓
EDGE-101

The device_id should remain associated with the bus unless the hardware is replaced or reassigned.

Device identity will later be used for authenticated communication with the Central Platform.

---

# 5. Route Identity

Each bus may operate on a configured route.

Example:

route_id:

ROUTE-42

A route is separate from bus identity.

One bus may operate on different routes over time.

Therefore:

bus_id ≠ route_id

The event should preserve the route information when available.

---

# 6. Camera System

The edge device may receive one or more camera streams.

Initial logical camera roles:

FRONT_CAM
REAR_CAM
LEFT_SIDE_CAM
RIGHT_SIDE_CAM
CABIN_CAM

The MVP prioritizes road-facing cameras.

Camera identifiers should be unique per device.

Example:

FRONT-CAM-01

Camera metadata may include:

- camera_id
- camera_role
- resolution
- frame_rate
- status

---

# 7. Camera Processing

Camera streams should be processed locally by the Edge AI layer.

The default architecture is:

CAMERA
    ↓
FRAME CAPTURE
    ↓
FRAME SAMPLING
    ↓
AI INFERENCE
    ↓
TRACKING
    ↓
EVENT VALIDATION

The system should avoid unnecessary inference on every camera frame where hardware limitations make this inefficient.

---

# 8. Edge Computing Device

The Edge Computing Device is responsible for local processing.

Logical responsibilities:

- Camera ingestion
- AI inference
- Vehicle detection
- Vehicle tracking
- Road damage detection
- Traffic estimation
- Event validation
- Evidence generation
- Communication with GPS
- Communication with Edge Gateway

The actual hardware may vary between prototype and deployment.

The software architecture should remain hardware-independent wherever practical.

---

# 9. GPS

Each BUSSENSE bus should provide location information through a GPS/GNSS source.

Required information:

- latitude
- longitude
- timestamp
- GPS validity/status

Example:

{
  "latitude": 13.0821,
  "longitude": 80.2691,
  "gps_valid": true
}

GPS coordinates are attached to events before transmission whenever available.

---

# 10. GPS Source

Allowed prototype source types:

HARDWARE_GPS
SIMULATED_GPS

If simulated GPS is used:

- It must be clearly labelled.
- It must not be presented as hardware-generated data.
- It is only for controlled demonstration/testing.

The final hardware-oriented pipeline should prefer:

HARDWARE_GPS

---

# 11. GPS Accuracy

The system should preserve the available GPS quality information when provided by the device.

Where possible, GPS metadata may include:

- accuracy
- fix status
- satellite information
- timestamp

Example:

{
  "latitude": 13.0821,
  "longitude": 80.2691,
  "accuracy_m": 8.5,
  "gps_valid": true
}

The system must not invent GPS accuracy values when they are unavailable.

---

# 12. Network Connectivity

The bus may use available network connectivity such as:

- Cellular network
- Wi-Fi during testing
- Other authorized IP connectivity

The BUSSENSE application should not assume continuous connectivity.

Network state should be represented as:

ONLINE
OFFLINE
DEGRADED
UNKNOWN

---

# 13. Connectivity Manager

The Connectivity Manager is responsible for determining whether the Central Platform can currently be reached.

Logical flow:

EVENT
   ↓
CHECK CONNECTIVITY
   ↓
ONLINE?
 /     \
YES     NO
 |       |
SEND    STORE
 |       |
SUCCESS  QUEUE
         |
     RETRY LATER

The connectivity manager should not delete an event merely because transmission failed.

---

# 14. Offline Storage

The Edge Gateway must maintain a local queue for events that cannot currently be transmitted.

Each queued event should preserve:

- event_id
- event payload
- timestamp
- GPS
- evidence reference
- retry state
- local delivery state

Example local state:

PENDING
RETRYING
SENT
FAILED

Events should remain available until successful synchronization or explicit failure handling.

---

# 15. Retry Behaviour

When network connectivity is restored:

1. Detect connectivity.
2. Read pending events.
3. Send events to the Central API.
4. Confirm successful response.
5. Mark the event as synchronized.
6. Continue with remaining events.

The original event_id must be preserved.

The system must avoid creating a new event simply because an old event was retried.

---

# 16. Duplicate Protection

The Central API treats event_id as an idempotency key.

Example:

EDGE sends:

EVT-ROAD-000001

Network response is lost.

EDGE retries:

EVT-ROAD-000001

The Central Platform must recognize the existing event and avoid creating a duplicate event record.

---

# 17. Local Evidence

The Edge Device may temporarily store evidence generated for an event.

Examples:

- JPEG image
- Short video clip
- Detection frame

Evidence should be associated with an event_id.

Example:

EVT-ROAD-000001.jpg

Evidence should not be stored indefinitely on the edge device without a defined retention policy.

---

# 18. Bandwidth Strategy

BUSSENSE is designed to reduce unnecessary network traffic.

Preferred flow:

RAW CAMERA STREAM
    ↓
LOCAL EDGE PROCESSING
    ↓
MEANINGFUL EVENT
    ↓
SMALL EVIDENCE
    +
EVENT METADATA
    ↓
CENTRAL PLATFORM

Continuous raw video upload is not part of the MVP architecture.

---

# 19. Edge Gateway Responsibilities

The Edge Gateway is the boundary between local bus processing and the Central Platform.

Responsibilities:

- Receive validated events
- Attach/verify device information
- Attach GPS information
- Manage evidence references
- Check network state
- Queue events during outages
- Retry synchronization
- Handle API responses
- Maintain delivery state
- Provide device health information

---

# 20. Device Health

The edge device should be able to report basic health information.

Possible health fields:

- device_id
- bus_id
- software version
- AI engine status
- camera status
- GPS status
- network status
- storage status
- last successful synchronization time

Example:

{
  "device_id": "EDGE-101",
  "bus_id": "BUS-101",
  "ai_status": "RUNNING",
  "camera_status": "OK",
  "gps_status": "OK",
  "network_status": "ONLINE"
}

---

# 21. Software Version

The edge system should expose its software version.

Example:

BUSSENSE_EDGE_VERSION = "0.1.0"

This helps identify which software generated an event.

The version should be included in event metadata or device status where appropriate.

---

# 22. Model Version

AI-generated events should identify the model version where practical.

Example:

{
  "model_name": "RDD2022-YOLO11s",
  "model_version": "1.0"
}

This allows later analysis of which model generated an observation.

---

# 23. Time Synchronization

The edge device should maintain a reliable system clock.

Event timestamps should preferably be synchronized using an available time source.

If the network is unavailable, the local device clock may be used.

The original event timestamp must be preserved during synchronization.

---

# 24. Hardware Abstraction

The Edge AI and Event Intelligence modules should not depend directly on a specific GPS or camera hardware vendor.

Use logical interfaces.

Example:

Camera Interface
    ↓
Frame Provider

GPS Interface
    ↓
Location Provider

Network Interface
    ↓
Connectivity Provider

This allows prototype hardware to be replaced later without redesigning the entire application.

---

# 25. Prototype Hardware

During development, the system may use:

- Laptop/desktop for simulation
- USB camera
- Recorded road video
- Development GPS source
- Wi-Fi network

Prototype hardware is acceptable for demonstrating the software architecture.

Prototype components must be clearly distinguished from production deployment hardware.

---

# 26. Production-Oriented Hardware

A future deployment may use:

- Embedded edge computing hardware
- Vehicle-mounted cameras
- GNSS/GPS receiver
- Cellular connectivity
- Local storage

The exact hardware should be selected based on:

- AI processing capability
- Power consumption
- Environmental conditions
- Cost
- Camera interfaces
- Network availability
- Installation constraints

Hardware selection should not unnecessarily increase deployment cost.

---

# 27. Cost Principle

The architecture should avoid requiring expensive hardware for every bus unless technically justified.

The system should prioritize:

- Reusing existing bus cameras where possible
- Edge processing
- Lightweight models
- Minimal bandwidth usage
- Modular hardware
- Replaceable components

Hardware cost must be evaluated against actual operational benefit.

---

# 28. Security

Each deployed edge device should eventually have a unique identity.

Communication with the Central Platform should use:

- HTTPS/TLS
- Device authentication
- Credential protection
- Input validation

Secrets must never be committed to Git.

---

# 29. Device-to-Central Communication

The preferred logical communication path is:

EDGE DEVICE
    ↓
EDGE GATEWAY
    ↓
AUTHENTICATED API
    ↓
CENTRAL PLATFORM

The initial implementation may use HTTP/REST for simplicity.

MQTT may be introduced where appropriate for lightweight device telemetry or event delivery.

A communication protocol should not be added merely for complexity.

---

# 30. Camera-to-Event Relationship

A camera observation is not automatically a final urban event.

The preferred pipeline is:

CAMERA
    ↓
AI DETECTION
    ↓
TRACKING / TEMPORAL VALIDATION
    ↓
EVENT INTELLIGENCE
    ↓
BUSSENSE EVENT

This prevents single-frame false positives from immediately becoming operational alerts.

---

# 31. Bus-to-Event Relationship

Every event generated by a bus must identify:

bus_id
device_id
timestamp
location

This allows the Central Platform to understand:

WHO observed the event
WHEN it was observed
WHERE it was observed

---

# 32. Bus Status

The Central Platform should be able to represent:

ONLINE
OFFLINE
DEGRADED
UNKNOWN

A bus being OFFLINE does not automatically mean the edge system has stopped working.

It may simply indicate that communication with the Central Platform is unavailable.

---

# 33. Hardware Replacement

If an edge device is replaced:

The new device receives a new device_id.

The bus_id may remain unchanged.

Historical events retain their original device_id.

This preserves traceability.

---

# 34. Responsibility Boundary

Hardware/Gateway team owns:

- Physical device interfaces
- GPS integration
- Camera connectivity
- Network connectivity
- Offline gateway
- Device health

Edge AI team owns:

- AI inference
- Detection
- Tracking
- Model execution
- Detection-level outputs

Backend team owns:

- Device registration
- Event reception
- Central storage
- Authentication

System Architect owns:

- Shared interfaces
- Integration
- Contract changes

---

# 35. Final Bus Data Flow

PUBLIC BUS
    ↓
CAMERAS
    ↓
EDGE COMPUTE
    ↓
EDGE AI
    ↓
EVENT INTELLIGENCE
    ↓
GPS + EVIDENCE
    ↓
EDGE GATEWAY
    ↓
ONLINE / OFFLINE
    ↓
CENTRAL API
    ↓
CENTRAL PLATFORM

This specification defines the logical bus/device boundary for BUSSENSE V2.