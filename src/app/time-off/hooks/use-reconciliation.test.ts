// @vitest-environment jsdom
import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SyncStatus } from "../enums/sync-status";
import type { TimeOffBalance } from "../types/time-off-balance";
import { useReconciliation } from "./use-reconciliation";

const INTERVAL_MS = 100;

const currentBalance: TimeOffBalance = {
  id: "bal-1",
  locationId: "new-york",
  location: "New York",
  availableDays: 18,
  pendingDays: 0,
  syncStatus: SyncStatus.Fresh,
};

function makeFetch(availableDays: number, pendingDays = 0) {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: () =>
      Promise.resolve({
        data: {
          balances: [
            {
              id: "bal-1",
              locationId: "new-york",
              availableDays,
              pendingDays,
              syncStatus: "fresh",
            },
          ],
        },
      }),
  });
}

describe("useReconciliation", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("fetches latest batch balances on interval", async () => {
    const fetchSpy = makeFetch(18);
    vi.stubGlobal("fetch", fetchSpy);

    renderHook(() => useReconciliation([currentBalance], false, INTERVAL_MS));

    await act(async () => {
      await vi.advanceTimersByTimeAsync(INTERVAL_MS + 10);
    });

    expect(fetchSpy).toHaveBeenCalled();
  });

  it("detects changed balance and marks it stale", async () => {
    vi.stubGlobal("fetch", makeFetch(20)); // 20 differs from current 18

    const { result } = renderHook(() =>
      useReconciliation([currentBalance], false, INTERVAL_MS),
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(INTERVAL_MS + 10);
    });

    expect(result.current.staleBalanceIds).toContain("bal-1");
  });

  it("shows non-blocking balance refreshed notice when change detected", async () => {
    vi.stubGlobal("fetch", makeFetch(20));

    const { result } = renderHook(() =>
      useReconciliation([currentBalance], false, INTERVAL_MS),
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(INTERVAL_MS + 10);
    });

    expect(result.current.balanceRefreshed).toBe(true);
  });

  it("does not mark stale when balance is unchanged", async () => {
    vi.stubGlobal("fetch", makeFetch(18)); // same as current

    const { result } = renderHook(() =>
      useReconciliation([currentBalance], false, INTERVAL_MS),
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(INTERVAL_MS + 10);
    });

    expect(result.current.staleBalanceIds).toHaveLength(0);
    expect(result.current.balanceRefreshed).toBe(false);
  });

  it("does not disrupt active submission — stale state deferred", async () => {
    vi.stubGlobal("fetch", makeFetch(20));

    const { result } = renderHook(() =>
      useReconciliation([currentBalance], true, INTERVAL_MS), // isSubmitting = true
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(INTERVAL_MS + 10);
    });

    expect(result.current.staleBalanceIds).toHaveLength(0);
  });

  it("applies deferred changes after submission completes", async () => {
    vi.stubGlobal("fetch", makeFetch(20));

    let isSubmitting = true;
    const { result, rerender } = renderHook(() =>
      useReconciliation([currentBalance], isSubmitting, INTERVAL_MS),
    );

    // Advance while submitting — change detected but deferred
    await act(async () => {
      await vi.advanceTimersByTimeAsync(INTERVAL_MS + 10);
    });

    expect(result.current.staleBalanceIds).toHaveLength(0);

    // Submission completes
    isSubmitting = false;
    await act(async () => {
      rerender();
    });

    expect(result.current.staleBalanceIds).toContain("bal-1");
  });
});
