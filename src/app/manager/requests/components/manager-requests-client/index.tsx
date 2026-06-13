"use client";

import { useManagerRequests } from "../../hooks/use-manager-requests";
import { ManagerRequestList } from "../manager-request-list";

export function ManagerRequestsClient() {
  const { requests, isLoading, error, decisionError, approve, deny } =
    useManagerRequests();

  if (isLoading) {
    return (
      <div className="space-y-3">
        <p className="sr-only">Loading requests...</p>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-xl border border-[#F6F0E9] bg-[#F6F0E9]"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
        <p className="text-sm text-red-600">Failed to load requests: {error}</p>
      </div>
    );
  }

  return (
    <div>
      {decisionError && (
        <div className="mb-4 rounded-lg border border-red-100 bg-red-50 px-4 py-3">
          <p className="text-xs text-red-600">{decisionError}</p>
        </div>
      )}
      <ManagerRequestList
        requests={requests}
        onApprove={approve}
        onDeny={deny}
      />
    </div>
  );
}
