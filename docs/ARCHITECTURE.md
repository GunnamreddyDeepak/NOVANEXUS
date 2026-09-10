# BUSSENSE V2 — System Architecture

## 1. Project Identity

BUSSENSE V2 is an AI-powered mobile urban intelligence platform using public transport fleets as distributed mobile sensing units.

The system converts local camera/sensor observations into structured urban events and aggregates them centrally.

## 2. Non-Negotiable Principle

> **Process video locally. Send intelligence centrally.**

Continuous raw-video upload is not part of the MVP.

## 3. End-to-End Flow

```text
Bus Camera / Sensors
        ↓
Edge AI
        ↓
Detection + Tracking
        ↓
Event Intelligence
        ↓
Canonical Urban Event
        ↓
GPS + Evidence Reference
        ↓
Persistent Local Buffer
        ↓
Edge Gateway
        ↓
Central API
        ↓
Event Store
        ↓
Fusion + Analytics
        ↓
GIS / Control Tower
        ↓
Authority Decision Support
```

## 4. Edge AI

Edge AI owns:

- camera/frame ingestion
- model inference
- vehicle detection/tracking
- road-damage detection
- other implemented detection capabilities
- model execution and performance

AI output is a candidate observation, not automatically a city-level confirmation.

## 5. Event Intelligence

Event Intelligence converts detections into the canonical BUSSENSE Event.

Responsibilities:

- temporal/multi-frame validation
- confidence calculation
- severity estimation
- event classification
- time attachment
- evidence selection
- event ID creation
- consume location information provided by the Gateway/LocationProvider

## 6. Edge Gateway

The Gateway is a true boundary between the bus and Central Platform.

Responsibilities:

- receive validated events
- attach/verify device context and location
- persist events while offline
- retry synchronization
- maintain delivery state
- manage evidence transfer
- report device health

The Gateway must not know or manipulate central database internals.

## 7. Offline-First Requirement

A network failure must not destroy an event.

```text
EVENT
  ↓
Persistent Local Queue
  ↓
Network available?
 ┌───────────────┐
 YES             NO
 ↓                ↓
Upload          Keep queued
 ↓                ↓
ACK              Retry later
```

Retries preserve the original event ID and observation timestamp.

## 8. Central Platform

The Central Backend owns:

- API validation
- device/bus registry
- event persistence
- idempotent ingestion
- operational status
- evidence references
- API access for frontend
- orchestration of Fusion/Analytics

## 9. Storage Strategy

Development may use SQLite when it improves setup speed.

The target spatial architecture is PostgreSQL + PostGIS for deployment-scale spatial operations.

Application code should use a storage boundary so the database implementation can evolve without changing the Event/API contract.

## 10. Fusion

Fusion converts independent observations into higher-confidence urban conditions.

It considers:

- classification
- spatial proximity
- temporal proximity
- bus independence
- confidence
- GPS quality where available

Repeated detections from one bus do not count as independent multi-bus evidence.

## 11. Analytics

Analytics derives actionable information such as:

- vehicle density
- congestion hotspots
- road damage hotspots
- road health
- repeated hazards
- route delay indicators

Analytics must distinguish raw observations from derived intelligence.

## 12. GIS Control Tower

The React frontend consumes Backend APIs only.

It should visualize:

- bus status/location
- event locations
- event details/evidence
- fused urban conditions
- congestion
- road health
- analytics

## 13. Incident Intelligence Boundary

Incident capabilities may include tracking, candidate plate OCR, time, GPS and evidence.

Use terms such as `SUSPECTED_INCIDENT` and `POTENTIAL_HIGH_RISK_SITUATION`.

Do not claim legal responsibility or facial-recognition capability unless separately and legitimately implemented.

## 14. Security

Deployment architecture requires:

- HTTPS/TLS
- device identity
- authentication/authorization
- input validation
- protected evidence access
- secret management

Development shortcuts must not be represented as production security.

## 15. Modularity

```text
edge/
gateway/
backend/
fusion/
analytics/
frontend/
hardware/
models/
tests/
docs/
```

Modules may be developed independently, but their interfaces are shared system contracts.

## 16. Team Boundaries

- System Architect/Integration: architecture, contracts, integration, QA
- Edge AI: computer vision and event-generation inputs
- Backend/Data: API, persistence, validation, device registry
- Frontend/GIS: Control Tower
- Fusion/Analytics: correlation and urban intelligence
- Hardware/Gateway: GPS, connectivity, local queue, device interfaces

## 17. Architecture Change Rule

Changes to event schema, API, database boundary, communication protocol, fusion semantics, hardware boundary or major AI subsystem require Integration Lead review.

## 18. MVP Boundary

The MVP must demonstrate a credible end-to-end path:

```text
real/controlled camera input
→ real Edge AI where implemented
→ validated event
→ persistent offline queue
→ central ingestion
→ multi-bus fusion
→ analytics
→ GIS visualization
```

Features not reliably implementable or testable do not enter the MVP merely to increase feature count.
