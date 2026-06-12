# ExampleHR TDD Specs

This folder contains the complete task-by-task implementation plan for the ExampleHR Time-Off take-home assignment.

The project should be implemented through agentic development using lightweight TDD.

## Execution Order

1. Phase 0 — Planning and architecture
2. Phase 1 — Mock HCM API, TDD
3. Phase 2 — Static UI, TDD
4. Phase 3 — Integration, TDD
5. Phase 4 — Storybook proof
6. Phase 5 — Final documentation

## How to Use

Pick one spec file, give it to the coding agent, and ask the agent to implement only that task.

The agent must:

1. Read `AGENTS.md`
2. Read `docs/project-standards.md`
3. Read relevant local Next.js docs from `node_modules/next/dist/docs/`
4. Follow the spec
5. Write tests first whenever applicable
6. Implement only the current task
7. Run checks
8. Stop

## Design Intent

This plan avoids overengineering.

The goal is a simple, well-structured project that demonstrates senior-level reasoning around:

- source-of-truth ownership
- optimistic pending feedback
- stale balance reconciliation
- manager approval confidence
- silent HCM failures
- conflict recovery
- testable UI states
