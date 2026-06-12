# 11 — Time-Off Page Layout

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

Create the static employee Time-Off page shell.

## Route

```txt
src/app/time-off/page.tsx
```

## Test First

Write a render/component test that verifies:

1. Page renders `ExampleHR`.
2. Page renders `Time Off`.
3. Page renders `Request time off and track balance changes.`
4. Page does not render avatar, notifications or user profile actions.

## UI Requirements

- Minimal header with only ExampleHR.
- Main content width around 1200px.
- Premium, quiet SaaS style.
- White background.
- Minimal borders.
- Large rounded corners.
- No auth UI.

## Layout Sections

Reserve areas for:

1. Balance cards
2. Request form
3. Recent requests table

## Acceptance Criteria

- Test exists and passes.
- Page renders cleanly.
- No API calls are added.
- No manager UI is added to this page.
