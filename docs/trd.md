# ExampleHR Time-Off TRD

## Problem Summary

ExampleHR needs a Time-Off module that lets employees view location-based balances, submit time-off requests, and lets managers approve or deny those requests. The product must feel fast while being clear that final balances and decisions depend on the external Human Capital Management system, HCM. HCM is the source of truth; ExampleHR is a trusted frontend, not a second source of truth.

## Product Constraints

- HCM can return conflicts, slow responses, stale reads, or silent-wrong success responses.
- Balances can change outside ExampleHR at any time, including work-anniversary adjustments.
- ExampleHR must not present a request as approved before HCM confirms it.
- ExampleHR must not show a cached balance as authoritative without freshness context.
- The UI must recover gracefully from partial HCM failures without silent data corruption.
- Feature-specific code must stay colocated inside each App Router route.

## User Personas

- **Employee**: checks available time off by location and submits a request.
- **Manager**: reviews pending requests from employees and decides whether to approve or deny.
- **Reviewer**: evaluates whether the UI handles external-system uncertainty honestly without misleading either persona.

## Architecture Overview

The application uses the Next.js App Router. The `app/` directory is the router; `src/app/` holds all implementation. There are two feature routes:

- `src/app/time-off/` — employee workspace (balance list, request form, recent requests)
- `src/app/manager/requests/` — manager workspace (pending request cards with approve/deny)

The mock HCM lives in `src/app/api/hcm/` as App Router route handlers. Thin proxy files in `app/api/hcm/` re-export from `src/` to bridge the `app/`–`src/` split.

Each feature uses colocated components, hooks, services, types, enums, schemas, helpers, and data. No global state library. No shared component abstractions beyond what multiple routes reuse.

## API Design

All responses follow a shared envelope:

```
Success: { data: T }
Error:   { error: { code: HcmErrorCode, message: string } }
```

### Endpoints

| Method | Path | Purpose |
|--------|------|---------|
| `GET` | `/api/hcm/balances` | Fetch all balances for an employee |
| `GET` | `/api/hcm/balances/[balance-id]` | Fetch a single balance (authoritative re-check) |
| `POST` | `/api/hcm/requests` | Submit a time-off request |
| `GET` | `/api/hcm/requests` | List pending requests (manager view) |
| `POST` | `/api/hcm/requests/[request-id]/decision` | Approve or deny a request |
| `POST` | `/api/hcm/simulations/anniversary-bonus` | Trigger an out-of-band balance change |

### Simulation Modes

Request bodies accept a `simulationMode` field:

| Mode | Behavior |
|------|----------|
| `normal` | Standard HCM-backed success |
| `conflict` | Returns 409 with stale-state error |
| `silent-wrong` | Returns 201 but does not reserve the balance |
| `insufficient-balance` | Returns 409 with balance error |

## UI State Model

State is split into three categories:

**Server state** — data fetched from HCM and held in component hooks:
- `balances: TimeOffBalance[]` with `syncStatus` (fresh / refreshing / stale)
- `pendingRequests: ManagerPendingRequest[]` with enriched balance context

**Optimistic state** — local additions that represent intent before HCM confirms:
- `pendingRequests: OptimisticRequest[]` in `useRequestSubmission`
- Status is always `"pending"` — never `"confirmed"` or `"approved"`

**Ephemeral state** — form inputs, error messages, and transient notices:
- `submissionError`, `reconciliationWarning` in `useRequestSubmission`
- `decisionError` in `useManagerRequests`
- `balanceRefreshed`, `staleBalanceIds` in `useReconciliation`

## Data Fetching Strategy

Each feature fetches independently via `useEffect` in its hook:

- `useBalances` — fetches on mount, maps HCM balance fields to the feature's `TimeOffBalance` type including `syncStatus`
- `useManagerRequests` — runs `getPendingRequests()` and `getBalances()` in parallel, then enriches each request with its matching balance data
- `useReconciliation` — polls at a configurable interval (default 30 seconds) and compares fresh HCM balances to the current display

No SWR, React Query, or caching library is used. Fetching is direct and stateless.

## Optimistic vs Pessimistic Strategy

**Optimistic pending** is applied for employee request submission:
- The request is added to the pending list immediately, before HCM responds.
- Status is `"pending"` — this is honest: ExampleHR received the intent, not HCM approval.
- If HCM rejects the submission, the optimistic entry is rolled back and an error is shown.

**Pessimistic** is applied everywhere else:
- Balances are never updated until HCM responds.
- Manager approval waits for HCM confirmation before removing the request from the queue.
- A request is never shown as `"confirmed"` or `"approved"` based on local inference alone.

The asymmetry is intentional: optimistic pending is recoverable and honest. Optimistic approved would imply balance consumption before HCM confirms it, which could mislead both the employee and the manager.

## Cache Invalidation Strategy

There is no client-side cache. Data is re-fetched directly when needed:

- After a successful submission, the single balance is re-read via `getBalance(balanceId)` as a best-effort authoritative re-check. Errors on this re-read are silenced because background reconciliation will catch any discrepancy.
- Background reconciliation polls every 30 seconds and compares IDs plus values. When a change is detected, the UI shows a freshness notice.
- The manager view re-fetches requests and balances on initial load only. A page reload is required to see changes after that.

## Reconciliation Strategy

`useReconciliation` runs a background loop that detects mid-session balance changes:

1. Every `intervalMs` milliseconds, fetch balances from HCM.
2. Compare each balance's `availableDays` and `pendingDays` against the currently displayed values using `detectChangedBalanceIds`.
3. If changes are detected and no submission is in flight, set `balanceRefreshed: true` and mark the changed balance IDs as stale.
4. If a submission is in flight, queue the changed IDs and apply them once the submission completes.

The deferred application prevents a race condition where a reconciliation update would clobber an in-progress optimistic state.

## Background Refresh Strategy

`useReconciliation` uses a `setInterval` that fires every 30 seconds (default). The interval is:

- Cleared on component unmount via `useEffect` cleanup.
- Coordinated with submission state via a `useRef` that tracks whether a submission is in progress without causing re-renders.
- Configurable via an `intervalMs` parameter for test control.

Failures in the background fetch are silent — reconciliation is best-effort and should not interrupt the user's current task.

## Component Tree

```
time-off/page.tsx (Server Component)
├── BalanceList (Client Component)
│   └── BalanceCard × N
│       └── SyncStatusBadge
├── RequestSection (Client Component)
│   └── RequestForm
└── RecentRequestsTable (Client Component)

manager/requests/page.tsx (Server Component)
└── ManagerRequestsClient (Client Component)
    ├── ManagerRequestList
    │   └── ManagerRequestCard × N
    └── (loading skeleton / error / empty states)
```

Pages are Server Components; interactive leaf nodes use `"use client"`. Client boundaries are as deep as possible to keep Server-rendered HTML fast.

## State Ownership

| State | Owner | Scope |
|-------|-------|-------|
| `balances`, `isLoading`, `error` | `useBalances` → `BalanceList` | Time-off feature only |
| `pendingRequests`, `submissionError`, `reconciliationWarning` | `useRequestSubmission` → `RequestSection` | Time-off feature only |
| `balanceRefreshed`, `staleBalanceIds` | `useReconciliation` → `RequestSection` | Time-off feature only |
| `requests`, `isLoading`, `error`, `decisionError` | `useManagerRequests` → `ManagerRequestsClient` | Manager feature only |

No shared global state. Each feature owns its data completely.

## Testing Strategy

Tests are colocated with the source they protect. The approach is lightweight TDD: write the smallest meaningful failing test first, then implement the minimum to pass.

**API behavior tests** — verify mock HCM route handler contracts:
- Correct status codes and response shapes for all endpoints
- Conflict detection and insufficient-balance rejection
- Silent-wrong mode returning success while leaving balance inconsistent
- Anniversary bonus changing balances outside the normal request flow

**Unit tests** — cover pure helpers only:
- `detectChangedBalanceIds` in `compare-balances`
- Zod schema validation in `request-schema`

**Component tests** — cover visible UI states:
- Balance loading skeleton, error, empty, and fresh states
- Request form validation and submission feedback
- Recent requests table status rendering
- Manager request cards with approve/deny controls

**Integration tests** — cover full user flows:
- Employee submits, sees optimistic pending, HCM responds
- HCM rejection rolls back optimistic entry
- Silent-wrong shows reconciliation warning
- Manager approves, request disappears from queue
- Manager approval conflict shows error

What is not tested: CSS class names, internal React state, framework behavior, trivial renders without business risk.

## Storybook Strategy

Storybook proves UI states without a live HCM. Stories mock `window.fetch` in decorators to control responses.

**Coverage areas:**
- Balance states: Loading, Empty, Fresh, Refreshing, Stale, BalanceRefreshed, Error
- Request form states: Empty, ValidationError, Submitting, OptimisticPending, HcmRejected, HcmSilentlyWrong, OptimisticRolledBack
- Recent requests: Empty, Pending, Confirmed, Rejected, NeedsReconciliation, MixedStatuses
- Manager review: NoPendingRequests, PendingRequestWithValidBalance, Approving, Denied, Approved, ConflictAtDecisionTime, BalanceChangedBeforeApproval, Error

**Interaction tests** for 4 high-value flows:
1. Form validation shows "Location is required" on empty submit
2. Submission shows "Pending" status, never "Approved"
3. Manager approval conflict shows the conflict message
4. BalanceRefreshed story shows the "Stale" notice

## Alternatives Considered

**SWR or React Query** — rejected to keep the dependency surface minimal for this take-home. Both would add automatic deduplication, retry, and cache invalidation. The trade-off was accepted: polling is simpler for the scope of this project.

**WebSocket or SSE instead of polling** — rejected. Polling at 30-second intervals is sufficient for demonstrating the reconciliation concept. Production would use a push channel.

**Global balance context** — rejected. Balance data is only consumed in the time-off feature. A global context would add indirection without a real reuse benefit.

**Optimistic confirmed state** — explicitly rejected. Showing a request as approved before HCM confirms it would misrepresent balance consumption and undermine the trust model. Optimistic pending is honest because ExampleHR legitimately received the intent.

**Flat file structure** — rejected. Feature-local colocation (components, hooks, services, types, enums all inside the route) keeps related code together and makes the HCM-owned boundaries visible in the folder structure.

## Tradeoffs

| Decision | Benefit | Cost |
|----------|---------|------|
| No cache library | Fewer dependencies, simpler mental model | No automatic retry, deduplication, or stale-while-revalidate |
| Polling over push | Deterministic, easy to test | Not real-time; 30-second lag before mid-session changes appear |
| Mock HCM in-process | Fast tests, deterministic simulation | Not a real network boundary; reset on server restart |
| Optimistic pending only | Honest — no false "approved" confirmation | Employee sees "pending" longer before HCM re-confirms |
| Colocated feature state | Easy to trace data ownership | Data cannot be shared without lifting state or adding a context |
| `noValidate` on form | React-hook-form + Zod own all validation; `min` works as a UX hint | Native browser popups don't appear; all errors must be shown explicitly |

## Known Limitations

- Balance list does not auto-refresh the displayed values when reconciliation detects a change; it only shows a notice. A reload is required to see the new numbers.
- Manager approval does not perform a live per-card balance re-check; it relies on the balance loaded at page mount.
- The reconciliation interval (30 seconds) is fixed in the default and requires a prop to override; it is not environment-configurable.
- Employee ID is hardcoded as `employee-example-001`; there is no auth layer or session.
- Mock HCM state is in-memory and resets on every server restart. Multiple browser sessions share the same in-memory state.
- `RecentRequestsTable` on the time-off page uses static seed data from `data/requests.ts`, not the live pending list from `useRequestSubmission`.

## Future Improvements

- Replace polling with WebSocket or Server-Sent Events for real-time balance updates.
- Add SWR or TanStack Query for automatic retry, deduplication, and cache invalidation.
- Wire a real auth layer so employee ID and manager role come from a session.
- Allow managers to see a live balance re-check in the card before deciding, rather than relying on the value loaded at page mount.
- Persist mock HCM state across server restarts for realistic multi-session demos.
- Make the reconciliation interval configurable per environment via an environment variable.
- Replace the static seed data in `RecentRequestsTable` with the live pending list so the table reflects submitted requests.
