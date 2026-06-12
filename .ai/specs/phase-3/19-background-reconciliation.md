# 19 — Background Reconciliation

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

Add background reconciliation for balances that change outside ExampleHR.

## Test First

Write tests for:

1. Reconciliation fetches latest batch balances.
2. Changed balance is detected.
3. UI shows non-blocking balance refreshed notice.
4. Stale balances are marked.
5. Active submission is not disrupted.
6. Reconciliation resumes after submission completes.

## Implementation Tasks

1. Add balance comparison helper.
2. Add reconciliation interval or trigger.
3. Add stale/changed state.
4. Add user-facing notice.
5. Defer disruptive changes during active submission.

## Keep It Simple

Do not add a complex event system.

A simple hook plus helper functions is enough.

## Acceptance Criteria

- Tests are written first.
- Reconciliation detects external changes.
- UI communicates changes clearly.
- Active user actions are respected.
