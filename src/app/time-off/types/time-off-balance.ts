import { SyncStatus } from "../enums/sync-status";

export type TimeOffBalance = {
  id: string;
  location: string;
  availableDays: number;
  pendingDays: number;
  syncStatus: SyncStatus;
};
