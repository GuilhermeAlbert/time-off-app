# 02 — State Model

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

Document the state model for balances and time-off requests before implementation.

## Required File

```txt
docs/state-model.md
```

## Required Sections

1. Balance States
2. Request States
3. Employee Submission Lifecycle
4. Manager Decision Lifecycle
5. Reconciliation Lifecycle
6. Silent-Wrong Recovery
7. Conflict Recovery

## Balance States

Document at least:

- fresh
- refreshing
- stale
- changed-mid-session
- reconciliation-needed
- error

Prefer enums in implementation.

## Request States

Document at least:

- draft
- submitting
- optimistic-pending
- pending
- confirmed
- rejected
- needs-reconciliation
- rolled-back
- conflict

## Employee Submission Lifecycle

Describe this flow:

1. User sees balance.
2. User submits request.
3. UI creates optimistic pending feedback.
4. HCM receives request.
5. Single authoritative balance is re-read.
6. UI confirms pending, rolls back, or marks reconciliation needed.

## Manager Decision Lifecycle

Describe this flow:

1. Manager opens pending request.
2. UI shows balance context.
3. Manager clicks approve.
4. System re-reads authoritative balance.
5. Approval succeeds only if balance is still valid.
6. Otherwise UI shows conflict.

## TDD Expectations

This is a documentation task.

No code tests are required.

## Acceptance Criteria

- `docs/state-model.md` exists.
- States are explicit.
- Lifecycles are easy for a coding agent to implement.
- State names align with expected enums.
- Document stays simple and avoids unnecessary state-machine libraries.
