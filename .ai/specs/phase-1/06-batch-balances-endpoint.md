# 06 — Batch Balances Endpoint

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

Implement the expensive full-corpus balance hydration endpoint.

## Endpoint

```txt
GET /api/hcm/balances
```

## Route File

```txt
src/app/api/hcm/balances/route.ts
```

## Test First

Write API behavior tests that verify:

1. Endpoint returns 200.
2. Response includes all balances.
3. Response includes New York, London and Remote.
4. Response includes `lastSyncedAt`.
5. Response includes `source: "hcm"`.

## Expected Response

```ts
{
  data: {
    balances: TimeOffBalance[]
    lastSyncedAt: string
    source: 'hcm'
  }
}
```

## Implementation Notes

- Use Next.js Route Handler conventions from local docs.
- Add small artificial latency only if it does not make tests flaky.
- If latency is implemented, make it easy to bypass in tests.
- Do not add frontend code.

## Acceptance Criteria

- Tests are written before implementation.
- Endpoint passes tests.
- Response shape matches `docs/api-contracts.md`.
- No UI code is changed.
