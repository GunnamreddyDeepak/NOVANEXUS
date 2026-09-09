 # BUSSENSE V2 — System Architecture

## 1. Project Identity

Project: BUSSENSE V2

Problem Statement:
AI-Powered Mobile Urban Intelligence Platform Using Public Transport Fleet

Core Objective:
Transform public buses into mobile urban sensing units by processing camera data at the edge and sending meaningful urban events to a centralized intelligence platform.

---

## 2. Core Architectural Principle

BUSSENSE is an event-driven edge-to-cloud urban intelligence system.

The fundamental data flow is:

Camera
→ Edge AI
→ Event Intelligence
→ Edge Gateway
→ Central API
→ Event Store
→ Fusion
→ Analytics
→ GIS Control Tower
→ Authority Decision

The system must minimize unnecessary bandwidth usage by processing camera data at the edge and transmitting event metadata and relevant evidence instead of continuously uploading raw video.

---

## 3. High-Level Architecture

                    PUBLIC BUS FLEET

        ┌─────────────┬─────────────┬─────────────┐
        │             │             │
      BUS-101       BUS-104       BUS-108
        │             │             │
        ↓             ↓             ↓
     EDGE AI        EDGE AI        EDGE AI
        │             │             │
        └─────────────┬─────────────┘
                      ↓
                EDGE GATEWAY
             ┌────────┼────────┐
             │        │        │
            GPS    Evidence  Connectivity
                      │        │
                      └── Offline Buffer
                      ↓
                 CENTRAL API
                      ↓
                EVENT STORE
                      ↓
                FUSION ENGINE
                      ↓
               ANALYTICS ENGINE
                      ↓
                GIS CONTROL TOWER
                      ↓
                  AUTHORITY

---

## 4. Edge AI Layer

The Edge AI layer processes camera streams locally on the bus.

Responsibilities:

- Vehicle detection
- Vehicle classification
- Vehicle tracking
- Road damage detection
- Traffic density estimation
- Waterlogging detection
- Infrastructure deficiency detection
- Pedestrian risk detection
- Incident-related vehicle tracking
- Number plate recognition where implemented

The edge layer must avoid sending continuous raw camera streams to the central platform.

AI output should first become a candidate detection.

AI detection alone does not automatically mean that an urban event is confirmed.

---

## 5. Event Intelligence Layer

The Event Intelligence layer converts AI detections into standardized BUSSENSE events.

Responsibilities:

- Validate detections
- Apply temporal confirmation
- Calculate confidence
- Estimate severity
- Attach GPS coordinates
- Attach timestamp
- Attach bus/device identity
- Attach relevant evidence
- Assign event status
- Prepare events for transmission

Principle:

AI detects.
Event Intelligence validates.
Fusion correlates.
Rules determine system-level decisions.
Authority makes the final operational decision.

---

## 6. Edge Gateway

The Edge Gateway is the communication and device-management layer running on the bus.

Responsibilities:

- Receive validated events
- Obtain GPS information
- Manage evidence files
- Maintain local event queue
- Detect network availability
- Transmit events when connectivity is available
- Store events locally during network failure
- Retry synchronization after connectivity restoration
- Maintain device/bus identity

The Edge Gateway must support intermittent connectivity.

---

## 7. Offline Operation

BUSSENSE must continue generating and storing events when the network is unavailable.

Expected flow:

Event Generated
→ Network Available?
→ YES → Send to Central API

Event Generated
→ Network Available?
→ NO → Store Locally
→ Network Restored
→ Synchronize Pending Events

Offline events must retain:

- event_id
- event type
- bus/device identity
- timestamp
- GPS
- confidence
- severity
- evidence reference
- delivery status

---

## 8. Central API Layer

The Central API provides communication between buses and the central platform.

Primary responsibilities:

- Receive events
- Validate event schema
- Register and monitor buses
- Provide event data to frontend
- Provide fusion data
- Provide analytics data
- Manage evidence references
- Support authenticated communication

API versioning:

/api/v1/

The API contract must remain stable unless an architecture-level change is approved.

---

## 9. Event Store

The central platform stores structured urban events.

Target V2 database architecture:

PostgreSQL
+
PostGIS

PostGIS is used for spatial operations such as:

- Nearby event detection
- Spatial clustering
- Road-segment association
- Repeated hazard identification
- Bus trajectory analysis
- Geographic analytics

SQLite may be used temporarily during development, but it is not the target final architecture.

---

## 10. Fusion Engine

The Fusion Engine correlates observations from multiple buses.

A multi-bus confirmation should consider:

- Event type
- Spatial proximity
- Time window
- Different bus identities
- Detection confidence
- Observation consistency

Example:

BUS-101 detects pothole
+
BUS-104 detects pothole at the same location
+
BUS-108 detects pothole at the same location

↓

MULTI-BUS CONFIRMED EVENT

The Fusion Engine must distinguish repeated observations from the same bus from independent observations from multiple buses.

---

## 11. Analytics Engine

The Analytics Engine converts individual events into urban-level intelligence.

Initial analytics:

- Vehicle density
- Congestion hotspots
- Road damage hotspots
- Repeated road hazards
- Road health
- Waterlogging hotspots
- Infrastructure deficiency concentration
- Route delay indicators

The analytics layer should prioritize actionable information rather than simply displaying raw event counts.

---

## 12. Road Segment Intelligence

BUSSENSE should aggregate events spatially onto road segments where possible.

Example:

Road Segment A

Potholes: 7
Cracks: 4
Waterlogging observations: 2
Repeated detections: 13
Average severity: HIGH

↓

Road Health: POOR

This provides more useful information to urban authorities than isolated map markers alone.

---

## 13. GIS Control Tower

The GIS Control Tower is the primary visualization interface for authorities.

It should provide:

- Bus fleet locations/status
- Urban event map
- Hazard locations
- Congestion heatmap
- Road health information
- Multi-bus confirmed events
- Event details
- Evidence
- Analytics
- Incident information

The GIS interface consumes backend APIs and must not directly access the database.

---

## 14. Event Lifecycle

The standard event lifecycle is:

DETECTED
    ↓
VALIDATED
    ↓
FUSED
    ↓
CONFIRMED
    ↓
ACKNOWLEDGED
    ↓
RESOLVED

Not every event must immediately pass through every state.

The lifecycle represents the progression from machine observation to operational handling.

---

## 15. Event Sources

Every event must identify its source.

Allowed source types:

- REAL_EDGE_AI
- SIMULATED_EDGE
- HARDWARE_SENSOR
- TEST_DATA

Simulated or test data must never be represented as real-world sensor observations.

---

## 16. Evidence Strategy

BUSSENSE should transmit only relevant evidence associated with an event.

Preferred approach:

Camera
→ Edge AI
→ Event detected
→ Relevant evidence captured
→ Evidence reference attached to event
→ Metadata transmitted

Continuous raw video upload is not part of the MVP architecture.

---

## 17. Incident Intelligence

Incident intelligence is treated as a suspected event capability.

The system may identify:

- Vehicle tracking
- Number plate candidate
- OCR confidence
- Time
- GPS
- Evidence

The system should use terminology such as:

"Suspected Incident"

or

"Potential High-Risk Situation"

The system must not claim to legally determine criminal responsibility or perform facial recognition.

---

## 18. Security Principles

V2 must progressively introduce:

- Device identity
- API authentication
- HTTPS
- Input validation
- Event authorization
- Secure evidence access
- No credentials inside source code
- No secrets committed to Git

Development configuration may be simplified locally, but production-oriented architecture must account for secure communication.

---

## 19. Performance Principles

Edge processing should avoid unnecessary inference on every camera frame.

Where appropriate:

Camera FPS
→ Frame Sampling
→ AI Detection
→ Tracking
→ Event Confirmation

The system should balance:

- Detection accuracy
- Processing speed
- Edge hardware capability
- Power consumption
- Network bandwidth

---

## 20. Modularity

BUSSENSE V2 is a modular system.

Major modules:

edge/
gateway/
backend/
fusion/
frontend/
hardware/
models/
tests/
docs/

Each module must have:

- Clear responsibility
- Defined input
- Defined output
- Defined interface
- Automated or documented tests where practical

---

## 21. Team Ownership

System Architect / Integration Lead:
- Architecture
- Shared contracts
- Integration
- Repository management
- Code review
- End-to-end testing
- Final deployment
- Final SIH demonstration

Edge AI:
- Edge computer vision
- Detection
- Tracking
- Road damage AI
- Temporal confirmation

Backend / Data:
- FastAPI
- PostgreSQL
- PostGIS
- Event storage
- Authentication

Frontend / GIS:
- React
- GIS
- Dashboard
- Event visualization
- Evidence visualization

Fusion / Analytics:
- Multi-bus fusion
- Spatial correlation
- Temporal correlation
- Road health
- Urban analytics

Hardware / Gateway:
- GPS
- Camera interface
- Edge device
- Connectivity
- Offline gateway

---

## 22. Architecture Change Rule

No team member may independently modify a shared architecture contract.

Changes affecting:

- Event schema
- API schema
- Database model
- Fusion logic
- Module boundaries
- Communication protocol

must be discussed with the System Architect before implementation.

---

## 23. MVP Boundary

The MVP focuses on:

1. Edge AI
2. Event generation
3. GPS-aware events
4. Offline buffering
5. Central event platform
6. Multi-bus fusion
7. GIS control tower
8. Traffic and road analytics
9. Evidence-based suspected incident intelligence

The project should not introduce unnecessary technologies or features that do not improve the core urban intelligence pipeline.

---

## 24. Final End-to-End Flow

PUBLIC BUS CAMERA
        ↓
EDGE AI
        ↓
EVENT INTELLIGENCE
        ↓
GPS + EVIDENCE
        ↓
EDGE GATEWAY
        ↓
ONLINE / OFFLINE BUFFER
        ↓
CENTRAL API
        ↓
EVENT STORE
        ↓
MULTI-BUS FUSION
        ↓
URBAN ANALYTICS
        ↓
GIS CONTROL TOWER
        ↓
AUTHORITY ACTION

This flow defines the BUSSENSE V2 system architecture.