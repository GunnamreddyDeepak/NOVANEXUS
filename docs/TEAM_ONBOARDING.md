# BUSSENSE V2 — Team Onboarding

## 1. One-System Rule

BUSSENSE is one integrated system.

Each member owns a module, but shared contracts and end-to-end behavior belong to the whole team.

## 2. Master Documents

Before implementation, read:

- `docs/ARCHITECTURE.md`
- `docs/EVENT_CONTRACT.md`
- `docs/API_CONTRACT.md`
- `docs/BUS_DEVICE_SPEC.md`
- `docs/FUSION_SPEC.md`
- `docs/DEVELOPMENT_RULES.md`
- `docs/TEAM_SETUP.md`

## 3. Team Structure

| Member | Role |
|---|---|
| Deepak | System Architect + Integration Lead |
| Rakesh | Edge AI |
| Rishitha | Backend/Data |
| Dharmika | Frontend/GIS |
| Anwitha | Fusion/Analytics |
| Vyshnavi | Gateway/Hardware |

## 4. Shared Contract Rule

Do not silently change:

- event fields/types
- API endpoints
- API request/response formats
- event status/source values
- fusion semantics
- module boundaries

Discuss the change with the Integration Lead first.

## 5. Development Flow

```text
feature branch
      ↓
tests + diff review
      ↓
Integration Lead review
      ↓
integration
      ↓
end-to-end tests
      ↓
main
```

## 6. Golden Integration Principle

The most important test is not whether one module works alone.

It is whether:

```text
Edge
→ Event
→ Offline Queue
→ Gateway
→ Backend
→ Persistence
→ Fusion
→ Analytics
→ GIS
```

works as one system.

## 7. Honest Capability Rule

Distinguish:

- implemented
- simulated
- planned
- unavailable

Never describe simulated GPS, events or AI as live hardware/production measurements.
