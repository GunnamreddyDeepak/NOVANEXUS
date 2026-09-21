# BUSSENSE Gateway

The BUSSENSE Gateway is the bus-side transport boundary between Edge AI and
the central backend.

## Prototype responsibilities

- Receive canonical Edge events.
- Persist unsynchronized events locally.
- Attempt HTTP synchronization with the backend.
- Retain events when the backend is unavailable.
- Retry pending events when connectivity returns.
- Remove events from the local buffer only after backend acceptance.

## Transport

Prototype transport:

HTTP POST /api/v1/events

Backend URL is configured with:

BUSSENSE_BACKEND_URL

Example:

$env:BUSSENSE_BACKEND_URL="http://127.0.0.1:8010"

## Local buffer

Pending events are stored under:

gateway/data/

This directory is runtime data and is excluded from Git.

## Integration test

The E2E integration test requires a running BUSSENSE backend.

Run the backend:

uvicorn backend.main:app --host 127.0.0.1 --port 8010

Set:

$env:BUSSENSE_BACKEND_URL="http://127.0.0.1:8010"

Then run:

python -m pytest tests/test_e2e_edge_gateway_backend.py -q