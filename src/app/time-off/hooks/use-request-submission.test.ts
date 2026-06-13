// @vitest-environment jsdom
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SyncStatus } from "../enums/sync-status";
import type { TimeOffBalance } from "../types/time-off-balance";
import { useRequestSubmission } from "./use-request-submission";

const mockBalances: TimeOffBalance[] = [
  {
    id: "balance-new-york",
    locationId: "new-york",
    location: "New York",
    availableDays: 18,
    pendingDays: 0,
    syncStatus: SyncStatus.Fresh,
  },
];

const validValues = {
  locationId: "new-york",
  startDate: "2026-07-01",
  endDate: "2026-07-03",
  daysRequested: 3,
};

function makeSuccessFetch(extra: Record<string, unknown> = {}) {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 201,
    json: () =>
      Promise.resolve({
        data: {
          request: { id: "req-1", status: "pending" },
          balance: { id: "balance-1" },
          ...extra,
        },
      }),
  });
}

function makeErrorFetch(message: string, status = 409) {
  return vi.fn().mockResolvedValue({
    ok: false,
    status,
    json: () =>
      Promise.resolve({ error: { code: "ERR", message } }),
  });
}

describe("useRequestSubmission", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("valid submission creates optimistic pending request", async () => {
    vi.stubGlobal("fetch", makeSuccessFetch());
    const { result } = renderHook(() => useRequestSubmission(mockBalances));

    await act(async () => {
      await result.current.submit(validValues);
    });

    expect(result.current.pendingRequests).toHaveLength(1);
    expect(result.current.pendingRequests[0].location).toBe("New York");
    expect(result.current.pendingRequests[0].requestedDays).toBe(3);
  });

  it("affected balance becomes refreshing during submission", async () => {
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise(() => {})));
    const { result } = renderHook(() => useRequestSubmission(mockBalances));

    act(() => {
      void result.current.submit(validValues);
    });

    await waitFor(() => {
      expect(result.current.refreshingLocationId).toBe("new-york");
    });
  });

  it("successful HCM response keeps request as pending, never approved", async () => {
    vi.stubGlobal("fetch", makeSuccessFetch());
    const { result } = renderHook(() => useRequestSubmission(mockBalances));

    await act(async () => {
      await result.current.submit(validValues);
    });

    expect(result.current.pendingRequests[0].status).toBe("pending");
    expect(result.current.pendingRequests[0].status).not.toBe("approved");
  });

  it("HCM rejection rolls back optimistic request", async () => {
    vi.stubGlobal(
      "fetch",
      makeErrorFetch("HCM balance changed before request submission"),
    );
    const { result } = renderHook(() => useRequestSubmission(mockBalances));

    await act(async () => {
      await result.current.submit(validValues);
    });

    expect(result.current.pendingRequests).toHaveLength(0);
    expect(result.current.submissionError).toBeTruthy();
  });

  it("insufficient balance shows clear error", async () => {
    vi.stubGlobal(
      "fetch",
      makeErrorFetch("Requested days exceed available balance"),
    );
    const { result } = renderHook(() => useRequestSubmission(mockBalances));

    await act(async () => {
      await result.current.submit(validValues);
    });

    expect(result.current.submissionError).toContain(
      "Requested days exceed available balance",
    );
    expect(result.current.pendingRequests).toHaveLength(0);
  });

  it("silent-wrong response shows reconciliation warning", async () => {
    vi.stubGlobal(
      "fetch",
      makeSuccessFetch({
        reconciliationHint: "silent-wrong-balance-not-reserved",
      }),
    );
    const { result } = renderHook(() => useRequestSubmission(mockBalances));

    await act(async () => {
      await result.current.submit(validValues);
    });

    expect(result.current.reconciliationWarning).toBe(true);
  });

  it("UI never shows approved immediately after employee submission", async () => {
    vi.stubGlobal("fetch", makeSuccessFetch());
    const { result } = renderHook(() => useRequestSubmission(mockBalances));

    await act(async () => {
      await result.current.submit(validValues);
    });

    const statuses = result.current.pendingRequests.map((r) => r.status);
    expect(statuses).not.toContain("approved");
    expect(statuses).not.toContain("confirmed");
  });
});
