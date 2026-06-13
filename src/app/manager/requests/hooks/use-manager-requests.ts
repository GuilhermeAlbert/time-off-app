import { useEffect, useState } from "react";

import type { ManagerPendingRequest } from "../types/manager-pending-request";
import {
  approveRequest,
  denyRequest,
  getBalances,
  getPendingRequests,
} from "../services/manager-request-service";

type UseManagerRequestsResult = {
  requests: ManagerPendingRequest[];
  isLoading: boolean;
  error: string | null;
  decisionError: string | null;
  approve: (requestId: string) => Promise<void>;
  deny: (requestId: string) => Promise<void>;
};

export function useManagerRequests(): UseManagerRequestsResult {
  const [requests, setRequests] = useState<ManagerPendingRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [decisionError, setDecisionError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setIsLoading(true);
      setError(null);
      try {
        const [{ requests: hcmRequests }, { balances: hcmBalances }] =
          await Promise.all([getPendingRequests(), getBalances()]);

        const enriched: ManagerPendingRequest[] = hcmRequests.map((req) => {
          const balance = hcmBalances.find((b) => b.id === req.balanceId);
          return {
            id: req.id,
            employeeName: req.employeeId,
            location: req.locationId,
            requestedDays: req.requestedDays,
            startDate: req.startDate,
            endDate: req.endDate,
            availableBalance: balance?.availableDays ?? 0,
            pendingBalance: balance?.pendingDays ?? 0,
          };
        });

        setRequests(enriched);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load requests");
      } finally {
        setIsLoading(false);
      }
    }
    void load();
  }, []);

  async function approve(requestId: string) {
    setDecisionError(null);
    try {
      await approveRequest(requestId);
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (e) {
      setDecisionError(e instanceof Error ? e.message : "Approval failed");
    }
  }

  async function deny(requestId: string) {
    setDecisionError(null);
    try {
      await denyRequest(requestId);
      setRequests((prev) => prev.filter((r) => r.id !== requestId));
    } catch (e) {
      setDecisionError(e instanceof Error ? e.message : "Denial failed");
    }
  }

  return { requests, isLoading, error, decisionError, approve, deny };
}
