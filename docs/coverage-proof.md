# ExampleHR Coverage Proof

## Commands

```bash
# Lint
npm run lint

# Type check (run from app/)
node_modules/.bin/tsc --noEmit

# Tests (run from app/)
npx vitest run

# Storybook (development)
npm run storybook

# Storybook (build)
npm run build-storybook
```

There is no `npm run test` or `npm run typecheck` script. Tests run via `npx vitest run` from the `app/` directory. Running from the repo root works for most tests but loses the local `jsdom` package needed by jsdom-environment tests.

## API Behavior Tests

These tests call mock HCM route handlers directly and protect the HCM contract.

**`GET /api/hcm/balances`** — `src/app/api/hcm/balances/route.test.ts`
- Returns all balances with sync metadata (availableDays, pendingDays, syncStatus, lastSyncedAt)

**`GET /api/hcm/balances/[balance-id]`** — `src/app/api/hcm/balances/[balance-id]/route.test.ts`
- Returns 200 with a single balance for a known ID
- Returns correct fields and lastSyncedAt / source
- Returns 404 for an unknown balance ID

**`POST /api/hcm/requests`** — `src/app/api/hcm/requests/route.test.ts`
- Creates a pending request for valid input
- Rejects an invalid employee (400)
- Rejects an invalid location (400)
- Rejects insufficient balance (409)
- Returns conflict for conflict simulation mode (409)
- Returns silent-wrong success with inconsistent state (201 but balance not reserved)
- Handles slow simulation deterministically

**`GET /api/hcm/requests`** — `src/app/api/hcm/requests/route.test.ts`
- Returns an empty list when no pending requests exist
- Returns only pending requests, not confirmed or rejected ones

**`POST /api/hcm/requests/[request-id]/decision`** — `src/app/api/hcm/requests/[request-id]/decision/route.test.ts`
- Marks a denied request as rejected without mutating the balance
- Approves by deducting from the current authoritative balance
- Rejects approval when balance is insufficient at decision time (409)
- Returns conflict when the request is already decided (409)
- Returns not found for an unknown request (404)

**`POST /api/hcm/simulations/anniversary-bonus`** — `src/app/api/hcm/simulations/anniversary-bonus/route.test.ts`
- Adds bonus days to the specified balance
- Uses the first balance as default when no balanceId is provided
- Updates lastSyncedAt on the balance
- Does not create a time-off request
- Returns 404 for an unknown balance ID

**Domain model** — `src/app/api/hcm/domain-model.test.ts`
- Starts with New York, London, and Remote balances
- Starts with no seeded requests
- Resets mutable balances and requests to initial state between tests
- Exposes stable enum values used by the API contracts

## Unit Tests

These tests cover pure helper functions with no side effects.

**`detectChangedBalanceIds`** — `src/app/time-off/helpers/compare-balances.test.ts`
- Returns an empty array when nothing changed
- Detects changed available days
- Detects changed pending days
- Ignores balances not present in the current displayed set

## Component Tests

These tests render components in isolation and assert visible UI behavior.

**`SyncStatusBadge`** — `src/app/time-off/components/sync-status-badge/index.test.tsx`
- Renders "Fresh", "Refreshing", "Stale" labels for each sync status

**`BalanceCard`** — `src/app/time-off/components/balance-card/index.test.tsx`
- Renders location, available days, pending days
- Does not call fetch directly (data passed as props)

**`RecentRequestsTable`** — `src/app/time-off/components/recent-requests-table/index.test.tsx`
- Renders empty state when no requests
- Renders table column headers
- Renders a pending request
- Renders a confirmed request
- Renders a rejected request
- Renders a needs-reconciliation request

**`RequestForm`** — `src/app/time-off/components/request-form/index.test.tsx`
- Renders all fields (location, start date, end date, days requested, notes)
- Renders a "Submit Request" button
- Shows required validation errors when submitted empty
- Shows "must be greater than zero" error when days requested is zero
- Calls onSubmit with correct values for valid input

**`ManagerRequestCard`** — `src/app/manager/requests/components/manager-request-card/index.test.tsx`
- Renders employee name, location, requested days, balance context
- Renders approve and deny buttons

**`ManagerRequestList`** — `src/app/manager/requests/components/manager-request-list/index.test.tsx`
- Renders empty state when no requests
- Renders employee name and location when requests are present

**`ManagerRequestsPage`** — `src/app/manager/requests/page.test.tsx`
- Renders manager review title and workspace label
- Renders loading state while requests are fetched

**Services** — `src/app/time-off/services/time-off-service.test.ts`, `src/app/manager/requests/services/manager-request-service.test.ts`
- Each service function calls the correct endpoint
- Each service throws on non-2xx responses

## Integration Tests

These tests exercise hooks that wire services to React state across async boundaries.

**`useBalances`** — `src/app/time-off/hooks/use-balances.test.ts`
- Maps known sync status "fresh" correctly to the feature enum
- Maps unknown HCM sync status to Stale (defensive fallback)
- Maps "reconciliation-needed" to Stale

**`useRequestSubmission`** — `src/app/time-off/hooks/use-request-submission.test.ts`
- Valid submission creates an optimistic pending request immediately
- Affected balance location becomes refreshing during submission
- Successful HCM response keeps the request as pending — never approved
- HCM rejection rolls back the optimistic request
- Insufficient balance shows a clear error message
- Silent-wrong HCM response shows a reconciliation warning
- UI never shows "approved" immediately after employee submission

**`useReconciliation`** — `src/app/time-off/hooks/use-reconciliation.test.ts`
- Fetches latest balances from HCM on interval
- Detects a changed balance and marks it stale
- Shows a non-blocking "balance refreshed" notice when a change is detected
- Does not mark stale when the balance is unchanged
- Does not disrupt an active submission — defers the stale state
- Applies deferred changes after submission completes

**`useManagerRequests`** — `src/app/manager/requests/hooks/use-manager-requests.test.ts`
- Loads pending requests from API on mount
- Enriches requests with balance context
- Deny removes the request from the list
- Deny does not change balance context of remaining requests
- Approve calls POST on the decision endpoint
- Approve removes the request from the list on success
- Approve sets decisionError on balance conflict
- Sets error state when the initial load fails

## Storybook Stories

Stories cover all key UI states and run without a live HCM server. Fetch is mocked in decorators.

**BalanceCard** — `src/app/time-off/components/balance-card/index.stories.tsx`
- Fresh, Refreshing, Stale, BalanceRefreshed

**BalanceList** — `src/app/time-off/components/balance-list/index.stories.tsx`
- Loading, Empty, Fresh, Refreshing, Stale, BalanceRefreshed, Error

**RequestForm** — `src/app/time-off/components/request-form/index.stories.tsx`
- Empty, ValidationError, Submitting, OptimisticPending, HcmRejected, HcmSilentlyWrong, OptimisticRolledBack

**RecentRequestsTable** — `src/app/time-off/components/recent-requests-table/index.stories.tsx`
- Empty, Pending, Confirmed, Rejected, NeedsReconciliation, MixedStatuses

**ManagerReview** — `src/app/manager/requests/components/manager-requests-client/index.stories.tsx`
- NoPendingRequests, PendingRequestWithValidBalance, Approving, Denied, Approved, ConflictAtDecisionTime, BalanceChangedBeforeApproval, Error

## Storybook Interaction Tests

Interaction tests use `play` functions with explicit `expect` assertions for four high-value behaviors.

1. **Form validation** (`RequestForm/ValidationError`) — clicking submit on an empty form shows "Location is required"
2. **Submission shows pending, not approved** (`RequestForm/OptimisticPending`) — after a successful submission, the request shows "Pending" status; "Approved" is never shown
3. **Manager approval conflict** (`ManagerReview/ConflictAtDecisionTime`) — clicking Approve when HCM returns a 409 shows "Insufficient balance"
4. **Balance refreshed notice** (`BalanceList/BalanceRefreshed`) — the mid-session balance change story shows "Stale" status

## Known Gaps

- **No end-to-end tests.** There is no Playwright or Cypress suite. The full browser flow (employee submits → manager approves → balance updates) is not tested across a real HTTP boundary.
- **`useBalances` loading and error states are not tested.** Only the SyncStatus mapping is covered. The loading and error branches are exercised only via Storybook stories.
- **`time-off/page.tsx` has no component test.** The page layout and section headings are untested in the Vitest suite.
- **`RecentRequestsTable` is populated from static seed data** in the time-off page. There is no test verifying that live-submitted requests appear in the table.
- **Storybook interaction tests run in a browser only.** The `play` functions are verified to exist in Vitest but their assertions are only executed when Storybook runs in a browser. Vitest cannot run Storybook interaction flows end-to-end.
- **No test for the full silent-wrong → reconciliation cycle.** Silent-wrong is tested at the HCM route level and the hook level separately, but not as a combined flow.
- **Manager decision re-check relies on initial load data.** The conflict scenario is tested at the HCM level and the hook level, but not as a combined page-level flow where the balance changes between page load and decision.
