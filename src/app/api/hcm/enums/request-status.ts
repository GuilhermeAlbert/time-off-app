export enum RequestStatus {
  Draft = "draft",
  Submitting = "submitting",
  OptimisticPending = "optimistic-pending",
  Pending = "pending",
  Confirmed = "confirmed",
  Rejected = "rejected",
  NeedsReconciliation = "needs-reconciliation",
  RolledBack = "rolled-back",
  Conflict = "conflict",
}
