import type { TimeOffBalance } from "../../types/time-off-balance";
import { SyncStatusBadge } from "../sync-status-badge";

type Props = {
  balance: TimeOffBalance;
};

export function BalanceCard({ balance }: Props) {
  return (
    <div className="flex items-start justify-between rounded-xl border border-[#F6F0E9] bg-[#FEFBF5] p-5">
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-zinc-400">
          {balance.location}
        </p>
        <div className="mt-3 flex items-baseline gap-1.5">
          <span className="text-3xl font-semibold tabular-nums tracking-tight text-[#1C1A18]">
            {balance.availableDays}
          </span>
          <span className="text-sm text-zinc-400">days available</span>
        </div>
        {balance.pendingDays > 0 && (
          <p className="mt-1 text-xs text-zinc-400">
            {balance.pendingDays} pending
          </p>
        )}
      </div>
      <div className="mt-0.5">
        <SyncStatusBadge status={balance.syncStatus} />
      </div>
    </div>
  );
}
