# completion-rules.md

# Task Completion Rules

Whenever a spec is completed successfully, the agent MUST:

1. Update `specs/progress.md`
2. Mark the completed task as `[x]`
3. Update the phase totals
4. Update the overall total
5. Include progress information in the final report

A task can only be marked as completed if:

- The implementation is finished
- Relevant tests pass
- Typecheck passes
- Lint passes

If any of the above fail:

- Leave the task unchecked
- Report the issue

Example:

Before:

```md
- [ ] 06-batch-balances-endpoint
```

After:

```md
- [x] 06-batch-balances-endpoint
```

The progress file should always represent the real state of the repository.
