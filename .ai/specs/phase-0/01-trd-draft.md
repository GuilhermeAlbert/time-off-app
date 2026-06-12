# 01 — TRD Draft

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

Create the first version of the Technical Requirements Document before implementation.

This is not the final TRD. It is a lightweight planning document that guides the build.

## Required File

```txt
docs/trd.md
```

## Why This Comes First

The take-home explicitly values reasoning, not just code.

The initial TRD should define the technical direction before the agent starts implementing endpoints and UI.

## Required Sections

Create these sections with concise but clear explanations:

1. Problem Summary
2. Source of Truth
3. Product Goals
4. User Personas
5. Constraints
6. Initial Architecture
7. Mock HCM Strategy
8. UI State Strategy
9. Optimistic Update Strategy
10. Reconciliation Strategy
11. Testing Strategy
12. Storybook Strategy
13. Initial Tradeoffs

## Key Decisions to Document

### Source of Truth

Document that HCM owns balances.

ExampleHR can cache, display and reconcile balances, but it cannot claim final truth without authoritative HCM confirmation.

### Optimistic Feedback

The UI may optimistically show a request as pending.

The UI must not show the request as approved until HCM confirms.

### Manager Approval

Manager approval must re-check the authoritative balance at decision time.

### Reconciliation

Background reconciliation should detect mid-session balance changes and communicate them without surprising the user.

## TDD Expectations

This is a documentation task.

No code tests are required.

## Acceptance Criteria

- `docs/trd.md` exists.
- It is written in English.
- It is concise but complete enough to guide implementation.
- It does not overclaim correctness.
- It clearly states that HCM is the source of truth.
- It explains why optimistic pending is acceptable.
- It explains why optimistic approved is not acceptable.
