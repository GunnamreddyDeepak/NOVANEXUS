# BUSSENSE V2 — AI Assistant System

## 1. Purpose

This document defines how AI coding assistants operate in BUSSENSE V2.

The goal is to let each teammate use AI as a continuous role-specific engineering assistant while keeping the six-person project safe, modular, testable, and integrable.

AI is an implementation worker and engineering reviewer inside an assigned ownership boundary. It is not an authority over architecture or shared contracts.

## 2. Source-of-Truth Hierarchy

When instructions appear to conflict, use this order:

1. Frozen system contracts and architecture:
   - `docs/ARCHITECTURE.md`
   - `docs/EVENT_CONTRACT.md`
   - `docs/API_CONTRACT.md`
   - `docs/BUS_DEVICE_SPEC.md`
   - `docs/FUSION_SPEC.md`
   - `docs/DEVELOPMENT_RULES.md`
2. `docs/AI_COMMON_PROMPT.md`
3. This AI Assistant System
4. The applicable role assistant under `docs/ai-assistants/`
5. The applicable role prompt under `docs/roles/`
6. The applicable roadmap under `docs/roadmaps/`
7. The current task explicitly assigned by the developer

A lower-level instruction must never silently override a higher-level contract.

## 3. Permanent Operating Model

Each teammate should keep one role-specific AI conversation or project workspace for ongoing work.

The AI should inspect the current Git branch and repository before significant implementation work. It should not require the developer to repeatedly paste the entire project context when the repository and project documents are already available to it.

Normal loop:

```text
Inspect current state
    ↓
Select assigned task
    ↓
Implement inside ownership boundary
    ↓
Run relevant tests/checks
    ↓
Inspect diff
    ↓
Commit focused change
    ↓
Push feature branch
    ↓
Open/update PR when ready
```

## 4. Ownership Principle

An AI may freely modify implementation inside its owned module when the change does not alter a shared contract or another team's interface.

Ownership map:

| Role | Primary ownership |
|---|---|
| Edge AI | `edge/` and Edge-specific tests |
| Backend | `backend/` and Backend-specific tests |
| Frontend/GIS | `frontend/` and Frontend-specific tests |
| Fusion/Analytics | `fusion/`, `analytics/`, and related tests |
| Gateway/Hardware | `gateway/`, `hardware/`, and related tests |
| Integration/QA | cross-module tests, CI/integration tooling, integration verification |

The Integration/QA role may inspect every module but should avoid becoming an implementation owner for another role's core code.

## 5. Protected Areas

Role AIs must not casually modify:

```text
docs/ARCHITECTURE.md
docs/EVENT_CONTRACT.md
docs/API_CONTRACT.md
docs/BUS_DEVICE_SPEC.md
docs/FUSION_SPEC.md
docs/DEVELOPMENT_RULES.md
```

They also must not modify another team's implementation merely to make their own task easier.

If a change genuinely requires a shared-contract or cross-module change, stop and escalate to the Integration Lead.

## 6. What AI May Decide Autonomously

The role AI may decide, within its ownership boundary:

- internal file/module organization
- function/class names
- implementation details
- local refactoring
- unit-test structure
- reasonable internal abstractions
- local bug fixes
- local performance improvements supported by measurement
- test fixtures and local development helpers

Do not ask the Integration Lead for every ordinary coding decision.

## 7. Mandatory Escalation Conditions

Stop and report to the Integration Lead when any of these is required:

- changing a frozen contract
- changing a shared event field or event type/status
- changing an existing public API request/response
- adding a new cross-module API or protocol
- modifying another team's implementation
- changing a shared dependency in a way that can affect another role
- changing database ownership/boundaries
- changing MQTT/HTTP/device communication semantics
- changing Fusion semantics or scoring rules
- changing security architecture
- introducing major infrastructure
- resolving a contract ambiguity that materially affects another module
- deleting or weakening an existing integration guarantee

The AI must explain the conflict and proposed options. It must not silently choose a system-wide solution.

## 8. Definition of Done for AI Work

A task is not complete merely because code was generated.

The AI must:

1. implement the assigned behavior
2. follow the frozen contracts
3. add/update appropriate tests
4. run relevant tests/checks
5. inspect the final diff
6. confirm scope stayed inside ownership
7. report assumptions and limitations
8. create a focused commit when the developer asks it to commit
9. leave the branch ready for review/PR

## 9. Git Rules

Never work directly on `main` or `integration` for normal feature development.

Use:

```text
feature/<role> → integration → main
```

Before starting a task:

```powershell
git status
git branch --show-current
git fetch origin
git switch integration
git pull origin integration
git switch feature/<role>
git pull --ff-only origin feature/<role>
```

Do not blindly merge/rebase another branch. If the role branch has diverged in a way that creates a conflict, report it before using a destructive or complicated resolution.

Use focused commits. Inspect `git diff` before committing.

## 10. Pull Request Rule

A feature branch becomes an integration candidate through a Pull Request into `integration`.

The PR description should state:

- task completed
- files changed
- tests/checks run
- contract impact: none / reviewed / blocked
- dependencies changed: yes/no
- known limitations
- integration risks

The Integration Lead reviews cross-module impact before merge.

## 11. Integration Philosophy

Do not wait until the entire project is finished to integrate.

Integrate small, tested increments.

Prefer:

```text
small feature
→ test
→ PR
→ integration
```

over:

```text
three weeks of independent work
→ huge merge
→ conflict resolution
```

## 12. AI Must Not Create Fake Progress

The AI must never claim that a module is implemented when it is only scaffolded, mocked, simulated, or planned.

Use the project's documented distinction between:

- implemented
- simulated
- planned
- assumed

## 13. Project-Assistant Interaction

The teammate should normally give short task instructions such as:

> Continue the assigned roadmap from the current repository state. Inspect the branch, identify the next unfinished task, implement it within my ownership boundary, run the relevant tests, and report any integration blocker.

The AI should not repeatedly request the complete project prompt if the relevant repository documents are already available.

## 14. No Shared AI State File

Do not create a shared progress/state document that every role AI edits.

Progress is represented by Git branches, commits, pull requests, tests, and the current roadmap. This avoids an unnecessary shared-file conflict hotspot.

## 15. Integration Lead Principle

The Integration Lead should spend time on:

- system-level decisions
- contract approval
- cross-module compatibility
- PR review
- E2E testing
- release readiness

The Integration Lead should not become the routine debugger for isolated module code.
