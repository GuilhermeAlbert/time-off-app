import { RequestStatus } from "../../enums/request-status";
import type { TimeOffRequest } from "../../types/time-off-request";

const statusLabels: Record<RequestStatus, string> = {
  [RequestStatus.Pending]: "Pending",
  [RequestStatus.Confirmed]: "Confirmed",
  [RequestStatus.Rejected]: "Rejected",
  [RequestStatus.NeedsReconciliation]: "Needs Reconciliation",
};

type Props = {
  requests: TimeOffRequest[];
};

export function RecentRequestsTable({ requests }: Props) {
  if (requests.length === 0) {
    return <p>No recent requests</p>;
  }

  return (
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Location</th>
          <th>Days</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {requests.map((request) => (
          <tr key={request.id}>
            <td>{request.startDate}</td>
            <td>{request.location}</td>
            <td>{request.requestedDays}</td>
            <td>{statusLabels[request.status]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
