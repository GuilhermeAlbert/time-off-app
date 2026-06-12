# ExampleHR Time-Off State Model

This draft defines the states the implementation should use for balances and time-off requests. HCM remains the source of truth for balances; ExampleHR state only represents what the UI currently knows or is verifying.

## Balance States

Use a `BalanceState` enum in implementation with values aligned to these names.

| State | Meaning | UI implication |
| --- | --- | --- |
| `fresh` | The balance was recently read from HCM and has no known mismatch. | Show normally. |
| `refreshing` | ExampleHR is re-reading HCM while showing the last known balance. | Keep current value visible with loading context. |
| `stale` | The balance is older than the accepted freshness window. | Warn that the value needs refresh before decisions. |
| `changed-mid-session` | Reconciliation found that HCM balance changed while the user was active. | Show the new value and explain the update. |
| `reconciliation-needed` | ExampleHR received a response that cannot be trusted without another HCM read. | Block final claims until rechecked. |
| `error` | The latest balance read failed. | Show failure state and allow retry. |

## Request States

Use a `RequestState` enum in implementation with values aligned to these names.

| State | Meaning | Next expected action |
| --- | --- | --- |
| `draft` | Employee is preparing a request locally. | Submit to ExampleHR/HCM. |
| `submitting` | The request is being sent. | Wait for HCM response. |
| `optimistic-pending` | The UI shows immediate pending feedback before HCM confirms receipt. | Re-read authoritative balance. |
| `pending` | HCM accepted the request as pending manager review. | Wait for manager decision. |
| `confirmed` | HCM confirmed the manager approval. | Treat as approved and refresh balances. |
| `rejected` | HCM confirmed a denial or rejection. | Show final rejection reason when available. |
| `needs-reconciliation` | HCM response or follow-up balance read does not line up with local expectations. | Re-read HCM before showing final status. |
| `rolled-back` | An optimistic request was removed because HCM did not accept it. | Explain that the request was not saved. |
| `conflict` | HCM reported that the current balance or request version prevents the action. | Show conflict and require user or manager review. |

## Employee Submission Lifecycle

1. User sees a balance with its current `BalanceState`.
2. User submits a request from `draft`.
3. Request moves to `submitting`.
4. UI may show `optimistic-pending` to acknowledge the user's intent.
5. HCM receives the request.
6. ExampleHR re-reads the single authoritative HCM balance for the employee and location.
7. If HCM accepted the request and the balance read is consistent, request becomes `pending` and balance becomes `fresh`.
8. If HCM rejected the request, request becomes `rolled-back` or `rejected` depending on whether it was ever accepted by HCM.
9. If HCM response and balance read disagree, request becomes `needs-reconciliation` and balance becomes `reconciliation-needed`.

## Manager Decision Lifecycle

1. Manager opens a `pending` request.
2. UI shows the last known balance context and freshness state.
3. Manager clicks approve or deny.
4. For approval, ExampleHR re-reads the authoritative HCM balance before finalizing.
5. Approval succeeds only if HCM confirms the request is still valid and the balance is sufficient.
6. Successful approval moves the request to `confirmed` and refreshes the balance.
7. Denial moves the request to `rejected` after HCM confirms the decision.
8. If HCM reports an insufficient balance, stale version, or incompatible request state, request becomes `conflict`.

## Reconciliation Lifecycle

1. ExampleHR schedules or triggers a background balance re-read.
2. While the read is active, balance is `refreshing`.
3. If HCM returns the same balance, state returns to `fresh`.
4. If HCM returns a different balance, state becomes `changed-mid-session`.
5. If the new balance affects visible requests, those requests become `needs-reconciliation`.
6. If the read fails, balance becomes `error` without overwriting the last known value.

## Silent-Wrong Recovery

Silent-wrong recovery handles cases where HCM returns success but the follow-up authoritative balance does not match the expected result.

1. Keep the user's request visible, but do not mark it final.
2. Move the request to `needs-reconciliation`.
3. Move the related balance to `reconciliation-needed`.
4. Re-read HCM and compare the request and balance again.
5. Resolve to `pending`, `confirmed`, `rejected`, `rolled-back`, or `conflict` only after authoritative data agrees.

## Conflict Recovery

Conflict recovery handles explicit HCM conflict responses.

1. Keep the HCM response as authoritative for the failed action.
2. Move the request to `conflict`.
3. Refresh the affected balance from HCM.
4. Explain that the request could not proceed because the authoritative balance or request version changed.
5. Let the employee revise the request or let the manager retry after reviewing the updated balance context.

This model is intentionally simple. The implementation should use enums and clear transition logic, not a state-machine library, unless a later spec creates a real need for one.
