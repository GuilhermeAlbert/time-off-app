import type { ManagerPendingRequest } from "../../types/manager-pending-request";

type Props = {
  request: ManagerPendingRequest;
};

export function ManagerRequestCard({ request }: Props) {
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
      <button type="button">Approve</button>
      <button type="button">Deny</button>
    </div>
  );
}
