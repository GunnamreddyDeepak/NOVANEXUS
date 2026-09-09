# BUSSENSE V2 — Development Rules

## 1. Purpose

These rules define how the BUSSENSE V2 team develops, integrates, tests, and maintains the project.

The objective is to allow six developers to work in parallel without breaking shared interfaces or the overall architecture.

---

# 2. Project Authority

The System Architect / Integration Lead is responsible for:

- Maintaining the master architecture
- Maintaining shared contracts
- Reviewing architecture changes
- Coordinating integration
- Managing release readiness
- Reviewing cross-module changes
- Coordinating final system testing

The System Architect does not own every module's implementation.

Each team member owns their assigned module.

---

# 3. Master Architecture

The following documents define the current BUSSENSE architecture:

docs/ARCHITECTURE.md
docs/EVENT_CONTRACT.md
docs/API_CONTRACT.md
docs/BUS_DEVICE_SPEC.md
docs/FUSION_SPEC.md
docs/DEVELOPMENT_RULES.md

These documents are the source of truth for system-level development.

---

# 4. Module Ownership

## System Architect / Integration Lead

Owns:

- Architecture
- Shared contracts
- Integration
- Repository governance
- Code review
- End-to-end testing
- Final deployment
- Final SIH demonstration

## Edge AI Team

Owns:

- Camera processing
- YOLO inference
- Vehicle detection
- Vehicle tracking
- Road damage detection
- Temporal confirmation
- Edge AI performance

## Backend / Data Team

Owns:

- FastAPI
- PostgreSQL
- PostGIS
- Event persistence
- Bus/device registry
- Authentication
- Backend validation

## Frontend / GIS Team

Owns:

- React
- GIS
- Dashboard
- Event visualization
- Evidence visualization
- Analytics visualization
- Fusion visualization

## Fusion / Analytics Team

Owns:

- Multi-bus fusion
- Spatial correlation
- Temporal correlation
- Fusion confidence
- Road health
- Congestion analytics
- Recurring hazard intelligence

## Hardware / Gateway Team

Owns:

- GPS integration
- Camera interfaces
- Edge hardware
- Network connectivity
- Offline queue
- Edge Gateway
- Device health

---

# 5. Folder Ownership

The primary ownership boundaries are:

edge/
→ Edge AI

gateway/
→ Edge Gateway / Connectivity

backend/
→ Backend / Data

frontend/
→ Frontend / GIS

fusion/
→ Fusion / Analytics

hardware/
→ Hardware / GPS

models/
→ AI models and model configuration

tests/
→ Tests across modules

docs/
→ Architecture and technical contracts

The folder ownership is a responsibility boundary, not a restriction on necessary integration.

---

# 6. Main Branch Protection

The main branch represents the stable BUSSENSE V2 system.

Developers must not directly commit experimental work to main.

Feature branches should be used.

Examples:

feature/edge-ai
feature/backend
feature/frontend
feature/fusion
feature/hardware

---

# 7. Pull Requests

Changes should normally be submitted through pull requests.

A pull request should explain:

- What changed
- Why it changed
- Which module is affected
- Which API/contract is affected
- How it was tested
- Whether another module needs changes

Cross-module changes require special attention from the System Architect.

---

# 8. Commit Rules

Commits should be small and meaningful.

Good:

feat: add road damage temporal confirmation

fix: prevent duplicate event synchronization

refactor: separate dashboard event panel

Bad:

update stuff

final code

changes

new final final

---

# 9. Shared Contract Rule

The following must not be changed independently:

- Event schema
- Event types
- Event status values
- API endpoints
- API request formats
- API response formats
- Bus/device identity structure
- Fusion semantics

If a change is required:

1. Explain why.
2. Discuss the impact.
3. Update the relevant contract.
4. Update affected modules.
5. Test the integration.

---

# 10. No Silent Breaking Changes

A developer must not silently change an interface used by another module.

Example:

If Backend changes:

POST /api/v1/events

the Edge Gateway team must be informed before the change is merged.

---

# 11. Event Contract Rule

All modules must use the BUSSENSE Event Contract.

Developers must not create custom event formats for individual modules.

If a module requires additional information:

Use the metadata field where appropriate.

Do not duplicate core event fields unnecessarily.

---

# 12. API Rule

The frontend communicates with the backend through the documented API.

The Edge Gateway communicates with the backend through the documented API.

The frontend must not directly access the database.

The Edge AI module must not directly manipulate the central database.

---

# 13. Database Rule

Only the Backend / Data module should directly own database access.

Other modules communicate through defined interfaces.

Database schema changes must consider:

- API compatibility
- Existing events
- Fusion
- Analytics
- Frontend dependencies

---

# 14. AI Responsibility Rule

AI models produce observations.

AI confidence does not automatically mean operational confirmation.

The system should use:

AI Detection
→ Event Validation
→ Fusion
→ Rule-based Decision

The AI module must not independently declare a city-level condition confirmed without the required validation/fusion logic.

---

# 15. Simulation Rule

Simulated data is allowed for:

- Development
- Testing
- Demonstration
- Hardware-unavailable scenarios

However, simulated data must always be clearly identified.

Allowed source labels include:

SIMULATED_EDGE
TEST_DATA

Simulated data must never be intentionally presented as real sensor output.

---

# 16. GPS Rule

Hardware GPS must be distinguished from simulated GPS.

Allowed labels:

HARDWARE_GPS
SIMULATED_GPS

The system must not claim simulated coordinates are measurements from physical GPS hardware.

---

# 17. Evidence Rule

Evidence should be associated with event IDs.

Evidence should be relevant to the event.

The system should avoid continuous raw video uploads.

Prefer:

Event
+
metadata
+
relevant image/short clip

instead of:

continuous raw video transmission.

---

# 18. Security Rule

Never commit:

- Passwords
- API keys
- Tokens
- Private keys
- Credentials
- Production secrets

to Git.

Use environment configuration or secure secret management.

---

# 19. Configuration Rule

Do not scatter hard-coded configuration throughout source code.

Important configuration should eventually be centralized.

Examples:

- API URL
- Database URL
- AI confidence thresholds
- Fusion radius
- Fusion time window
- Model paths
- Device identity

Development defaults may exist, but production configuration should be replaceable.

---

# 20. Testing Rule

Each module must provide tests appropriate to its functionality.

Examples:

Edge AI:
- Detection test
- Temporal confirmation test

Gateway:
- Offline queue test
- Synchronization test

Backend:
- Event validation test
- Duplicate event test
- API test

Fusion:
- Same-bus test
- Multi-bus test
- Spatial threshold test
- Temporal threshold test

Frontend:
- API rendering test
- Event display test

Hardware:
- GPS parsing test
- Device interface test

---

# 21. Integration Testing

Unit tests alone are not sufficient.

BUSSENSE must also have end-to-end integration tests.

Minimum flow:

Edge Detection
→ Event
→ Gateway
→ API
→ Database
→ Fusion
→ Frontend

This flow must be tested before major releases.

---

# 22. Offline Testing

The team must explicitly test:

Network available
→ Event transmitted

Network unavailable
→ Event stored locally

Network restored
→ Event synchronized

Repeated retry
→ No duplicate event

This is a core BUSSENSE capability.

---

# 23. Fusion Testing

The team must verify:

Case 1:
One bus sees a pothole multiple times.

Expected:
Not multi-bus confirmed.

Case 2:
Two buses see the same pothole.

Expected:
Potential multi-bus fusion.

Case 3:
Three buses see the same pothole.

Expected:
High-confidence multi-bus confirmation.

Case 4:
Two buses see different potholes.

Expected:
Separate events.

Case 5:
Same location but very different times.

Expected:
Do not automatically fuse.

---

# 24. Performance Rule

The team should consider:

- Edge inference speed
- CPU/GPU utilization
- Memory
- Power consumption
- Network bandwidth
- API latency
- Database performance

Optimization should be driven by measured bottlenecks rather than premature complexity.

---

# 25. Feature Addition Rule

Before adding a feature, ask:

1. Does it solve the problem statement?
2. Does it improve the core system?
3. Can it be implemented reliably?
4. Can it be demonstrated?
5. Can it be tested?
6. Does the team have time to support it?

If the answer is mostly no, the feature should not enter the MVP.

---

# 26. No Unnecessary Technology

BUSSENSE should not add technology simply because it is popular.

Examples of technologies that should not be added without a clear architectural reason:

- Blockchain
- Large language models
- Kubernetes
- Large microservice deployments
- Complex message brokers
- Unnecessary cloud services

Technology selection must serve the problem.

---

# 27. V1 Reuse Rule

V1 is treated as a proven prototype.

Components may be reused when technically suitable.

Possible reusable components include:

- YOLO vehicle detection
- Road damage model
- Temporal confirmation
- Event concepts
- FastAPI foundation
- Frontend visual design
- Simulator

V1 code should not be copied blindly.

Every migrated component must be reviewed against the V2 contracts.

---

# 28. Data Cleanup Rule

Development and demo data must be separated where practical.

The final demonstration dataset should be controlled and reproducible.

Repeated development runs must not permanently pollute the final demo dataset.

---

# 29. Documentation Rule

Important architectural decisions must be documented.

If a design decision affects multiple modules:

Document it.

Avoid relying on private conversations or verbal instructions as the only source of system knowledge.

---

# 30. Communication Rule

When a developer becomes blocked:

Report:

1. What they are trying to implement.
2. What they expected.
3. What actually happened.
4. Error/log output.
5. What they already tried.
6. Which dependency is blocking them.

Do not silently work around another module's contract.

---

# 31. Integration Schedule

Integration should occur continuously.

Minimum milestones:

Integration 1:
Edge → Event → Backend

Integration 2:
Edge → GPS → Gateway → Backend

Integration 3:
Multiple buses → Fusion

Integration 4:
Backend → GIS → Analytics

Final:
Camera → AI → Event → GPS → Gateway → Backend → Fusion → Analytics → GIS

---

# 32. Release Rule

A version is considered integration-ready only when:

- Core APIs work
- Event contract is respected
- Offline synchronization works
- Fusion works
- Frontend receives backend data
- No known critical integration failure exists
- Demonstration path has been tested

---

# 33. System Architect Decision Rule

The System Architect should prioritize:

1. System correctness
2. Contract stability
3. Integration
4. Reliability
5. Demonstrability
6. Performance
7. Feature expansion

A feature that makes one module better but breaks the system should not be merged.

---

# 34. Definition of Done

A feature is not "done" merely because its code runs locally.

A feature is done when:

- Implementation is complete
- Interface follows the contract
- Tests exist where appropriate
- Documentation is updated if needed
- Integration impact is checked
- Code is committed
- Pull request is reviewed
- Integration works

---

# 35. Final Team Principle

BUSSENSE is one system, not six independent projects.

Every module must contribute to the common architecture.

The objective is:

EDGE INTELLIGENCE
+
RELIABLE EVENTS
+
MULTI-BUS FUSION
+
URBAN ANALYTICS
+
GIS VISUALIZATION
=
BUSSENSE

The team should optimize for a reliable end-to-end system rather than maximizing the number of individual features.

---

# 36. Architecture Change Authority

The following require System Architect review before implementation:

- New major module
- New communication protocol
- Event schema change
- API breaking change
- Database architecture change
- Fusion logic change
- Hardware architecture change
- New external service
- New AI subsystem
- New security mechanism

Minor implementation details within a module may be decided by that module owner.

---

# 37. Final Development Philosophy

Build small.
Integrate early.
Test continuously.
Document important decisions.
Do not fake capabilities.
Do not over-engineer.
Protect the contracts.
Keep the system demonstrable.

BUSSENSE V2 must remain a coherent, working urban intelligence platform.