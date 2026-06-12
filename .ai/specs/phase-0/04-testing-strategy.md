# 04 — Testing Strategy

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

Document the lightweight TDD strategy for the project.

## Required File

```txt
docs/testing-strategy.md
```

## Testing Philosophy

The goal is not to maximize test count.

The goal is to protect the behavior that makes the take-home interesting:

- HCM is the source of truth
- optimistic pending feedback
- rollback after HCM rejection
- silent-wrong recovery
- stale balance reconciliation
- manager approval re-check

## Required Sections

1. Test Pyramid for This Project
2. API Behavior Tests
3. Unit Tests
4. Component Tests
5. Integration Tests
6. Storybook Interaction Tests
7. What Not to Test
8. Deterministic Simulation Strategy

## Recommended Test Mix

Use this as guidance:

- API behavior tests for mock HCM endpoints
- Unit tests for pure helpers only
- Component tests for visible UI behavior
- Integration tests for employee and manager flows
- Storybook stories for visual state coverage
- Storybook interactions only for high-value states

## What Not to Test

Avoid:

- CSS implementation details
- exact class names
- internal React state
- implementation details of hooks
- duplicated coverage for trivial rendering

## Acceptance Criteria

- `docs/testing-strategy.md` exists.
- TDD approach is clear.
- The document prevents overengineering.
- The document explains which tests protect which risks.
