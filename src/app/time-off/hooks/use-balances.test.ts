// @vitest-environment jsdom
import { renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SyncStatus } from "../enums/sync-status";
import { useBalances } from "./use-balances";

function makeFetchWithStatus(syncStatus: string) {
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
              availableDays: 18,
              pendingDays: 0,
              syncStatus,
            },
          ],
          lastSyncedAt: "2026-06-12T12:00:00.000Z",
          source: "hcm",
        },
      }),
  });
}

describe("useBalances — SyncStatus mapping", () => {
  afterEach(() => vi.unstubAllGlobals());

  it("maps known sync status fresh correctly", async () => {
    vi.stubGlobal("fetch", makeFetchWithStatus("fresh"));
    const { result } = renderHook(() => useBalances());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.balances[0].syncStatus).toBe(SyncStatus.Fresh);
  });

  it("maps unknown HCM sync status to Stale", async () => {
    vi.stubGlobal("fetch", makeFetchWithStatus("changed-mid-session"));
    const { result } = renderHook(() => useBalances());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.balances[0].syncStatus).toBe(SyncStatus.Stale);
  });

  it("maps reconciliation-needed to Stale", async () => {
    vi.stubGlobal("fetch", makeFetchWithStatus("reconciliation-needed"));
    const { result } = renderHook(() => useBalances());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.balances[0].syncStatus).toBe(SyncStatus.Stale);
  });
});
