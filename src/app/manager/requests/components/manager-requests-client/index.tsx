"use client";

import { useManagerRequests } from "../../hooks/use-manager-requests";
import { ManagerRequestList } from "../manager-request-list";

export function ManagerRequestsClient() {
  const { requests, isLoading, error, decisionError, approve, deny } =
    useManagerRequests();

  if (isLoading) {
    return <p>Loading requests...</p>;
  }

  if (error) {
    return <p>Failed to load requests: {error}</p>;
  }

  return (
    <div>
      {decisionError && <p>{decisionError}</p>}
      <ManagerRequestList requests={requests} onApprove={approve} onDeny={deny} />
    </div>
  );
}
