import type { ManagerPendingRequest } from "../../types/manager-pending-request";

type Props = {
  request: ManagerPendingRequest;
  onApprove?: (id: string) => void;
  onDeny?: (id: string) => void;
  decidingRequestId?: string | null;
};

export function ManagerRequestCard({ request, onApprove, onDeny, decidingRequestId }: Props) {
  const isDeciding = decidingRequestId === request.id;
  return (
    <div className="rounded-xl border border-[#F6F0E9] bg-[#FEFBF5] p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <p className="truncate text-sm font-semibold text-[#1C1A18]">
              {request.employeeName}
            </p>
            <span className="text-xs text-zinc-300">·</span>
            <p className="text-xs text-zinc-500">{request.location}</p>
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="inline-flex items-center rounded-full border border-[#F6F0E9] bg-white px-2 py-0.5 text-xs font-semibold text-[#904209]">
              {request.requestedDays} days
            </span>
            <p className="font-mono text-xs text-zinc-400">
              {request.startDate} → {request.endDate}
            </p>
          </div>

          <div className="mt-3 flex items-center gap-3 rounded-lg border border-[#F6F0E9] bg-white px-3 py-2">
            <span className="text-xs text-zinc-400">Balance</span>
            <span className="text-xs font-medium text-zinc-700">
              {request.availableBalance} available
            </span>
            {request.pendingBalance > 0 && (
              <>
                <span className="text-xs text-zinc-300">·</span>
                <span className="text-xs text-zinc-400">
                  {request.pendingBalance} pending
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={() => onDeny?.(request.id)}
            disabled={isDeciding}
            className="rounded-lg border border-[#F6F0E9] bg-white px-3 py-1.5 text-xs font-medium text-zinc-600 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Deny
          </button>
          <button
            type="button"
            onClick={() => onApprove?.(request.id)}
            disabled={isDeciding}
            className="rounded-lg bg-[#904209] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#7A3607] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}
