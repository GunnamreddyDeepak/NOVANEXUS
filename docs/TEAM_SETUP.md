# BUSSENSE V2 — Team Development Setup

## 1. Purpose

This document is the shared setup guide for the six-member BUSSENSE team.

BUSSENSE is being built as a real, modular and testable project. Some modules are currently scaffolds; that does not reduce the target architecture.

## 2. Team

| Member | Responsibility | Branch |
|---|---|---|
| Deepak | System Architecture + Integration/QA | `integration` |
| Rakesh | Edge AI + Computer Vision | `feature/edge-ai` |
| Rishitha | Backend + Data | `feature/backend` |
| Dharmika | Frontend + GIS | `feature/frontend` |
| Anwitha | Fusion + Analytics | `feature/fusion` |
| Vyshnavi | Gateway + Hardware | `feature/hardware` |


## 3. Standard Environment

Baseline used by the current repository:

- Python 3.12.x
- Node.js 22.x
- npm 11.x with Node 22
- Git for Windows
- VS Code

Keep Python major/minor and Node major aligned across the team.

## 4. Clone and Branch

```powershell
git clone <REPOSITORY_URL>
cd BUSSENSE-V2
git switch integration
git pull origin integration
```

Create/update your role branch from current integration:

```powershell
git switch integration
git pull origin integration
git switch feature/<your-role>
```
If your role branch does not exist locally, create it from the current `integration` branch:

```powershell
git switch integration
git pull origin integration
git switch -c feature/<your-role>
git push -u origin feature/<your-role>

## 5. Python Environment

```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python --version
python -m pip --version
```

Install the profile for your role:

```powershell
Install only the dependency profile required for your role:

```powershell
# Backend
python -m pip install -r requirements/backend.txt

# Edge AI
python -m pip install -r requirements/edge.txt

# Fusion/Analytics
python -m pip install -r requirements/fusion.txt

# Gateway/Hardware
python -m pip install -r requirements/gateway.txt

# Testing
python -m pip install -r requirements/test.txt

Integration/QA environment:

```powershell
python -m pip install -r requirements/backend.txt -r requirements/edge.txt -r requirements/fusion.txt -r requirements/gateway.txt -r requirements/test.txt
```


Verify:

```powershell
python -m pip check
```

Expected:

`No broken requirements found.`

## 6. Current Frontend Baseline

The repository already contains a Vite/React application with `package.json` and `package-lock.json`.

Do not recreate the application or replace the package manager setup independently.

From `frontend/`:

```powershell
npm ci
npm run build
npm run lint
```

Frontend feature work should replace the starter UI with BUSSENSE screens while preserving the shared API boundary.

## 7. Before Coding

Run:

```powershell
git status
git branch --show-current
python --version
```

Read:

```text
docs/ARCHITECTURE.md
docs/EVENT_CONTRACT.md
docs/API_CONTRACT.md
docs/BUS_DEVICE_SPEC.md
docs/FUSION_SPEC.md
docs/DEVELOPMENT_RULES.md
docs/roles/<your-role>.md
```

## 8. AI-Assisted Development

Use:

```text
COMMON PROMPT
+ ROLE PROMPT
+ relevant contracts
+ current repository code
+ exact task
```

AI must inspect existing code before modifying it.

Never allow AI to invent APIs, hardware capabilities, accuracy figures, datasets or deployment claims.

## 9. Git Discipline

Use focused commits:

```powershell
git status
git diff
git add <specific-files>
git commit -m "feat: <clear change>"
git push -u origin feature/<your-role>
```

Avoid `git add .` unless you intentionally inspected the complete working tree.

Never commit `.venv`, `node_modules`, `.env`, generated evidence, model binaries or runtime queues.

## 10. Integration

The Integration Lead merges/testing candidates into `integration`.

Before requesting integration, provide:

- what changed
- files changed
- contract impact
- dependencies changed
- tests run
- known limitations

## 11. Current Repository Reality

The current repository contains:

- shared architecture/contracts
- Python module directories
- dependency profiles
- an initialized React/Vite frontend

Several Python module entry points are still scaffolds. Developers must not invent run commands until the relevant entry point is actually implemented.

## 12. Definition of Done

A feature must:

- follow the contracts
- have appropriate tests
- avoid secrets/generated artifacts
- be reviewable
- integrate with dependent modules
- document important assumptions
- be honestly labelled if simulated
