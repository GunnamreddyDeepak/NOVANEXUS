# BUSSENSE V2 — Team Development Setup

## 1. Purpose
This document defines the standard development environment and workflow for the BUSSENSE V2 team.

BUSSENSE is currently an SIH prototype scaffold. Project contracts and dependency profiles exist, while some application entry points are not implemented yet. Do not invent or duplicate architecture independently; `docs/` and the actual repository are the source of truth.

## 2. Standard Environment
| Tool | Required version | Notes |
|---|---|---|
| Python | 3.12.x | Same major/minor version across the team |
| Node.js | 22.x | Required when the frontend is initialized |
| npm | Bundled with Node.js 22.x | |
| Git | Current stable Git for Windows | Required |
| VS Code | Current stable | Recommended common IDE |

Patch versions may differ unless the team explicitly freezes them later.

## 3. Repository Structure
```text
BUSSENSE-V2/
├── analytics/
├── backend/
├── config/
├── docs/
├── edge/
├── frontend/
├── fusion/
├── gateway/
├── hardware/
├── models/
├── requirements/
└── tests/
```
Some directories are scaffolds and are not necessarily runnable yet.

## 4. First-Time Clone
```powershell
git clone <REPOSITORY_URL>
cd BUSSENSE-V2
git switch integration
git pull origin integration
```

## 5. Python Virtual Environment
From the repository root:
```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python --version
python -m pip --version
```
Expected Python family: `3.12.x`.

## 6. Python Dependency Profiles
Install only the profile needed for the role.

Backend:
```powershell
python -m pip install -r requirements/backend.txt
```

Edge AI:
```powershell
python -m pip install -r requirements/edge.txt
```

Fusion / Analytics:
```powershell
python -m pip install -r requirements/fusion.txt
```

Gateway:
```powershell
python -m pip install -r requirements/gateway.txt
```

Tests:
```powershell
python -m pip install -r requirements/test.txt
```

Integration/QA full environment:
```powershell
python -m pip install -r requirements/backend.txt -r requirements/edge.txt -r requirements/fusion.txt -r requirements/gateway.txt -r requirements/test.txt
```

NumPy is currently pinned to `2.2.6` for Edge/Fusion compatibility. Do not independently upgrade it.

## 7. Verify Dependencies
```powershell
python -m pip check
```
Healthy output should include:
```text
No broken requirements found.
```

## 8. Frontend Status
`frontend/` is currently empty.

**Do not run `npm install` or create an independent frontend application yet.** The frontend stack will be initialized once and committed as a shared baseline. This document will then be updated with the exact commands.

## 9. Environment Variables and Secrets
Never commit secrets, API keys, passwords, certificates, private keys, or machine-specific credentials.

Local environment files such as `.env` and `.env.*` are ignored by Git. When adding a new environment variable, document its purpose and notify the integration lead. Never commit its real secret value.

## 10. Git Workflow
Do not develop directly on `main`.

```text
feature branch → integration → main
```

Create a feature branch from the latest integration branch:
```powershell
git switch integration
git pull origin integration
git switch -c feature/<your-role>
```

Existing role branches include:
```text
feature/backend
feature/edge-ai
feature/frontend
feature/fusion
feature/hardware
```

Before work:
```powershell
git switch integration
git pull origin integration
git switch feature/<your-role>
```

Commit focused changes:
```powershell
git status
git diff
git add <specific-files>
git commit -m "Short description of the change"
git push -u origin feature/<your-role>
```

Avoid `git add .` unless the complete working tree has been inspected intentionally.

## 11. Integration Rules
Before changing shared behavior, read:
- `docs/ARCHITECTURE.md`
- `docs/API_CONTRACT.md`
- `docs/EVENT_CONTRACT.md`
- `docs/BUS_DEVICE_SPEC.md`
- `docs/FUSION_SPEC.md`
- `docs/DEVELOPMENT_RULES.md`

Architecture, API, event-schema, dependency, and cross-module changes require integration-lead review.

Do not silently change field names, types, endpoint behavior, event types, message formats, or shared configuration.

## 12. AI-Assisted Development
Use:
```text
COMMON PROMPT
+ ROLE PROMPT
+ relevant project docs
+ current repository code
+ current task
```

Shared prompts are in:
```text
docs/AI_COMMON_PROMPT.md
docs/roles/
```

AI-generated code must be reviewed by the responsible developer. AI must inspect the repository and project contracts before proposing implementation changes.

## 13. Current Module Status
Known baseline state:
- `backend/main.py` is currently an empty scaffold.
- `frontend/` is currently empty.
- Other module directories may also contain scaffolding rather than complete implementations.

Therefore, **do not use undocumented run commands or assume an application server is already available.** Verified run commands will be added as modules become runnable.

## 14. Before Starting Feature Work
Each developer should run:
```powershell
git status
git branch --show-current
python --version
```
Python-role developers should also run:
```powershell
python -m pip check
```
Then read the relevant role prompt and project contracts.

## 15. Definition of Done
Before requesting integration:
1. The feature follows the project contracts.
2. No secrets or generated runtime files are committed.
3. Dependencies are changed only when necessary and documented.
4. Relevant tests/checks pass.
5. The Git diff has been inspected.
6. The feature is pushed to its feature branch.
7. Integration-impacting changes are clearly communicated.

## 16. Troubleshooting
Wrong Python interpreter:
```powershell
python --version
Get-Command python
.\.venv\Scripts\Activate.ps1
```

Dependency conflict:
```powershell
python -m pip check
```
Do not randomly upgrade/downgrade packages; inspect the relevant requirements files and coordinate cross-module changes.

Unexpected Git files:
```powershell
git status
```
Do not commit virtual environments, `.env` files, generated evidence, runtime queues, model binaries, or IDE metadata.

## 17. Current Baseline Rule
`integration` is the team's shared development baseline.

**When in doubt: inspect the repository, read the project contract, and ask before changing a shared interface.**
