export enum SyncStatus {
  Fresh = "fresh",
  Refreshing = "refreshing",
  Stale = "stale",
  ChangedMidSession = "changed-mid-session",
  ReconciliationNeeded = "reconciliation-needed",
  Error = "error",
}
