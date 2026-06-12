# 18 — Request Submission Flow

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

Connect request form to the API and implement optimistic pending behavior.

## Test First

Write integration/component tests for:

1. Valid submission creates optimistic pending request.
2. Affected balance becomes refreshing.
3. Successful HCM response keeps request pending.
4. HCM rejection rolls back optimistic request.
5. Insufficient balance shows clear error.
6. Silent-wrong response shows reconciliation message.
7. UI never shows approved immediately after employee submission.

## Required Flow

1. User submits request.
2. UI shows pending immediately.
3. API request is sent.
4. UI marks affected balance as refreshing.
5. UI re-reads authoritative single balance.
6. UI confirms pending or rolls back.
7. UI shows reconciliation warning if HCM state contradicts response.

## Product Rule

Employee request submission can be optimistic only as pending.

Never show approved until final authoritative workflow confirms it.

## Acceptance Criteria

- Tests are written first.
- Optimistic pending is implemented.
- Rollback is implemented.
- Silent-wrong recovery is visible.
- UI remains honest.
