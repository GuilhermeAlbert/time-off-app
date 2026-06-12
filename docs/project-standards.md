# Next.js Project Standards

> Official project structure and architecture guidelines for Next.js applications using App Router, TypeScript, React and Tailwind CSS.

---

# Philosophy

This standard prioritizes:

- Simplicity
- Colocation
- Progressive scalability
- Developer experience
- AI-friendly codebases (Codex, Claude Code, Cursor)
- Predictable conventions

Avoid premature abstractions.

A folder should only be promoted to a global/shared location when there is a real reuse case.

---

# Core Structure

```txt
src/
├── app/
├── components/
├── contexts/
├── hooks/
├── services/
├── helpers/
├── lib/
├── styles/
└── types/
```

---

# Feature Structure

Every feature should live inside its own route whenever possible.

Example:

```txt
src/app/time-off/
├── page.tsx
├── loading.tsx
├── error.tsx
│
├── components/
├── contexts/
├── hooks/
├── services/
├── schemas/
├── types/
├── enums/
├── helpers/
├── constants/
└── data/
```

Feature-specific code should stay inside the feature.

---

# Components

## Structure

All components must follow this pattern:

```txt
component-name/
└── index.tsx
```

Example:

```txt
components/
├── balance-card/
│   └── index.tsx
│
├── request-form/
│   └── index.tsx
│
└── recent-requests-table/
    └── index.tsx
```

## Naming

Components must use PascalCase.

```tsx
export function BalanceCard() {}
```

---

# Types

Each type should live in its own file.

## Structure

```txt
types/
├── time-off-balance.ts
├── time-off-request.ts
└── employee.ts
```

## Example

```ts
export type TimeOffBalance = {
  id: string;
  location: string;
  availableDays: number;
};
```

## Rules

- One primary type per file
- Always exported
- PascalCase type names
- kebab-case file names

---

# Enums

Prefer enums whenever the values represent a finite set of states.

## Structure

```txt
enums/
├── sync-status.ts
├── request-status.ts
└── user-role.ts
```

## Example

```ts
export enum SyncStatus {
  Fresh = "fresh",
  Refreshing = "refreshing",
  Stale = "stale",
}
```

---

# Hooks

## Structure

```txt
hooks/
├── use-balances.ts
├── use-request-form.ts
└── use-employees.ts
```

## Rules

- Must start with `use`
- camelCase naming
- Single responsibility

Example:

```ts
export function useBalances() {}
```

---

# Services

Services are responsible for communication with APIs, storage layers, and external integrations.

## Structure

```txt
services/
├── employee-service.ts
├── time-off-service.ts
└── auth-service.ts
```

## Example

```ts
export async function getBalances() {}
```

## Rules

- No UI logic
- No JSX
- No React dependencies
- Data access only

---

# Contexts

Use Context only when truly necessary.

Avoid Context for local component state.

## Structure

```txt
contexts/
├── auth-context.tsx
├── theme-context.tsx
└── employee-context.tsx
```

## Example

```tsx
export const AuthContext = createContext(null);
```

---

# Helpers

Helpers should contain pure utility functions.

## Structure

```txt
helpers/
├── format-date.ts
├── format-currency.ts
└── calculate-days.ts
```

## Example

```ts
export function calculateDays() {}
```

## Rules

- No React dependencies
- No state management
- No JSX
- Pure functions whenever possible

---

# Constants

Static values used across the application.

## Structure

```txt
constants/
├── locations.ts
├── countries.ts
└── permissions.ts
```

---

# Schemas

Validation schemas and contracts.

Prefer Zod.

## Structure

```txt
schemas/
├── request-schema.ts
└── employee-schema.ts
```

## Example

```ts
export const RequestSchema = z.object({
  startDate: z.string(),
  endDate: z.string(),
});
```

---

# Data

Temporary mocks, fixtures and local datasets.

## Structure

```txt
data/
├── balances.ts
├── requests.ts
└── employees.ts
```

---

# Shared Components

Reusable components available to the entire application.

```txt
src/components/
├── button/
│   └── index.tsx
│
├── card/
│   └── index.tsx
│
├── input/
│   └── index.tsx
│
└── modal/
    └── index.tsx
```

Avoid structures such as:

```txt
components/ui
components/common
components/shared
```

Use:

```txt
src/components
```

only.

---

# Naming Conventions

## Folders

Always:

```txt
kebab-case
```

Examples:

```txt
time-off
balance-card
request-form
```

---

## Files

Always:

```txt
kebab-case
```

Examples:

```txt
time-off-balance.ts
request-status.ts
use-balances.ts
```

---

## Components

Always:

```txt
PascalCase
```

Examples:

```tsx
BalanceCard;
RequestForm;
RecentRequestsTable;
```

---

## Types

Always:

```txt
PascalCase
```

Examples:

```ts
TimeOffBalance;
Employee;
Request;
```

---

## Enums

Always:

```txt
PascalCase
```

Examples:

```ts
SyncStatus;
RequestStatus;
UserRole;
```

---

## Hooks

Always:

```txt
camelCase
```

Examples:

```ts
useBalances;
useRequestForm;
useEmployee;
```

---

# Decision Rule

Keep code as close as possible to where it is used.

Before moving anything into a global folder, ask:

> Is this actually reused by multiple features?

If the answer is no, keep it inside the feature.

---

# Example Feature Structure

```txt
src/app/time-off/
├── page.tsx
│
├── components/
│   ├── balance-card/
│   │   └── index.tsx
│   │
│   ├── request-form/
│   │   └── index.tsx
│   │
│   └── recent-requests-table/
│       └── index.tsx
│
├── contexts/
│   └── time-off-context.tsx
│
├── hooks/
│   ├── use-balances.ts
│   └── use-request-form.ts
│
├── services/
│   └── time-off-service.ts
│
├── schemas/
│   └── request-schema.ts
│
├── types/
│   ├── time-off-balance.ts
│   └── time-off-request.ts
│
├── enums/
│   ├── sync-status.ts
│   └── request-status.ts
│
├── helpers/
│   └── calculate-requested-days.ts
│
├── constants/
│   └── locations.ts
│
└── data/
    ├── balances.ts
    └── requests.ts
```
