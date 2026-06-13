# ExampleHR Submission Checklist

All commands run from the `app/` directory unless noted.

---

## Setup

### App runs locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000). The time-off page should load with balance cards.

Navigate to [http://localhost:3000/time-off](http://localhost:3000/time-off) for the employee workspace and [http://localhost:3000/manager/requests](http://localhost:3000/manager/requests) for the manager workspace.

- [ ] App runs locally

### Storybook runs locally

```bash
npm run storybook
```

Visit [http://localhost:6006](http://localhost:6006). Stories for BalanceList, RequestForm, RecentRequestsTable, and ManagerReview should all render.

- [ ] Storybook runs locally

---

## Quality Gates

### Tests run

```bash
npx vitest run
```

Expected: all test files pass, no errors.

- [ ] Tests run

### Lint passes

```bash
npm run lint
```

Expected: no errors (warnings in pre-existing Storybook template files are acceptable if not introduced by this project).

- [ ] Lint passes

### Typecheck passes

```bash
node_modules/.bin/tsc --noEmit
```

Expected: no output (clean).

- [ ] Typecheck passes

---

## Documentation

### TRD exists

Check that `docs/trd.md` exists and covers all 19 required sections:

```bash
cat docs/trd.md | grep "^##"
```

- [ ] TRD exists

### Coverage proof exists

Check that `docs/coverage-proof.md` exists and covers all 8 required sections:

```bash
cat docs/coverage-proof.md | grep "^##"
```

- [ ] Coverage proof exists

### README has setup instructions

Open `README.md`. Confirm it contains instructions for running the development server.

- [ ] README has setup instructions

---

## Functional Verification

Run the dev server first: `npm run dev`

### Mock HCM endpoints work

```bash
curl http://localhost:3000/api/hcm/balances
```

Expected: JSON response with `data.balances` array containing New York, London, and Remote balances.

```bash
curl http://localhost:3000/api/hcm/requests
```

Expected: JSON response with `data.requests` array (empty on a fresh start).

- [ ] Mock HCM endpoints work

### Employee flow works

1. Visit [http://localhost:3000/time-off](http://localhost:3000/time-off)
2. Verify balance cards load with available days and sync status
3. Fill in the request form (location, dates, days requested)
4. Click **Submit Request**
5. Verify the request appears in the pending list with status **Pending** (not Approved)
6. Verify the form clears after submission

- [ ] Employee flow works

### Manager flow works

1. Submit a request as an employee first (see employee flow above)
2. Visit [http://localhost:3000/manager/requests](http://localhost:3000/manager/requests)
3. Verify the pending request card appears with employee info and balance context
4. Click **Approve** — verify the card disappears from the queue
5. Repeat with a new request and click **Deny** — verify the card disappears

- [ ] Manager flow works

### Reconciliation scenario works

1. Submit a request via the employee form to create some balance activity
2. In a separate terminal, trigger an out-of-band balance change:

```bash
curl -X POST http://localhost:3000/api/hcm/simulations/anniversary-bonus \
  -H "Content-Type: application/json" \
  -d "{}"
```

3. Wait up to 30 seconds (the reconciliation polling interval)
4. Verify the balance card shows a **Stale** sync status badge indicating HCM has newer data

- [ ] Reconciliation scenario works

### Silent-wrong scenario is visible

Submit a request with `simulationMode: "silent-wrong"` via the API directly:

```bash
curl -X POST http://localhost:3000/api/hcm/requests \
  -H "Content-Type: application/json" \
  -d '{"employeeId":"employee-example-001","locationId":"new-york","startDate":"2026-09-01","endDate":"2026-09-03","daysRequested":2,"simulationMode":"silent-wrong"}'
```

Expected: 201 response with `reconciliationHint: "silent-wrong-balance-not-reserved"`. The UI (via `useRequestSubmission`) shows a reconciliation warning when this mode is triggered through the employee form if `HcmSilentlyWrong` Storybook story is used to demonstrate it.

- [ ] Silent-wrong scenario is visible

### Conflict scenario is visible

Open the **ManagerReview/ConflictAtDecisionTime** story in Storybook at [http://localhost:6006](http://localhost:6006). The play function clicks **Approve** and the story asserts that the "Insufficient balance" conflict message appears.

Alternatively, trigger via the API after creating a request:

```bash
curl -X POST http://localhost:3000/api/hcm/requests/request-1/decision \
  -H "Content-Type: application/json" \
  -d '{"decision":"approve"}'
```

A 409 with `code: "insufficient-balance"` will appear if the balance is insufficient.

- [ ] Conflict scenario is visible
