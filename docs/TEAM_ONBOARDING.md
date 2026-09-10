# BUSSENSE-V2 — Team Onboarding

## 1. Purpose

BUSSENSE-V2 is being developed as one integrated system by a six-member team.

Every member owns one module, but all modules must follow the shared architecture and contracts.

The project must NOT become six independent projects.

The master references are:

- `docs/ARCHITECTURE.md`
- `docs/EVENT_CONTRACT.md`
- `docs/API_CONTRACT.md`
- `docs/BUS_DEVICE_SPEC.md`
- `docs/FUSION_SPEC.md`
- `docs/DEVELOPMENT_RULES.md`

Read the relevant documents before starting implementation.

---

# 2. Team Structure

| Member | Role | Branch |
|---|---|---|
| Deepak | System Architect + Integration Lead | `integration` |
| Rakesh | Edge AI Engineer | `feature/edge-ai` |
| Rishitha | Backend + Database Engineer | `feature/backend` |
| Dharmika | Frontend + GIS Engineer | `feature/frontend` |
| Anwitha | Fusion + Analytics Engineer | `feature/fusion` |
| Vyshnavi | Hardware + Edge Gateway Engineer | `feature/hardware` |

---

# 3. Golden Rule

Do NOT directly modify another member's module without coordination.

Before changing a shared interface, schema, event field, API, or architecture decision:

1. Check the relevant contract.
2. Discuss the change with the Integration Lead.
3. Update the relevant documentation if required.
4. Make the change in a controlled commit.
5. Test affected modules.

No silent breaking changes are allowed.

---

# 4. Repository Workflow

## Main Branch

`main` represents the stable project baseline.

Team members must NOT develop directly on `main`.

## Integration Branch

`integration` is used by the Integration Lead for combining and testing completed module work.

## Feature Branches

Each member works primarily on their assigned feature branch.

Branches:

```text
feature/edge-ai
feature/backend
feature/frontend
feature/fusion
feature/hardware