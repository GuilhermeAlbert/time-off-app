# ExampleHR Time-Off

This project demonstrates a Time-Off workflow where an external HCM system remains the source of truth while the frontend provides a fast and trustworthy user experience.

## Overview

ExampleHR Time-Off lets employees view location-based leave balances, submit time-off requests, and lets managers approve or deny those requests. The product is designed to feel immediate while being honest about the fact that all final balances and decisions belong to HCM — not to the frontend.

## Key Concepts

**HCM as source of truth.** All balance data and request status come from the mock HCM API. The frontend never claims to own a balance or approve a request on its own authority.

**Optimistic pending.** When an employee submits a request, it appears immediately in the UI with status `Pending`. This is honest — ExampleHR received the intent, not HCM confirmation. If HCM rejects the submission, the entry is rolled back and an error is shown.

**No optimistic approved.** A request is never shown as `Confirmed` or `Approved` before HCM confirms it. Showing approval before HCM confirms it would misrepresent balance consumption.

**Reconciliation.** `useReconciliation` polls HCM every 30 seconds in the background. If a balance changes outside the app (e.g. a work-anniversary bonus), the UI shows a non-disruptive notice and marks the affected balance as stale. Reconciliation is deferred during an active submission to avoid race conditions.

**Silent-wrong recovery.** If HCM returns `201` but includes a `reconciliationHint` indicating the balance was not reserved, the UI shows a warning and treats the state as needing reconciliation rather than confirmed.

**Conflict handling.** If HCM returns `409` during submission or manager approval, the error is surfaced with a message. The optimistic state is rolled back for submissions. The manager card remains visible for decisions, allowing the manager to retry after reviewing the updated balance.

**Stale balances.** Balances carry a `syncStatus` (`fresh`, `refreshing`, `stale`). A stale balance is shown with a warning rather than a hard block — HCM re-validates on submission anyway.

## Architecture

Two feature routes, each fully colocated:

```txt
src/app/time-off/          — Employee workspace
src/app/manager/requests/  — Manager workspace
src/app/api/hcm/           — Mock HCM (Next.js route handlers)
```

Each feature owns its components, hooks, services, types, enums, schemas, and helpers. No global state. No shared data layer.

Pages are Server Components. Interactive sections use `"use client"` and push the client boundary as deep as possible.

## Running Locally

```bash
cd app
npm install
npm run dev
```

- Employee workspace: <http://localhost:3000/time-off>
- Manager workspace: <http://localhost:3000/manager/requests>
- HCM API: <http://localhost:3000/api/hcm/balances>

## Running Tests

```bash
cd app
npx vitest run
```

All tests are colocated with the source they protect. Tests cover API contracts, pure helpers, component states, and full hook integration flows.

## Running Storybook

```bash
cd app
npm run storybook
```

Stories cover all key UI states without a live server. Fetch is mocked in decorators. Interaction tests (`play` functions) verify four high-value behaviors: form validation, optimistic pending status, manager conflict, and balance refreshed notice.

## Mock HCM Features

The mock HCM lives at `src/app/api/hcm/` and supports simulation modes via `simulationMode` in POST bodies or `mode` query params:

| Mode | Behavior |
| --- | --- |
| `normal` | Standard success response |
| `conflict` | Returns 409 — stale balance or request version |
| `silent-wrong` | Returns 201 but leaves balance unreserved |
| `slow` | Delays before responding |
| `insufficient-balance` | Returns 409 — not enough days available |

Trigger an out-of-band balance change (anniversary bonus):

```bash
curl -X POST http://localhost:3000/api/hcm/simulations/anniversary-bonus \
  -H "Content-Type: application/json" \
  -d "{}"
```

Wait up to 30 seconds and the balance card in the employee workspace will show a stale notice.

## Documentation

| Document | Path |
| --- | --- |
| Technical Requirements | `docs/trd.md` |
| State Model | `docs/state-model.md` |
| API Contracts | `docs/api-contracts.md` |
| Testing Strategy | `docs/testing-strategy.md` |
| Coverage Proof | `docs/coverage-proof.md` |
| Submission Checklist | `docs/submission-checklist.md` |

## Tradeoffs

- **No cache library.** Fetching is direct and stateless. No SWR or TanStack Query. Simpler mental model at the cost of no automatic retry or deduplication.
- **Polling over push.** Reconciliation uses a 30-second interval. A production system would use WebSockets or SSE.
- **Mock HCM in-process.** State resets on every server restart. Multiple browser sessions share the same in-memory state.
- **Optimistic pending only.** Honest about the distinction between "ExampleHR received the intent" and "HCM confirmed the request."

## Known Limitations

- Balance cards do not auto-refresh their displayed values when reconciliation detects a change. A notice is shown; a reload is required to see new numbers.
- Manager approval relies on the balance loaded at page mount, not a live re-fetch per card.
- `RecentRequestsTable` on the time-off page uses static seed data. Submitted requests appear in the inline pending list inside the request form section.
- Employee ID is hardcoded as `employee-example-001`. There is no auth layer.
- Mock HCM state is in-memory and resets on server restart.
