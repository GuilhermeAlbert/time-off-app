import { SyncStatus } from "../enums/sync-status";

export type TimeOffBalance = {
  id: string;
  employeeId: string;
  locationId: string;
  availableDays: number;
  pendingDays: number;
  version: number;
  syncStatus: SyncStatus;
  lastSyncedAt: string;
};
