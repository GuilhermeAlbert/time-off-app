import { SyncStatus } from "../enums/sync-status";
import type { TimeOffBalance } from "../types/time-off-balance";

const employeeId = "employee-example-001";
const lastSyncedAt = "2026-06-12T12:00:00.000Z";

export const initialTimeOffBalances: TimeOffBalance[] = [
  {
    id: "balance-new-york-employee-example-001",
    employeeId,
    locationId: "new-york",
    availableDays: 18,
    pendingDays: 0,
    version: 1,
    syncStatus: SyncStatus.Fresh,
    lastSyncedAt,
  },
  {
    id: "balance-london-employee-example-001",
    employeeId,
    locationId: "london",
    availableDays: 12,
    pendingDays: 0,
    version: 1,
    syncStatus: SyncStatus.Fresh,
    lastSyncedAt,
  },
  {
    id: "balance-remote-employee-example-001",
    employeeId,
    locationId: "remote",
    availableDays: 22,
    pendingDays: 0,
    version: 1,
    syncStatus: SyncStatus.Fresh,
    lastSyncedAt,
  },
];

export const timeOffBalances: TimeOffBalance[] = initialTimeOffBalances.map(
  (balance) => ({ ...balance }),
);
