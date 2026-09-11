# Integration & QA Roadmap

## Phase 1 — Repository Safety

- PR template
- CI baseline
- contract-presence checks
- module ownership checks

## Phase 2 — Contract Tests

- canonical Event validation
- Backend API compatibility
- Gateway retry/idempotency compatibility
- Fusion traceability

## Phase 3 — Module Integration

- Edge → Gateway
- Gateway → Backend
- Backend → Fusion
- Backend → Frontend

## Phase 4 — E2E Demo Path

- event generation
- offline buffering
- synchronization
- multi-bus fusion
- GIS visualization
- incident/analytics paths only where actually implemented

## Phase 5 — Release QA

- regression suite
- clean-machine setup verification
- performance checks
- demo rehearsal
- honest capability/limitation review

The Integration Lead should not fix isolated module code unless explicitly assigned; route failures to the owning role whenever possible.
