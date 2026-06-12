# 07 — Single Balance Endpoint

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

Implement the authoritative per-cell balance read endpoint.

## Endpoint

```txt
GET /api/hcm/balances/[balanceId]
```

## Route File

Use the folder and param naming required by the installed Next.js version.

Suggested:

```txt
src/app/api/hcm/balances/[balance-id]/route.ts
```

## Test First

Write API behavior tests that verify:

1. Existing balance returns 200.
2. Response contains only one balance.
3. Unknown balance returns 404.
4. Error response uses `HcmErrorCode.NotFound`.
5. Response includes `lastSyncedAt`.

## Expected Success Response

```ts
{
  data: {
    balance: TimeOffBalance
    lastSyncedAt: string
    source: 'hcm'
  }
}
```

## Expected Error Response

```ts
{
  error: {
    code: HcmErrorCode.NotFound
    message: string
  }
}
```

## Acceptance Criteria

- Test fails before implementation.
- Test passes after implementation.
- Unknown balance returns 404.
- No frontend code is changed.
