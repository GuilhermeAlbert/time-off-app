import type { ManagerPendingRequest } from "../../types/manager-pending-request";

type Props = {
  request: ManagerPendingRequest;
  onApprove?: (id: string) => void;
  onDeny?: (id: string) => void;
};

export function ManagerRequestCard({ request, onApprove, onDeny }: Props) {
  return (
    <div>
      <p>{request.employeeName}</p>
      <p>{request.location}</p>
      <p>
        {request.requestedDays} days — {request.startDate} to {request.endDate}
      </p>
      <p>
        Available: {request.availableBalance} days · Pending:{" "}
        {request.pendingBalance} days
      </p>
      <button type="button" onClick={() => onApprove?.(request.id)}>
        Approve
      </button>
      <button type="button" onClick={() => onDeny?.(request.id)}>
        Deny
      </button>
    </div>
  );
}
