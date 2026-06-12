import { SyncStatus } from "../../enums/sync-status";

const labels: Record<SyncStatus, string> = {
  [SyncStatus.Fresh]: "Fresh",
  [SyncStatus.Refreshing]: "Refreshing",
  [SyncStatus.Stale]: "Stale",
};

type Props = {
  status: SyncStatus;
};

export function SyncStatusBadge({ status }: Props) {
  return <span>{labels[status]}</span>;
}
