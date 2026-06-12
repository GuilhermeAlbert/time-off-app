# 09 — Manager Decision Endpoint

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

Implement manager approve/deny behavior.

## Endpoint

```txt
POST /api/hcm/requests/[requestId]/decision
```

## Request Body

```ts
{
  decision: ManagerDecision
}
```

## Test First

Write tests for:

1. Denial marks request as rejected.
2. Denial does not mutate balance.
3. Approval re-checks authoritative balance.
4. Approval deducts balance if valid.
5. Approval fails if balance is insufficient at decision time.
6. Approval fails if request is already decided.
7. Unknown request returns not found.

## Product Rule

Manager approval must not trust stale UI data.

It must re-read the authoritative balance before approval.

## Success Response

```ts
{
  data: {
    request: TimeOffRequest
    balance: TimeOffBalance
    decidedAt: string
  }
}
```

## Acceptance Criteria

- Tests prove approval re-checks balance.
- Denial does not change balance.
- Conflicts are explicit.
- No frontend code is changed.
