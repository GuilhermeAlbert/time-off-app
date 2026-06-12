# 16 — Frontend Services

**Phase:** Phase 3 — Integration, TDD


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

Create frontend service functions that call the mock HCM API.

## Required Files

```txt
src/app/time-off/services/time-off-service.ts
src/app/manager/requests/services/manager-request-service.ts
```

## Test First

Write service tests for:

1. `getBalances` calls `/api/hcm/balances`.
2. `getBalance` calls `/api/hcm/balances/[balanceId]`.
3. `submitTimeOffRequest` posts to `/api/hcm/requests`.
4. `triggerAnniversaryBonus` posts to simulation endpoint.
5. `approveRequest` posts approval decision.
6. `denyRequest` posts denial decision.
7. Non-2xx responses are handled consistently.

## Service Functions

Time-off:

```ts
getBalances()
getBalance(balanceId)
submitTimeOffRequest(input)
triggerAnniversaryBonus(input?)
```

Manager:

```ts
getPendingRequests()
approveRequest(requestId)
denyRequest(requestId)
```

## Rules

- No JSX.
- No React state.
- No UI side effects.
- Keep fetch error handling simple.
- Use typed responses.

## Acceptance Criteria

- Tests are written first.
- Services compile.
- Error handling is consistent.
- No UI behavior is changed yet.
