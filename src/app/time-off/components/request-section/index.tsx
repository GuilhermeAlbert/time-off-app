"use client";

import { useRequestSubmission } from "../../hooks/use-request-submission";
import { RecentRequestsTable } from "../recent-requests-table";
import { RequestForm } from "../request-form";
import type { TimeOffRequest } from "../../types/time-off-request";
import { RequestStatus } from "../../enums/request-status";

export function RequestSection() {
  const { submit, pendingRequests, submissionError, reconciliationWarning } =
    useRequestSubmission();

  const optimisticRows: TimeOffRequest[] = pendingRequests.map((r) => ({
    id: r.id,
    startDate: r.startDate,
    location: r.location,
    requestedDays: r.requestedDays,
    status: RequestStatus.Pending,
  }));

  return (
    <div className="space-y-4">
      {reconciliationWarning && (
        <div className="rounded-lg border border-amber-100 bg-amber-50 px-4 py-3">
          <p className="text-xs text-amber-700">
            Balance may not reflect your latest request yet. Check back
            shortly.
          </p>
        </div>
      )}
      {submissionError && (
        <div className="rounded-lg border border-red-100 bg-red-50 px-4 py-3">
          <p className="text-xs text-red-600">
            Submission failed: {submissionError}
          </p>
        </div>
      )}
      <RequestForm onSubmit={submit} />
      {optimisticRows.length > 0 && (
        <div className="border-t border-[#F6F0E9] pt-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-zinc-400">
            Pending requests
          </p>
          <div className="overflow-hidden rounded-xl border border-[#F6F0E9]">
            <RecentRequestsTable requests={optimisticRows} />
          </div>
        </div>
      )}
    </div>
  );
}
