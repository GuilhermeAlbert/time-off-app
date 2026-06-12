import { SyncStatus } from "../enums/sync-status";
import type { TimeOffBalance } from "../types/time-off-balance";

export const balances: TimeOffBalance[] = [
  {
    id: "balance-new-york",
    location: "New York",
    availableDays: 18,
    pendingDays: 0,
    syncStatus: SyncStatus.Fresh,
  },
  {
    id: "balance-london",
    location: "London",
    availableDays: 12,
    pendingDays: 0,
    syncStatus: SyncStatus.Fresh,
  },
  {
    id: "balance-remote",
    location: "Remote",
    availableDays: 22,
    pendingDays: 0,
    syncStatus: SyncStatus.Fresh,
  },
];
