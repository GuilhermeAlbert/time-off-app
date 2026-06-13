import { RequestStatus } from "../../enums/request-status";
import type { TimeOffRequest } from "../../types/time-off-request";

const statusLabels: Record<RequestStatus, string> = {
  [RequestStatus.Pending]: "Pending",
  [RequestStatus.Confirmed]: "Confirmed",
  [RequestStatus.Rejected]: "Rejected",
  [RequestStatus.NeedsReconciliation]: "Needs Reconciliation",
};

const statusStyles: Record<RequestStatus, string> = {
  [RequestStatus.Pending]:
    "bg-amber-50 text-amber-700 border border-amber-100",
  [RequestStatus.Confirmed]:
    "bg-emerald-50 text-emerald-700 border border-emerald-100",
  [RequestStatus.Rejected]: "bg-red-50 text-red-600 border border-red-100",
  [RequestStatus.NeedsReconciliation]:
    "bg-orange-50 text-orange-700 border border-orange-100",
};

type Props = {
  requests: TimeOffRequest[];
};

export function RecentRequestsTable({ requests }: Props) {
  if (requests.length === 0) {
    return (
      <div className="px-6 py-10 text-center">
        <p className="text-sm font-medium text-zinc-600">No recent requests</p>
        <p className="mt-1 text-xs text-zinc-400">
          Submitted requests will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-[#F6F0E9]">
            <th className="py-2.5 pl-5 pr-3 text-left text-xs font-medium text-zinc-400">
              Date
            </th>
            <th className="px-3 py-2.5 text-left text-xs font-medium text-zinc-400">
              Location
            </th>
            <th className="px-3 py-2.5 text-left text-xs font-medium text-zinc-400">
              Days
            </th>
            <th className="py-2.5 pl-3 pr-5 text-left text-xs font-medium text-zinc-400">
              Status
            </th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr
              key={request.id}
              className="border-b border-[#F6F0E9] last:border-0"
            >
              <td className="py-3 pl-5 pr-3 font-mono text-xs text-zinc-600">
                {request.startDate}
              </td>
              <td className="px-3 py-3 text-sm text-zinc-700">
                {request.location}
              </td>
              <td className="px-3 py-3 text-sm tabular-nums text-zinc-700">
                {request.requestedDays}
              </td>
              <td className="py-3 pl-3 pr-5">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusStyles[request.status]}`}
                >
                  {statusLabels[request.status]}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
