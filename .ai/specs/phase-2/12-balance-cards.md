# 12 — Balance Cards

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

Create static balance cards using local feature data.

## Required Components

```txt
src/app/time-off/components/balance-card/index.tsx
src/app/time-off/components/balance-list/index.tsx
src/app/time-off/components/sync-status-badge/index.tsx
```

## Required Feature Files

```txt
src/app/time-off/types/time-off-balance.ts
src/app/time-off/enums/sync-status.ts
src/app/time-off/data/balances.ts
```

## Test First

Write component tests for:

1. Balance card renders location.
2. Balance card renders available days.
3. Balance card renders pending days.
4. Sync badge renders Fresh.
5. Sync badge renders Refreshing.
6. Sync badge renders Stale.
7. Balance list renders New York, London and Remote.

## UI Content

Cards:

- New York, 18 days
- London, 12 days
- Remote, 22 days

Each card includes:

- available days
- pending days
- sync status

## Acceptance Criteria

- Tests are written first.
- Components use `component-name/index.tsx`.
- Data is local only.
- No API calls are added.
