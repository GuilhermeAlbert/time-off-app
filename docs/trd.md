# ExampleHR Time-Off TRD Draft

## Problem Summary

ExampleHR needs a Time-Off module that lets employees view location-based balances, submit time-off requests, and lets managers approve or deny those requests. The product must feel fast while being clear that final balances and decisions depend on the external Human Capital Management system, HCM.

## Source of Truth

HCM owns all time-off balances. ExampleHR may cache, display, and reconcile balance data, but it must not present cached ExampleHR data as final truth unless it has authoritative confirmation from HCM.

## Product Goals

- Show employees their current known balances by location.
- Allow employees to submit time-off requests with immediate pending feedback.
- Allow managers to review, approve, and deny requests.
- Re-check authoritative balances before decisions that affect balances.
- Communicate stale or changed balances without surprising users.

## User Personas

- Employee: checks available time off and submits a request.
- Manager: reviews requests and decides whether to approve or deny them.
- System operator or reviewer: evaluates whether the UI handles external-system uncertainty honestly.

## Constraints

- HCM can return conflicts, slow responses, stale reads, or silent-wrong success responses.
- Balances can change outside ExampleHR, including work-anniversary adjustments.
- ExampleHR must not optimistically mark a request approved before HCM confirms it.
- Feature-specific code should stay colocated in the App Router route whenever implementation begins.

## Initial Architecture

Use the Next.js App Router. Time-off UI code should be colocated inside the time-off route with route-local components, services, helpers, types, enums, data, and schemas as needed. Mock API behavior should use App Router route handlers and keep request handling separate from UI components. Services should perform data access only; helpers should stay pure.

## Mock HCM Strategy

Build a mock HCM layer that behaves like an external authority rather than a trusted local store. It should support balance reads, request submission, manager decisions, conflict responses, delayed responses, and deliberate mismatch scenarios for silent-wrong success cases.

## UI State Strategy

Separate authoritative server data from local UI state. Balances shown in the UI should include freshness context when needed. Forms, filters, pending request rows, and transient messages should remain local to the route unless a real reuse case appears.

## Optimistic Update Strategy

Optimistic pending is acceptable because it represents ExampleHR receiving the user's intent, not HCM approving the request. Optimistic approved is not acceptable because approval changes the meaning of the request and can imply balance consumption before HCM confirms enough balance is available.

## Reconciliation Strategy

Reconciliation should periodically or eventfully re-fetch balances from HCM and compare them with the displayed state. When balances change mid-session, the UI should update clearly and explain that HCM has newer data. Manager approval must always re-check the authoritative balance at decision time.

## Testing Strategy

Use lightweight TDD for implementation phases. Prioritize unit tests for pure helpers and domain rules, route handler tests for mock HCM behavior, component tests for visible states, and end-to-end tests for employee submission and manager decision flows.

## Storybook Strategy

Use Storybook to prove important UI states: fresh balances, stale balances, loading, pending request, denied request, confirmed approval, HCM conflict, and reconciliation update. Stories should support review of behavior without requiring a live HCM service.

## Initial Tradeoffs

- Keep the initial architecture simple and colocated instead of creating global abstractions early.
- Treat the mock HCM as intentionally imperfect to exercise trust and reconciliation behavior.
- Prefer honest status language over always-fast confirmation.
- Delay exact API contracts and state-model details to their dedicated specs.
