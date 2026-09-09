# BUSSENSE V2 — Fusion & Urban Intelligence Specification

## 1. Purpose

The Fusion Engine converts independent observations from the public bus fleet into higher-confidence urban intelligence.

The core purpose is to determine whether observations from different buses represent the same real-world urban condition.

Example:

BUS-101 detects a pothole
+
BUS-104 detects a pothole nearby
+
BUS-108 detects a pothole nearby

↓

MULTI-BUS CONFIRMED URBAN EVENT

Fusion must reduce duplicate alerts and increase confidence through independent observations.

---

# 2. Core Principle

One AI detection is an observation.

Multiple consistent observations may represent one real-world event.

Fusion is responsible for determining whether multiple observations should be correlated.

The Fusion Engine must never blindly merge all nearby events.

---

# 3. Fusion Inputs

The Fusion Engine consumes validated BUSSENSE events.

Important input fields:

- event_id
- event_type
- sub_type
- confidence
- severity
- bus_id
- device_id
- latitude
- longitude
- timestamp
- source_type
- status
- evidence
- metadata

---

# 4. Fusion Eligibility

Only appropriate event types should participate in spatial/temporal multi-bus fusion.

Initial eligible event types:

ROAD_DAMAGE
WATERLOGGING
INFRASTRUCTURE_DAMAGE

Other event types may use specialized fusion logic.

CONGESTION should normally use area/time aggregation rather than simple point-event fusion.

SUSPECTED_INCIDENT should use incident-specific tracking logic.

PEDESTRIAN_RISK should use short-duration temporal logic and should not automatically become a persistent road hazard.

---

# 5. Fusion Dimensions

Fusion should consider four major dimensions:

1. Spatial proximity
2. Temporal proximity
3. Event similarity
4. Independent bus observations

Additional confidence information may be used to improve the result.

---

# 6. Spatial Proximity

Two observations may belong to the same real-world event when they occur within an acceptable geographic distance.

Initial prototype threshold:

50 metres

This value is configurable.

The final value should be tuned using real road conditions and GPS accuracy.

Example:

BUS-101:
13.08210, 80.26910

BUS-104:
13.08225, 80.26920

If the calculated distance is within the configured threshold, the observations may be spatially related.

The system must use geographic distance rather than simple string comparison.

---

# 7. Temporal Proximity

Two observations should also occur within a reasonable time window.

Initial prototype window:

30 minutes

This value is configurable.

Example:

BUS-101:
10:00:00

BUS-104:
10:08:00

These observations may represent the same road condition.

However:

BUS-101:
10:00:00

BUS-104:
18:00:00

should not automatically be treated as the same observation.

---

# 8. Event Similarity

Events should have compatible classifications before fusion.

Strong similarity:

ROAD_DAMAGE + POTHOLE
+
ROAD_DAMAGE + POTHOLE

Possible related observations:

ROAD_DAMAGE + LONGITUDINAL_CRACK
+
ROAD_DAMAGE + ROAD_DAMAGE

The system should not merge unrelated categories simply because their coordinates are close.

Example:

ROAD_DAMAGE + POTHOLE

must not automatically merge with:

WATERLOGGING

unless a future explicitly defined relationship exists.

---

# 9. Independent Bus Requirement

A genuine MULTI-BUS CONFIRMED event requires observations from at least two distinct buses.

Example:

BUS-101
BUS-104

is valid multi-bus evidence.

Example:

BUS-101
BUS-101
BUS-101

is NOT multi-bus evidence.

Repeated observations from the same bus may improve temporal confidence but cannot independently establish multi-bus confirmation.

---

# 10. Device Independence

bus_id is the primary identity used for multi-bus confirmation.

device_id may additionally be used to verify the source.

A system must not count multiple camera observations from the same bus as multiple independent buses.

Example:

BUS-101
FRONT-CAM
+
BUS-101
REAR-CAM

=

One bus observation group.

It is not:

MULTI-BUS CONFIRMED.

---

# 11. Fusion Pipeline

The Fusion Engine follows:

Validated Events
      ↓
Filter Eligible Event Types
      ↓
Compare Event Classification
      ↓
Check Spatial Proximity
      ↓
Check Temporal Proximity
      ↓
Check Bus Independence
      ↓
Group Consistent Observations
      ↓
Calculate Fusion Confidence
      ↓
Create Fused Event
      ↓
Update Event Status

---

# 12. Fusion Cluster

A Fusion Cluster represents observations believed to correspond to the same real-world condition.

Example:

Cluster F-0001

Observations:

EVT-001 → BUS-101
EVT-014 → BUS-104
EVT-027 → BUS-108

Common type:

ROAD_DAMAGE

Common subtype:

POTHOLE

Approximate location:

13.0822, 80.2692

---

# 13. Cluster Identity

A fused cluster should have its own identifier.

Example:

FUS-000001

The fused identifier is different from the original event IDs.

Original events must remain traceable.

Example:

FUS-000001

contains:

EVT-001
EVT-014
EVT-027

---

# 14. Traceability

Fusion must never destroy the original observations.

The system must preserve:

- Original event_id
- bus_id
- timestamp
- location
- confidence
- evidence

The fused event is an aggregation layer over the original observations.

---

# 15. Fusion Confidence

Fusion confidence represents how strongly the system believes that observations belong to the same real-world event.

Factors may include:

- Number of distinct buses
- Spatial closeness
- Temporal closeness
- Event classification similarity
- Original event confidence
- Observation consistency

Example:

2 buses
+
very close coordinates
+
same event type
+
short time difference

may produce a high fusion confidence.

---

# 16. Transparent Fusion Score

The initial implementation should use explainable rules instead of an opaque ML model.

Example conceptual scoring:

Base score:

50

Additional confidence:

+10 for each additional independent bus after the first

+20 for strong spatial agreement

+15 for strong temporal agreement

+5 for matching subtype

The final score is capped at 100.

The exact formula is configurable and may be tuned during validation.

The score should be documented rather than hidden.

---

# 17. Example Fusion

Observation 1:

BUS-101
ROAD_DAMAGE
POTHOLE
Confidence: 82%
Location: A
Time: 10:00

Observation 2:

BUS-104
ROAD_DAMAGE
POTHOLE
Confidence: 79%
Location: A + 15m
Time: 10:06

Observation 3:

BUS-108
ROAD_DAMAGE
POTHOLE
Confidence: 91%
Location: A + 20m
Time: 10:11

↓

Fusion Cluster:

FUS-000001

Distinct buses:

3

↓

Status:

CONFIRMED

↓

Reason:

Three independent buses observed the same type of road defect within the configured spatial and temporal thresholds.

---

# 18. Same-Bus Repeated Detection

Example:

BUS-101 detects:

10:00
10:01
10:02
10:03

These observations may be consolidated as repeated observations from one bus.

They may improve event confidence.

However:

They must not produce:

MULTI-BUS CONFIRMED

because only one bus contributed evidence.

---

# 19. Multi-Camera Observation

If one bus has multiple cameras:

BUS-101 FRONT-CAM
BUS-101 LEFT-CAM

these are still observations from:

BUS-101

They may be useful for event validation but do not count as two independent buses.

---

# 20. GPS Quality

Fusion should consider location quality when GPS accuracy information is available.

If two observations are close but GPS accuracy is poor, fusion confidence should be reduced or the observations may require additional evidence.

The system must not invent GPS accuracy.

---

# 21. Road Segment Fusion

Where PostGIS is available, fused observations should be associated with a road segment where practical.

Example:

Road Segment RS-102

Observations:

BUS-101
BUS-104
BUS-108

↓

Fused Road Condition

This allows the system to move from:

individual event intelligence

to:

road-segment intelligence.

---

# 22. Road Health

Road health can be derived from repeated road-related observations.

Possible contributing factors:

- Number of potholes
- Number of cracks
- Waterlogging observations
- Repeated detections
- Severity
- Multi-bus confirmation
- Observation frequency

Example:

ROAD SEGMENT A

Potholes: 7
Cracks: 4
Waterlogging: 2
Multi-bus confirmations: 3

↓

ROAD HEALTH: POOR

The exact scoring model should remain explainable.

---

# 23. Road Health Score

Initial conceptual scale:

90–100:
EXCELLENT

75–89:
GOOD

50–74:
FAIR

25–49:
POOR

0–24:
CRITICAL

The scoring formula should be configurable and validated using realistic test data.

---

# 24. Congestion Fusion

Congestion is not treated exactly like a pothole.

Instead of asking:

"Are these two points the same pothole?"

the system should ask:

"Is vehicle density elevated in this geographic area during this time period?"

Inputs may include:

- Vehicle counts
- Vehicle classes
- Average density
- Bus travel speed where available
- Time
- Location
- Multiple bus observations

Output may include:

- Congestion area
- Congestion level
- Estimated duration
- Number of buses observing congestion

---

# 25. Congestion Levels

Initial levels:

LOW
MODERATE
HIGH
SEVERE

These should be configurable rather than hard-coded into the frontend.

---

# 26. Repeated Hazard Intelligence

If the same road location repeatedly receives observations across different days or bus journeys, the system may identify it as a recurring hazard.

Example:

Monday:
BUS-101 → pothole

Tuesday:
BUS-104 → pothole

Wednesday:
BUS-108 → pothole

↓

RECURRING ROAD HAZARD

This is more valuable than treating each observation as an independent alert.

---

# 27. Persistent vs Temporary Events

The system should distinguish:

TEMPORARY EVENT

and

PERSISTENT CONDITION

Example:

Heavy traffic may be temporary.

A pothole repeatedly detected over several days may be persistent.

This distinction is useful for authority prioritization.

---

# 28. Priority Calculation

A future priority score may combine:

Severity
+
Fusion confidence
+
Number of independent buses
+
Recurrence
+
Road importance

Example:

HIGH severity
+
3 buses
+
repeated for 5 days

↓

HIGH PRIORITY ROAD ISSUE

Priority is an operational ranking and does not replace authority judgment.

---

# 29. Fusion Output

A fused result should contain:

- fusion_id
- event_type
- sub_type
- confidence
- severity
- status
- representative latitude
- representative longitude
- first_seen
- last_seen
- distinct_bus_count
- source_event_ids
- evidence references
- metadata

Example:

{
  "fusion_id": "FUS-000001",
  "event_type": "ROAD_DAMAGE",
  "sub_type": "POTHOLE",
  "confidence": 94,
  "severity": "HIGH",
  "status": "CONFIRMED",
  "latitude": 13.0822,
  "longitude": 80.2692,
  "first_seen": "2026-09-09T10:00:00Z",
  "last_seen": "2026-09-09T10:11:00Z",
  "distinct_bus_count": 3,
  "source_event_ids": [
    "EVT-001",
    "EVT-014",
    "EVT-027"
  ]
}

---

# 30. Fusion Status

Possible fusion statuses:

CANDIDATE
FUSED
CONFIRMED
DISMISSED

Meaning:

CANDIDATE:
Observations appear potentially related.

FUSED:
Observations have been grouped.

CONFIRMED:
Evidence meets configured confirmation criteria.

DISMISSED:
The cluster was determined not to represent the same event.

---

# 31. Avoiding Duplicate Fused Events

The Fusion Engine must avoid creating multiple fusion records for the same persistent cluster.

Example:

If:

FUS-000001

already represents a pothole at location A,

new compatible observations should normally update the existing cluster rather than creating:

FUS-000002

for the same condition.

Cluster identity and matching rules should therefore be deterministic and traceable.

---

# 32. Fusion Execution

The initial V2 implementation may run fusion periodically or after new event ingestion.

Possible flow:

New Event
    ↓
Store Event
    ↓
Fusion Trigger
    ↓
Search Nearby Compatible Events
    ↓
Apply Time Window
    ↓
Check Independent Buses
    ↓
Update/Create Fusion Cluster

The architecture should remain flexible enough to move to asynchronous processing later.

---

# 33. PostGIS Integration

When PostgreSQL/PostGIS is introduced, spatial queries should use geographic operations.

Examples of future operations:

- Nearby events
- Events within radius
- Road segment intersection
- Spatial clustering
- Event density
- Hazard hotspots

The system should avoid relying permanently on rounded latitude/longitude values as the primary spatial algorithm.

---

# 34. Fusion Explainability

Every confirmed fusion should have a reason.

Example:

"Confirmed because 3 independent buses observed ROAD_DAMAGE/POTHOLE within 23m and 11 minutes."

The explanation should be available to the Control Tower.

This allows an authority or judge to understand why the system marked an event as confirmed.

---

# 35. False Positive Handling

Fusion should help reduce false positives.

Example:

BUS-101:
Pothole confidence 55%

BUS-104:
No matching observation

↓

Remain:

VALIDATED / LOW CONFIDENCE

Not automatically:

MULTI-BUS CONFIRMED

If multiple independent buses observe the same condition consistently:

↓

Confidence increases.

---

# 36. Authority Decision Boundary

Fusion does not make the final real-world decision.

Fusion produces:

"System-level confirmed urban condition"

The authority decides:

- Inspect
- Repair
- Monitor
- Escalate
- Ignore
- Resolve

BUSSENSE provides intelligence, not autonomous governmental decision-making.

---

# 37. Ownership

Fusion/Analytics team owns:

- Fusion algorithms
- Spatial correlation
- Temporal correlation
- Cluster management
- Road health
- Congestion aggregation
- Recurring hazard analysis

Backend team owns:

- Storage
- API access
- Database infrastructure

Edge team owns:

- Detection
- Tracking
- Initial event generation

Frontend team owns:

- Fusion visualization
- Analytics visualization

System Architect owns:

- Fusion contract
- Module boundaries
- Integration decisions

---

# 38. Fusion MVP

The minimum Fusion implementation must support:

1. Spatial proximity
2. Temporal proximity
3. Event type matching
4. Distinct bus counting
5. Confidence aggregation
6. Fusion cluster creation
7. Original event traceability
8. Multi-bus confirmation
9. Explainable confirmation reason

---

# 39. Future Enhancements

Possible future enhancements:

- Road network matching
- Advanced spatial clustering
- Traffic trajectory fusion
- Historical recurrence modelling
- Predictive road deterioration
- Dynamic thresholds based on GPS accuracy
- Learned fusion models

These are not required for the initial MVP.

---

# 40. Final Fusion Flow

BUS EVENT 1 ──┐
               │
BUS EVENT 2 ──┼──→ FUSION ENGINE
               │
BUS EVENT 3 ──┘
                    ↓
             EVENT SIMILARITY
                    ↓
             SPATIAL CHECK
                    ↓
             TEMPORAL CHECK
                    ↓
          DISTINCT BUS CHECK
                    ↓
           FUSION CONFIDENCE
                    ↓
             FUSION CLUSTER
                    ↓
          CONFIRMED URBAN EVENT
                    ↓
             ROAD / TRAFFIC
               INTELLIGENCE
                    ↓
              GIS CONTROL
                  TOWER

This specification defines the BUSSENSE V2 Fusion and Urban Intelligence boundary.