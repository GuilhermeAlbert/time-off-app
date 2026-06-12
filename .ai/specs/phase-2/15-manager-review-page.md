# 15 — Manager Review Page

**Phase:** Phase 2 — Static UI, TDD


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

Create the static manager review page.

## Route

```txt
src/app/manager/requests/page.tsx
```

## Required Components

```txt
src/app/manager/requests/components/manager-request-card/index.tsx
src/app/manager/requests/components/manager-request-list/index.tsx
```

## Test First

Write component/page tests for:

1. Page renders manager review title.
2. Pending request is visible.
3. Employee name is visible.
4. Location is visible.
5. Requested days are visible.
6. Balance context is visible.
7. Approve button is visible.
8. Deny button is visible.
9. Empty state renders.

## Product Rule

The manager page must always show balance context at decision time.

## Acceptance Criteria

- Tests are written first.
- Manager page is static only.
- Approve and Deny buttons do not call API yet.
- Balance context is visible.
