# 10 — Anniversary Bonus Endpoint

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

Implement an endpoint that simulates HCM changing a balance outside ExampleHR.

## Endpoint

```txt
POST /api/hcm/simulations/anniversary-bonus
```

## Request Body

```ts
{
  balanceId?: string
  bonusDays?: number
}
```

## Test First

Write tests for:

1. Adds bonus days to selected balance.
2. Uses a default balance when no balance ID is provided.
3. Updates `lastSyncedAt`.
4. Does not create a time-off request.
5. Returns 404 for unknown balance if a balance ID is provided.

## Why This Exists

This endpoint demonstrates that HCM can mutate balances independently while the user has ExampleHR open.

It enables reconciliation tests and Storybook scenarios.

## Acceptance Criteria

- Tests are written first.
- Endpoint mutates balance deterministically.
- Endpoint supports custom bonus days.
- Endpoint does not affect requests.
