import type { TimeOffBalance } from "../../types/time-off-balance";
import { SyncStatusBadge } from "../sync-status-badge";

type Props = {
  balance: TimeOffBalance;
};

export function BalanceCard({ balance }: Props) {
  return (
    <div>
      <p>{balance.location}</p>
      <p>{balance.availableDays}</p>
      <p>{balance.pendingDays}</p>
      <SyncStatusBadge status={balance.syncStatus} />
    </div>
  );
}
