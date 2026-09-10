\# BUSSENSE-V2 Configuration



This directory contains shared project configuration.



\## Purpose



Configuration should be centralized here where practical so that different BUSSENSE-V2 modules do not contain conflicting hardcoded values.



\## Configuration Areas



The project may use configuration for:



\- API base URLs

\- Environment selection

\- Event processing thresholds

\- Fusion parameters

\- Gateway settings

\- Evidence storage settings

\- Logging settings

\- Feature flags



\## Important Rules



\- Never store passwords, API keys, tokens, or other secrets in this directory.

\- Secrets must be provided through environment variables or an appropriate secret-management mechanism.

\- Do not hardcode machine-specific paths.

\- Do not silently change shared configuration values that affect another module.

\- Configuration changes that affect shared module behavior must be communicated to the Integration Lead.



\## Environment Strategy



BUSSENSE-V2 will support separate configuration for development, testing, and deployment environments.



The initial implementation should remain simple and should not introduce unnecessary configuration infrastructure.



\## Source of Truth



Shared architecture and interface behavior are defined by:



\- `docs/ARCHITECTURE.md`

\- `docs/EVENT\_CONTRACT.md`

\- `docs/API\_CONTRACT.md`

\- `docs/BUS\_DEVICE\_SPEC.md`

\- `docs/FUSION\_SPEC.md`



Configuration must support these contracts rather than redefine them.

