# 08 — Request Submission Endpoint

**Phase:** Phase 1 — Mock HCM API, TDD


## Project Context

ExampleHR is building a Time-Off module.

The Human Capital Management system, HCM, is the source of truth for balances. ExampleHR must present a fast, trustworthy frontend while being honest that balances are owned by an external system.

The UI must support:

- Employee balance visibility by location
- Employee time-off request submission
- Manager approval and denial
- Optimistic pending states
- Authoritative balance re-checks
- Background reconciliation
- Stale data handling
- HCM conflict responses
- HCM silent-wrong success responses
- Work-anniversary balance changes outside ExampleHR

## Required Standards

Before implementing this task, the agent must read:

```txt
AGENTS.md
docs/project-standards.md
```

For Next.js-specific behavior, the agent must read the local docs:

```txt
node_modules/next/dist/docs/
```

Do not rely only on training-data assumptions about Next.js.

## Architecture Rules

- Use Next.js App Router.
- Keep code colocated inside the route/feature whenever possible.
- Do not create broad global abstractions unless reused by multiple features.
- Use kebab-case for files and folders.
- Every `.tsx` component inside `app` must use:

```txt
component-name/
└── index.tsx
```

- Shared reusable components live directly in:

```txt
src/components/
```

- Do not create `components/ui`, `components/common`, or `components/shared`.
- Prefer enums over string unions.
- Keep services free of JSX and UI state.
- Keep helpers pure whenever possible.
- Keep the project simple, but well structured.

## TDD Rule

Use lightweight TDD for this task:

1. Write the smallest meaningful failing test first.
2. Implement the minimum code needed to pass.
3. Refactor only when the code becomes clearer.
4. Do not add abstractions for future tasks.
5. Run the relevant test.
6. Report changed files and stop.

## Stop Rule

Implement only this spec.

Do not start the next task.


---

## Objective

Implement time-off request submission against mock HCM.

## Endpoint

```txt
POST /api/hcm/requests
```

## Route File

```txt
src/app/api/hcm/requests/route.ts
```

## Request Body

```ts
{
  employeeId: string
  locationId: string
  startDate: string
  endDate: string
  daysRequested: number
  notes?: string
  simulationMode?: HcmSimulationMode
}
```

## Test First

Write tests for:

1. Valid request creates a pending request.
2. Invalid employee is rejected.
3. Invalid location is rejected.
4. Insufficient balance is rejected.
5. Conflict simulation returns conflict.
6. Silent-wrong simulation returns success but creates inconsistent state.
7. Slow simulation is deterministic and does not make tests flaky.

## Key Product Rule

The endpoint should not return an approved request from employee submission.

The correct optimistic UI state is pending, not approved.

## Simulation Behavior

### Normal

Create request with `RequestStatus.Pending`.

### Conflict

Return error with `HcmErrorCode.Conflict`.

### SilentWrong

Return success, but create a mismatch that later reconciliation can detect.

Example options:

- request returned as pending but internal state marks needs reconciliation
- balance not updated as expected
- response includes a reconciliation hint

Keep the behavior simple and documented.

### InsufficientBalance

Return error with `HcmErrorCode.InsufficientBalance`.

## Acceptance Criteria

- Tests are written first.
- All required scenarios pass.
- Endpoint remains deterministic.
- No frontend code is changed.
