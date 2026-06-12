# Agent Execution Prompt

Use this prompt to execute any single spec.

```txt
You are working on the ExampleHR Time-Off take-home assignment.

Before writing code:

1. Read AGENTS.md.
2. Read docs/project-standards.md.
3. Read the relevant local Next.js docs from node_modules/next/dist/docs/.
4. Read the spec file I provide.

Use lightweight TDD:

1. Write the smallest meaningful failing test first.
2. Implement the minimum code to pass.
3. Refactor only if it makes the implementation clearer.
4. Do not add abstractions for future tasks.

Implement only the current spec.

Do not start the next spec.

After implementation, run the relevant commands available in the project, such as:

- npm run lint
- npm run typecheck
- npm run test

Then report:

- What changed
- Files created or updated
- Tests added
- Commands run
- Any issues or tradeoffs
```
