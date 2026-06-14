"use client";

import { useBalances } from "../../hooks/use-balances";
import { useReconciliation } from "../../hooks/use-reconciliation";
import { useRequestSubmission } from "../../hooks/use-request-submission";
import { SyncStatus } from "../../enums/sync-status";
import { RequestStatus } from "../../enums/request-status";
import { RecentRequestsTable } from "../recent-requests-table";
import { RequestForm } from "../request-form";
import type { TimeOffRequest } from "../../types/time-off-request";

export function RequestSection() {
  const { balances, isLoading: isLoadingBalances } = useBalances();
  const {
    submit,
    pendingRequests,
    refreshingLocationId,
    submissionError,
    reconciliationWarning,
  } = useRequestSubmission(balances);

  const isSubmitting = refreshingLocationId !== null;
  const { balanceRefreshed, staleBalanceIds } = useReconciliation(
    balances,
    isSubmitting,
  );

  // Overlay refreshing + mid-session-stale states onto the balance list that
  // the form sees, without mutating the source balances from useBalances.
  const displayBalances = balances.map((b) => {
    if (b.locationId === refreshingLocationId)
      return { ...b, syncStatus: SyncStatus.Refreshing };
    if (staleBalanceIds.includes(b.id))
      return { ...b, syncStatus: SyncStatus.Stale };
    return b;
  });

  const optimisticRows: TimeOffRequest[] = pendingRequests.map((r) => ({
    id: r.id,
    startDate: r.startDate,
    location: r.location,
    requestedDays: r.requestedDays,
    status: RequestStatus.Pending,
  }));

  return (
    <div className="space-y-4">
      {balanceRefreshed && (
        <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3">
          <p className="text-xs text-zinc-600">
            Your balance was updated by HCM. Reload the page to see the latest
            values.
          </p>
        </div>
      )}
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
      <RequestForm
        balances={displayBalances}
        isLoadingBalances={isLoadingBalances}
        onSubmit={submit}
      />
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
