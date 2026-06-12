import type { ManagerPendingRequest } from "../../types/manager-pending-request";
import { ManagerRequestCard } from "../manager-request-card";

type Props = {
  requests: ManagerPendingRequest[];
};

export function ManagerRequestList({ requests }: Props) {
  if (requests.length === 0) {
    return <p>No pending requests</p>;
  }

  return (
    <div>
      {requests.map((request) => (
        <ManagerRequestCard key={request.id} request={request} />
      ))}
    </div>
  );
}
