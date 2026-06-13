import { SyncStatus } from "../enums/sync-status";

export type TimeOffBalance = {
  id: string;
  locationId: string;
  location: string;
  availableDays: number;
  pendingDays: number;
  syncStatus: SyncStatus;
};
