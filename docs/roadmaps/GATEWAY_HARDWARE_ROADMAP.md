# Gateway/Hardware Roadmap

## Phase 1 — Gateway Foundation

- device abstraction
- transport abstraction
- local persistent queue
- queue state transitions
- health/status

## Phase 2 — Offline Reliability

- retry/backoff
- restart persistence
- oldest-first synchronization
- permanently failing event handling without blocking all later events
- duplicate-safe delivery

## Phase 3 — Location & Evidence

- GPS/LocationProvider abstraction
- HARDWARE_GPS vs SIMULATED_GPS
- bounded evidence retention
- evidence upload ordering

## Phase 4 — Backend Integration

- HTTP transport to `/api/v1/events`
- successful-response semantics
- evidence-first synchronization where required

## Phase 5 — Hardware Readiness

- device health
- communication diagnostics
- configurable deployment parameters

Do not couple Gateway to central database internals.
