# BUSSENSE V2 — Development Rules

## 1. Core Principle

BUSSENSE is one integrated system, not six independent projects.

Build toward:

`Edge Intelligence + Reliable Events + Offline Operation + Multi-Bus Fusion + Analytics + GIS`

## 2. Source of Truth

System-level behavior is defined by:

- `ARCHITECTURE.md`
- `EVENT_CONTRACT.md`
- `API_CONTRACT.md`
- `BUS_DEVICE_SPEC.md`
- `FUSION_SPEC.md`
- this document

If code conflicts with a contract, stop and resolve the conflict rather than silently choosing one.

## 3. Ownership

- Integration Lead: architecture, shared contracts, integration, release QA
- Edge AI: computer vision
- Backend/Data: API and persistence
- Frontend/GIS: Control Tower
- Fusion/Analytics: correlation and urban intelligence
- Gateway/Hardware: connectivity, GPS and offline edge operation

## 4. Git

Do not develop directly on `main`.

Flow:

```text
feature/<role> → integration → main
```

Before work:

```powershell
git switch integration
git pull origin integration
git switch feature/<role>
```

Keep commits focused and inspect `git diff` before committing.

## 5. Shared Changes

Integration Lead review is required for:

- event schema
- API endpoints/request/response formats
- event types/status values
- database boundary
- communication protocol
- fusion semantics
- hardware boundary
- major dependencies
- security architecture

No silent breaking changes.
For a shared contract change:

1. Identify the affected modules.
2. Update the relevant contract/documentation.
3. Obtain Integration Lead approval.
4. Update affected implementations and tests.
5. Verify end-to-end compatibility before merging to `integration`.

Do not merge a contract change while dependent modules still implement the previous contract.

## 6. Event Rule

All cross-module observations use the canonical Event Contract.

Do not invent module-specific event formats.

Use `metadata` only for genuinely event-specific attributes.

## 7. Boundary Rule

- Edge AI does not access the central database.
- Gateway does not manipulate central database internals.
- Frontend does not access the database.
- Backend owns central persistence.
- Fusion consumes events and produces derived intelligence.

## 8. AI Rule

AI produces observations.

AI confidence is not a legal or operational confirmation.

Use:

`AI Detection → Event Validation → Fusion → Rule/Authority Decision`

## 9. Simulation Rule

Simulation is allowed for development/testing/demo.

Simulated observations must be labelled with the appropriate `source_type`, such as `SIMULATED_EDGE`.

Never present simulated observations as live measurements.

Test fixtures that are not intended to represent an edge observation should remain test data and must not be submitted as production events.
## 10. GPS Rule

Use `HARDWARE_GPS` and `SIMULATED_GPS` distinctly.

Never invent GPS accuracy.

## 11. Offline Rule

Offline behavior is a core feature.

Required test:

```text
online → event delivered
offline → event persisted
recovery → event synchronized
retry → no duplicate
restart → pending event retained
```

## 12. Testing

Each module should have unit tests appropriate to its behavior.

Minimum integration tests:

```text
Event validation
→ persistence
→ duplicate retry
→ fusion
→ API retrieval
```

Gateway tests must include process restart and network failure.

Fusion tests must include same-bus vs multi-bus behavior.

## 13. Configuration

Do not scatter operational configuration through source code.

Centralize:

- API URL
- database URL
- device identity
- model path
- AI thresholds
- fusion radius
- fusion time window
- queue location

Local defaults are acceptable; secrets are not.

## 14. Security

Never commit:

- passwords
- tokens
- API keys
- private keys
- production credentials

Production device communication uses TLS and authentication.

## 15. Dependencies

Do not add packages without a reason.

The current Python project pins NumPy to `2.2.6` for Edge/Fusion compatibility. Coordinate dependency changes across roles.

Do not introduce Kafka/Kubernetes/blockchain/LLMs or other infrastructure solely for appearance.

## 16. Performance

Measure before optimizing.

Track where relevant:

- inference latency/FPS
- CPU/GPU
- memory
- queue growth
- API latency
- database latency
- bandwidth

## 17. Definition of Done

A feature is done when:

1. behavior is implemented
2. contract is followed
3. tests/checks pass
4. integration impact is reviewed
5. documentation is updated where needed
6. diff is inspected
7. feature branch is pushed
8. integration succeeds

## 18. Quality Bar

Prefer a smaller number of real, testable capabilities over many simulated claims.

The goal is a reliable end-to-end system that can be demonstrated honestly.
