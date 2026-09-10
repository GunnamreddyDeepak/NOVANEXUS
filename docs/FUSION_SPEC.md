# BUSSENSE V2 — Fusion & Urban Intelligence Specification

## 1. Purpose

Fusion determines whether independent bus observations correspond to the same real-world urban condition.

One detection is an observation. Multiple consistent observations may strengthen evidence for one condition.

## 2. Eligible Event Types

Initial point-event fusion:

- `ROAD_DAMAGE`
- `WATERLOGGING`
- `INFRASTRUCTURE_DAMAGE`

Special handling:

- `CONGESTION`: area/time aggregation
- `SUSPECTED_INCIDENT`: incident-specific tracking/correlation
- `PEDESTRIAN_RISK`: short-duration temporal logic

## 3. Correlation Dimensions

Fusion considers:

1. event type/subtype compatibility
2. spatial distance
3. temporal distance
4. independent bus identity
5. source confidence
6. GPS quality when actually available

Initial configurable thresholds:

- spatial radius: **50 m**
- time window: **30 min**

These are starting values, not universal truths.

## 4. Event Similarity

Strong match:

`ROAD_DAMAGE + POTHOLE` with `ROAD_DAMAGE + POTHOLE`

Do not merge unrelated conditions simply because they are geographically close.

## 5. Independent Bus Rule

Multi-bus confirmation requires at least two distinct `bus_id` values.

```text
BUS-101 + BUS-104 = independent buses
BUS-101 + BUS-101 = one bus
BUS-101 FRONT + BUS-101 REAR = one bus
```

Different cameras on the same bus never count as independent buses.

## 6. Fusion Cluster

A cluster contains original observations believed to describe one real-world condition.
A fusion cluster is a derived record and is separate from the original event records.

Fusion must never overwrite or delete the original observations.

Example:

```text
FUS-000001
  EVT-001 → BUS-101
  EVT-014 → BUS-104
  EVT-027 → BUS-108
```

Original events remain queryable and traceable.

## 7. Explainable Initial Score

The first implementation should use transparent rules.

Initial implementation may use the following transparent scoring model:

```text
score = 50

+ 10 × (independent_bus_count - 1)

+ spatial_score (0–20)
+ temporal_score (0–15)

+ 5 if subtype matches

Clamp final score to 0–100.

The implementation must document the exact formula it uses. Do not claim the score is a statistically calibrated probability unless it has been validated as such.

## 8. Fusion Status

Suggested derived states:

- `CANDIDATE`
- `CONFIRMED`
- `STALE`
- `RESOLVED`

An original observation status and a fusion-cluster status are different concepts.
Fusion-cluster status must not be confused with the lifecycle status of an individual event.

An individual event may reference or contribute to a fusion cluster while retaining its own event lifecycle status.

## 9. Same-Bus Repetition

Repeated observations from one bus may:

- consolidate duplicate observations
- improve temporal evidence
- help tracking

They must not produce multi-bus confirmation.

## 10. Spatial Handling

Use geographic distance, not coordinate-string comparison.

If GPS is missing, the observation can remain valid but cannot participate in location-based fusion until another approved correlation method is available.

If GPS accuracy is provided by the device, preserve and consider it. Never invent accuracy.

## 11. Road Segment Intelligence

When spatial database support is available, clusters may be associated with road segments.

This enables:

```text
individual observations
→ persistent road condition
→ road-segment health
```

## 12. Congestion

Congestion is generally better represented as an area/time signal than as repeated point-event merging.

Useful inputs may include:

- vehicle counts
- tracked objects
- average/estimated speed where available
- route/location
- time window

## 13. Duplicate Fused Events

Before creating a new cluster, Fusion must check for an existing compatible active cluster using its configured spatial/temporal rules.

A cluster must retain the set of contributing `event_id` values.

## 14. Traceability

A fused record must be able to answer:

- which observations contributed?
- which buses contributed?
- when were they observed?
- where were they observed?
- what classifications/confidences were reported?
- why were they considered related?

## 15. Authority Boundary

Fusion produces machine-generated intelligence. It does not make legal or operational decisions on behalf of authorities.

## 16. MVP

Minimum fusion tests:

1. same bus repeated → not multi-bus
2. two buses, same condition, close in space/time → candidate/confirmed according to threshold
3. three buses → stronger evidence
4. different nearby defects → separate clusters
5. same place but outside time window → separate
6. same bus with multiple cameras → one bus
7. missing GPS → no invented location
