# ExampleHR Time-Off Testing Strategy

This strategy keeps testing lightweight and risk-driven. Each implementation task should start with the smallest meaningful failing test, add only the code needed to pass, and avoid broad test infrastructure until a spec requires it.

The goal is not maximum test count. The goal is to protect the behaviors that make this take-home meaningful: HCM as source of truth, optimistic pending feedback, rollback after HCM rejection, silent-wrong recovery, stale balance reconciliation, and manager approval re-checks.

## Test Pyramid for This Project

Use a narrow pyramid with most coverage near deterministic behavior:

1. API behavior tests for mock HCM route handlers and contract edge cases.
2. Unit tests for pure helpers that calculate dates, requested days, state transitions, or response normalization.
3. Component tests for user-visible states and form behavior.
4. Integration tests for employee submission and manager decision flows.
5. Storybook stories for visual state coverage, with interaction tests only for high-value states.

Prefer colocated tests near the route or feature they protect. Do not create global test helpers unless multiple specs need the same setup.

## API Behavior Tests

API behavior tests should protect the mock HCM contract in `docs/api-contracts.md`.

Cover:

- HCM returns balances as the authoritative source.
- Request submission creates pending requests only when HCM accepts them.
- Insufficient balance returns an error and does not create a request.
- Manager approval re-checks the authoritative balance before confirming.
- Conflict responses appear when request or balance versions are stale.
- Silent-wrong mode returns success that later reconciliation can detect.
- Anniversary bonus changes balances outside ExampleHR.

These tests should call route handler behavior directly or through HTTP-level integration when route handlers exist. Keep assertions on status, response shape, state changes, and HCM-owned balances.

## Unit Tests

Unit tests are for pure helpers only.

Good unit-test targets:

- Requested-day calculations.
- Date range validation.
- Mapping HCM responses to documented balance and request states.
- Reconciliation comparison logic.
- Error-code normalization.

Avoid unit-testing route handlers, React components, hooks, or framework behavior. If a helper needs many mocks, it probably belongs in an integration test or should be simplified.

## Component Tests

Component tests should focus on visible UI behavior, not implementation details.

Cover:

- Balance cards show fresh, stale, refreshing, error, and changed-mid-session states.
- Request form shows submitting and optimistic-pending feedback.
- Rejection or rollback messages are clear after HCM denial.
- Conflict messages guide the user or manager to refresh/retry.
- Manager review UI blocks final approval until the authoritative re-check completes.

Assert accessible text, roles, form controls, and user-visible state. Do not assert CSS class names or internal React state.

## Integration Tests

Integration tests should cover the highest-risk user flows across services, route handlers, and UI state.

Prioritize:

- Employee sees balance, submits request, receives optimistic pending, then HCM confirms pending.
- Employee submission rolls back when HCM rejects the request.
- Silent-wrong success moves the request into reconciliation instead of final confirmation.
- Background reconciliation detects a mid-session balance change.
- Manager approval re-reads HCM balance and confirms only if balance is still valid.
- Manager approval shows conflict when HCM balance or request version changed.

Use deterministic simulation modes instead of timing-dependent or random scenarios.

## Storybook Interaction Tests

Storybook should prove visual state coverage first and use interaction tests sparingly.

Stories should cover:

- Fresh, stale, refreshing, error, changed-mid-session, and reconciliation-needed balances.
- Draft, submitting, optimistic-pending, pending, confirmed, rejected, rolled-back, and conflict requests.
- Manager review states for approve, deny, conflict, and insufficient balance.

Interaction tests should be limited to high-value flows such as submitting a request, seeing optimistic pending feedback, and manager decision controls. Do not duplicate every integration test in Storybook.

## What Not to Test

Avoid tests for:

- CSS implementation details.
- Exact class names.
- Internal React state.
- Implementation details of hooks.
- Next.js framework behavior.
- Trivial rendering with no business risk.
- Duplicated assertions already covered at a better layer.

Do not add snapshot tests unless they protect a specific stable contract. Broad snapshots make refactoring harder without protecting the HCM trust model.

## Deterministic Simulation Strategy

Simulation modes must be deterministic and explicit:

- `normal` returns the expected HCM-backed result.
- `conflict` returns stale version or incompatible state errors.
- `silent-wrong` returns success while leaving follow-up data inconsistent.
- `slow` delays the response in a controlled way.
- `insufficient-balance` returns a balance-related failure.

Tests should set the simulation mode directly in query params or request bodies. Avoid random failures, real timers where fake timers are enough, and shared mutable data that leaks between tests.

For every behavior-changing spec, write the first failing test around the smallest observable risk. Passing lint, typecheck, and the relevant test command is required before marking the spec complete.
