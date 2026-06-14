import type { ManagerPendingRequest } from "../../types/manager-pending-request";
import { ManagerRequestCard } from "../manager-request-card";

type Props = {
  requests: ManagerPendingRequest[];
  onApprove?: (id: string) => void;
  onDeny?: (id: string) => void;
  decidingRequestId?: string | null;
};

export function ManagerRequestList({ requests, onApprove, onDeny, decidingRequestId }: Props) {
  if (requests.length === 0) {
    return (
      <div className="rounded-xl border border-[#F6F0E9] bg-[#FEFBF5] px-6 py-10 text-center">
        <p className="text-sm font-medium text-zinc-700">No pending requests</p>
        <p className="mt-1 text-xs text-zinc-400">
          New requests will appear here for review.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {requests.map((request) => (
        <ManagerRequestCard
          key={request.id}
          request={request}
          onApprove={onApprove}
          onDeny={onDeny}
          decidingRequestId={decidingRequestId}
        />
      ))}
    </div>
  );
}
