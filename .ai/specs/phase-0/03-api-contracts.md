# 03 — API Contracts

**Phase:** Phase 0 — Planning and Architecture


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

Document the mock HCM API contract before implementing route handlers.

## Required File

```txt
docs/api-contracts.md
```

## Endpoints to Document

1. `GET /api/hcm/balances`
2. `GET /api/hcm/balances/[balanceId]`
3. `POST /api/hcm/requests`
4. `POST /api/hcm/requests/[requestId]/decision`
5. `POST /api/hcm/simulations/anniversary-bonus`

## For Each Endpoint

Document:

- Purpose
- Request params
- Request body, when applicable
- Success response
- Error response
- Simulation behavior
- Test cases that should cover it

## Response Shape Rule

Prefer a consistent response shape:

```ts
{
  data: unknown
}
```

For errors:

```ts
{
  error: {
    code: HcmErrorCode
    message: string
  }
}
```

## Simulation Modes

Document these modes:

- normal
- conflict
- silent-wrong
- slow
- insufficient-balance

## TDD Expectations

This is a documentation task.

No code tests are required.

## Acceptance Criteria

- `docs/api-contracts.md` exists.
- Every endpoint has clear request and response examples.
- Error cases are documented.
- Simulation modes are documented.
- Contracts are simple enough to implement without guessing.
