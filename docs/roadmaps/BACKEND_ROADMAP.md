# Backend Roadmap

## Phase 1 — Backend Foundation

- FastAPI application structure
- `/api/v1/health`
- canonical Event validation
- SQLite development persistence
- SQLAlchemy models/storage boundary
- event create/list/get/status APIs
- bus list/get/status APIs
- idempotent event ingestion
- predictable errors
- restart-safe persistence
- focused tests

## Phase 2 — Gateway Integration

- validate Gateway-produced canonical events
- support reliable retry semantics
- integrate evidence-reference flow as assigned
- verify offline synchronization compatibility

## Phase 3 — Fusion Integration

- expose observations required by Fusion
- persist/serve derived fusion records according to the frozen specification
- preserve source-event traceability

## Phase 4 — Analytics Integration

- expose analytics results through stable APIs
- add filtering/pagination as required by the deployment milestone

## Phase 5 — Control Tower Integration

- stable frontend-facing event, bus, fusion, and analytics APIs
- operational error/loading semantics

## Phase 6 — Hardening

- performance measurement
- security boundary hardening
- deployment database compatibility
- observability

Do not implement a later phase merely because the role prompt mentions it. Advance when the Integration Lead/task assignment calls for it.
