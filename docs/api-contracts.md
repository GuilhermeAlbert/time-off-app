# ExampleHR Mock HCM API Contracts

These contracts describe the mock HCM route handlers that later specs will implement with the Next.js App Router. HCM remains the source of truth for balances, so successful ExampleHR responses must still represent HCM-backed data or a clearly documented simulation state.

## Shared Response Shape

Success responses use:

```ts
{
  data: unknown
}
```

Error responses use:

```ts
{
  error: {
    code: HcmErrorCode
    message: string
  }
}
```

Expected `HcmErrorCode` enum values:

- `validation-error`
- `not-found`
- `conflict`
- `insufficient-balance`
- `hcm-unavailable`
- `reconciliation-needed`

## Simulation Modes

Simulation mode may be selected with a `mode` query param on `GET` endpoints or a `simulationMode` field in `POST` bodies.

| Mode | Behavior |
| --- | --- |
| `normal` | Return the expected HCM-backed success response. |
| `conflict` | Return a conflict error for stale request or balance state. |
| `silent-wrong` | Return success while intentionally leaving follow-up balance data inconsistent so reconciliation can detect it. |
| `slow` | Delay the response before returning the normal result. |
| `insufficient-balance` | Return an insufficient balance error for request submission or approval. |

## GET /api/hcm/balances

### Purpose

Returns all known HCM balances for an employee, optionally filtered by location. This endpoint powers initial employee balance visibility and background reconciliation.

### Request Params

```txt
employeeId=employee-1
locationId=nyc
mode=normal
```

- `employeeId` is required.
- `locationId` is optional.
- `mode` is optional and defaults to `normal`.

### Request Body

None.

### Success Response

```json
{
  "data": {
    "balances": [
      {
        "id": "balance-nyc-employee-1",
        "employeeId": "employee-1",
        "locationId": "nyc",
        "availableDays": 12,
        "pendingDays": 2,
        "version": 4,
        "lastSyncedAt": "2026-06-12T12:00:00.000Z"
      }
    ]
  }
}
```

### Error Response

```json
{
  "error": {
    "code": "validation-error",
    "message": "employeeId is required"
  }
}
```

### Simulation Behavior

- `normal`: returns matching balances for the employee.
- `slow`: delays before returning the normal response.
- `conflict`: returns `409 conflict` if the requested employee is marked stale.
- `silent-wrong`: returns a balance that does not include the latest simulated adjustment.
- `insufficient-balance`: returns balances with low `availableDays` for downstream tests.

### Test Cases

- Returns balances for a valid `employeeId`.
- Filters balances by `locationId`.
- Returns validation error when `employeeId` is missing.
- Supports slow balance reads.
- Supports stale or mismatched balance data for reconciliation tests.

## GET /api/hcm/balances/[balanceId]

### Purpose

Returns one authoritative HCM balance by id. This endpoint is used when a single balance must be re-read after submission or before manager approval.

### Request Params

Path param:

```txt
balanceId=balance-nyc-employee-1
```

Query params:

```txt
mode=normal
```

- `balanceId` is required in the path.
- `mode` is optional and defaults to `normal`.

### Request Body

None.

### Success Response

```json
{
  "data": {
    "balance": {
      "id": "balance-nyc-employee-1",
      "employeeId": "employee-1",
      "locationId": "nyc",
      "availableDays": 12,
      "pendingDays": 2,
      "version": 4,
      "lastSyncedAt": "2026-06-12T12:00:00.000Z"
    }
  }
}
```

### Error Response

```json
{
  "error": {
    "code": "not-found",
    "message": "Balance was not found"
  }
}
```

### Simulation Behavior

- `normal`: returns the requested balance.
- `slow`: delays before returning the requested balance.
- `conflict`: returns `409 conflict` when the balance version is stale.
- `silent-wrong`: returns a balance version that does not reflect the last successful mutation.
- `insufficient-balance`: returns the balance with `availableDays` below the requested amount.

### Test Cases

- Returns a single balance for a valid `balanceId`.
- Returns `not-found` for an unknown balance id.
- Exposes version changes for reconciliation checks.
- Supports slow and silent-wrong single-balance reads.
- Provides insufficient-balance setup for approval tests.

## POST /api/hcm/requests

### Purpose

Submits an employee time-off request to HCM. ExampleHR may show optimistic pending feedback, but HCM confirmation is required before the request is treated as accepted pending manager review.

### Request Params

None.

### Request Body

```json
{
  "employeeId": "employee-1",
  "balanceId": "balance-nyc-employee-1",
  "locationId": "nyc",
  "startDate": "2026-07-01",
  "endDate": "2026-07-03",
  "requestedDays": 3,
  "reason": "Family trip",
  "clientRequestId": "client-request-123",
  "simulationMode": "normal"
}
```

- `employeeId`, `balanceId`, `locationId`, `startDate`, `endDate`, and `requestedDays` are required.
- `reason`, `clientRequestId`, and `simulationMode` are optional.

### Success Response

```json
{
  "data": {
    "request": {
      "id": "request-1",
      "employeeId": "employee-1",
      "balanceId": "balance-nyc-employee-1",
      "locationId": "nyc",
      "status": "pending",
      "requestedDays": 3,
      "startDate": "2026-07-01",
      "endDate": "2026-07-03",
      "version": 1,
      "createdAt": "2026-06-12T12:05:00.000Z"
    },
    "balance": {
      "id": "balance-nyc-employee-1",
      "availableDays": 9,
      "pendingDays": 5,
      "version": 5,
      "lastSyncedAt": "2026-06-12T12:05:00.000Z"
    }
  }
}
```

### Error Response

```json
{
  "error": {
    "code": "insufficient-balance",
    "message": "Requested days exceed available balance"
  }
}
```

### Simulation Behavior

- `normal`: creates a pending request and updates pending balance.
- `slow`: delays before creating the request.
- `conflict`: returns `409 conflict` when the balance version changed before submission.
- `silent-wrong`: returns success but leaves the returned balance inconsistent with the request.
- `insufficient-balance`: returns `409 insufficient-balance` without creating the request.

### Test Cases

- Creates a pending request for valid input.
- Returns validation errors for missing required fields.
- Rejects requests with insufficient balance.
- Preserves idempotency when `clientRequestId` is reused.
- Supports silent-wrong success for reconciliation tests.

## POST /api/hcm/requests/[requestId]/decision

### Purpose

Lets a manager approve or deny a pending request. Approval must re-read the authoritative HCM balance at decision time and only succeed if the balance remains valid.

### Request Params

Path param:

```txt
requestId=request-1
```

- `requestId` is required in the path.

### Request Body

```json
{
  "managerId": "manager-1",
  "decision": "approve",
  "expectedRequestVersion": 1,
  "expectedBalanceVersion": 5,
  "note": "Approved",
  "simulationMode": "normal"
}
```

- `managerId`, `decision`, `expectedRequestVersion`, and `expectedBalanceVersion` are required.
- `decision` must be `approve` or `deny`.
- `note` and `simulationMode` are optional.

### Success Response

```json
{
  "data": {
    "request": {
      "id": "request-1",
      "status": "confirmed",
      "decision": "approve",
      "requestedDays": 3,
      "version": 2,
      "decidedAt": "2026-06-12T12:10:00.000Z"
    },
    "balance": {
      "id": "balance-nyc-employee-1",
      "availableDays": 9,
      "pendingDays": 2,
      "version": 6,
      "lastSyncedAt": "2026-06-12T12:10:00.000Z"
    }
  }
}
```

For denial:

```json
{
  "data": {
    "request": {
      "id": "request-1",
      "status": "rejected",
      "decision": "deny",
      "requestedDays": 3,
      "version": 2,
      "decidedAt": "2026-06-12T12:10:00.000Z"
    },
    "balance": {
      "id": "balance-nyc-employee-1",
      "availableDays": 12,
      "pendingDays": 0,
      "version": 6,
      "lastSyncedAt": "2026-06-12T12:10:00.000Z"
    }
  }
}
```

### Error Response

```json
{
  "error": {
    "code": "conflict",
    "message": "Request or balance changed before the manager decision"
  }
}
```

### Simulation Behavior

- `normal`: approves or denies the request and returns the updated request and balance.
- `slow`: delays before applying the decision.
- `conflict`: returns `409 conflict` when expected versions do not match HCM.
- `silent-wrong`: returns success but leaves request or balance versions inconsistent for reconciliation.
- `insufficient-balance`: returns `409 insufficient-balance` for approval if available balance is no longer enough.

### Test Cases

- Approves a pending request with valid versions and sufficient balance.
- Denies a pending request and releases pending days.
- Rejects approval when the balance is insufficient.
- Returns conflict for stale request or balance versions.
- Supports silent-wrong decision responses for reconciliation tests.

## POST /api/hcm/simulations/anniversary-bonus

### Purpose

Simulates an HCM-owned balance change that happens outside ExampleHR, such as a work-anniversary bonus. This endpoint supports reconciliation and changed-mid-session UI states.

### Request Params

None.

### Request Body

```json
{
  "employeeId": "employee-1",
  "balanceId": "balance-nyc-employee-1",
  "bonusDays": 5,
  "effectiveDate": "2026-06-12",
  "simulationMode": "normal"
}
```

- `employeeId`, `balanceId`, and `bonusDays` are required.
- `effectiveDate` and `simulationMode` are optional.

### Success Response

```json
{
  "data": {
    "balance": {
      "id": "balance-nyc-employee-1",
      "employeeId": "employee-1",
      "locationId": "nyc",
      "availableDays": 17,
      "pendingDays": 2,
      "version": 7,
      "lastSyncedAt": "2026-06-12T12:15:00.000Z"
    },
    "event": {
      "id": "anniversary-bonus-1",
      "type": "anniversary-bonus",
      "bonusDays": 5,
      "effectiveDate": "2026-06-12"
    }
  }
}
```

### Error Response

```json
{
  "error": {
    "code": "not-found",
    "message": "Balance was not found"
  }
}
```

### Simulation Behavior

- `normal`: adds `bonusDays` to the HCM balance and increments the balance version.
- `slow`: delays before applying the bonus.
- `conflict`: returns `409 conflict` when the target balance is locked by another simulation.
- `silent-wrong`: returns success but does not apply the bonus, so the next reconciliation can detect mismatch.
- `insufficient-balance`: not meaningful for this endpoint; return validation error if requested.

### Test Cases

- Applies a bonus to a valid balance.
- Increments the balance version after the bonus.
- Returns validation errors for missing `employeeId`, `balanceId`, or `bonusDays`.
- Returns `not-found` for unknown balance id.
- Supports silent-wrong bonus simulation for reconciliation tests.
