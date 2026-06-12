# 05 — Domain Model

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

Create the mock HCM domain model: enums, types, mock data and pure helpers.

## Files to Create

```txt
src/app/api/hcm/enums/request-status.ts
src/app/api/hcm/enums/sync-status.ts
src/app/api/hcm/enums/hcm-error-code.ts
src/app/api/hcm/enums/hcm-simulation-mode.ts
src/app/api/hcm/enums/manager-decision.ts

src/app/api/hcm/types/employee.ts
src/app/api/hcm/types/location.ts
src/app/api/hcm/types/time-off-balance.ts
src/app/api/hcm/types/time-off-request.ts
src/app/api/hcm/types/hcm-error-response.ts
src/app/api/hcm/types/hcm-success-response.ts

src/app/api/hcm/data/employees.ts
src/app/api/hcm/data/locations.ts
src/app/api/hcm/data/balances.ts
src/app/api/hcm/data/requests.ts

src/app/api/hcm/helpers/reset-hcm-data.ts
```

## Test First

Write the smallest meaningful tests for:

1. Initial mock balances include New York, London and Remote.
2. Initial request list is empty or contains only intentionally seeded examples.
3. Reset helper restores balances to the initial state.
4. Enums expose stable values used by API contracts.

## Implementation Details

Initial locations:

- New York
- London
- Remote

Initial balances:

- New York: 18 available days, 0 pending days
- London: 12 available days, 0 pending days
- Remote: 22 available days, 0 pending days

Use one mock employee.

Suggested employee:

```txt
employee-example-001
```

## Notes

Mock data may be in-memory.

Keep it deterministic.

Do not add database, ORM or persistence.

## Acceptance Criteria

- Domain model compiles.
- Tests exist and pass.
- Mock data is resettable between tests.
- Enums are used instead of string unions.
- No route handlers are implemented in this task.
