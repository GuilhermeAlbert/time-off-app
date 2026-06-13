import { SyncStatus } from "../../enums/sync-status";

const labels: Record<SyncStatus, string> = {
  [SyncStatus.Fresh]: "Fresh",
  [SyncStatus.Refreshing]: "Refreshing",
  [SyncStatus.Stale]: "Stale",
};

const styles: Record<SyncStatus, string> = {
  [SyncStatus.Fresh]:
    "bg-emerald-50 text-emerald-600 border border-emerald-100",
  [SyncStatus.Refreshing]:
    "bg-amber-50 text-amber-600 border border-amber-100",
  [SyncStatus.Stale]: "bg-orange-50 text-orange-600 border border-orange-100",
};

type Props = {
  status: SyncStatus;
};

export function SyncStatusBadge({ status }: Props) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}
