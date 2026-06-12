# 26 — Final TRD

**Phase:** Phase 5 — Final Documentation


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

Finalize the Technical Requirements Document based on the implemented system.

## Required File

```txt
docs/trd.md
```

## Required Sections

1. Problem Summary
2. Product Constraints
3. User Personas
4. Architecture Overview
5. API Design
6. UI State Model
7. Data Fetching Strategy
8. Optimistic vs Pessimistic Strategy
9. Cache Invalidation Strategy
10. Reconciliation Strategy
11. Background Refresh Strategy
12. Component Tree
13. State Ownership
14. Testing Strategy
15. Storybook Strategy
16. Alternatives Considered
17. Tradeoffs
18. Known Limitations
19. Future Improvements

## Required Reasoning

Explain:

- Why HCM is treated as the source of truth.
- Why employee submission uses optimistic pending.
- Why employee submission never shows approved immediately.
- Why manager approval requires authoritative re-check.
- How stale balances are communicated.
- How silent-wrong HCM responses are recovered.
- What each test type protects.
- What the implementation intentionally does not solve.

## Acceptance Criteria

- TRD reflects the actual implementation.
- TRD is written in English.
- TRD is honest about tradeoffs.
- TRD is not too long.
- TRD is clear enough for reviewers.
