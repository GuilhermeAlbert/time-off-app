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
    <div>
      {reconciliationWarning && (
        <p>
          Balance may not reflect your latest request yet. Check back shortly.
        </p>
      )}
      {submissionError && <p>Submission failed: {submissionError}</p>}
      <RequestForm onSubmit={submit} />
      {optimisticRows.length > 0 && (
        <div>
          <p>Pending requests</p>
          <RecentRequestsTable requests={optimisticRows} />
        </div>
      )}
    </div>
  );
}
