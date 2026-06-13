import { useState } from "react";

import {
  getBalance,
  submitTimeOffRequest,
} from "../services/time-off-service";
import type { TimeOffBalance } from "../types/time-off-balance";
import type { TimeOffRequestFormValues } from "../types/time-off-request-form-values";

const EMPLOYEE_ID = "employee-example-001";

type OptimisticRequest = {
  id: string;
  location: string;
  requestedDays: number;
  startDate: string;
  endDate: string;
  status: "pending";
};

type SubmitResponseData = {
  request: { id: string; status: string };
  balance: { id: string };
  reconciliationHint?: "silent-wrong-balance-not-reserved";
};

type UseRequestSubmissionResult = {
  pendingRequests: OptimisticRequest[];
  refreshingLocationId: string | null;
  submissionError: string | null;
  reconciliationWarning: boolean;
  submit: (values: TimeOffRequestFormValues) => Promise<void>;
};

export function useRequestSubmission(
  balances: TimeOffBalance[],
): UseRequestSubmissionResult {
  const [pendingRequests, setPendingRequests] = useState<OptimisticRequest[]>(
    [],
  );
  const [refreshingLocationId, setRefreshingLocationId] = useState<
    string | null
  >(null);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [reconciliationWarning, setReconciliationWarning] = useState(false);

  async function submit(values: TimeOffRequestFormValues): Promise<void> {
    const requestId = `optimistic-${Date.now()}`;
    const locationId = values.locationId;
    const displayLocation =
      balances.find((b) => b.locationId === locationId)?.location ?? locationId;

    setPendingRequests((prev) => [
      ...prev,
      {
        id: requestId,
        location: displayLocation,
        requestedDays: values.daysRequested,
        startDate: values.startDate,
        endDate: values.endDate,
        status: "pending",
      },
    ]);
    setRefreshingLocationId(locationId);
    setSubmissionError(null);

    try {
      const data = (await submitTimeOffRequest({
        employeeId: EMPLOYEE_ID,
        locationId,
        startDate: values.startDate,
        endDate: values.endDate,
        daysRequested: values.daysRequested,
        notes: values.notes,
      })) as SubmitResponseData;

      if (data?.balance?.id) {
        try {
          await getBalance(data.balance.id);
        } catch {
          // ignored — balance will refresh on next poll
        }
      }

      if (data?.reconciliationHint === "silent-wrong-balance-not-reserved") {
        setReconciliationWarning(true);
      }

      setRefreshingLocationId(null);
    } catch (err) {
      setPendingRequests((prev) => prev.filter((r) => r.id !== requestId));
      setSubmissionError((err as Error).message);
      setRefreshingLocationId(null);
    }
  }

  return {
    pendingRequests,
    refreshingLocationId,
    submissionError,
    reconciliationWarning,
    submit,
  };
}
