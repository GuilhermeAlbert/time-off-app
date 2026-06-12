// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { BalanceList } from "./index";

const mockHcmBalances = [
  {
    id: "b1",
    locationId: "new-york",
    availableDays: 18,
    pendingDays: 0,
    syncStatus: "fresh",
    employeeId: "emp-1",
    version: 1,
    lastSyncedAt: "2026-06-12T12:00:00.000Z",
  },
];

function mockFetch(data: unknown, status = 200) {
  const ok = status >= 200 && status < 300;
  return vi.fn().mockResolvedValue({
    ok,
    status,
    json: () =>
      Promise.resolve(
        ok ? { data } : { error: { code: "ERR", message: "fetch failed" } },
      ),
  });
}

describe("BalanceList", () => {
  afterEach(() => {
    cleanup();
    vi.unstubAllGlobals();
  });

  it("shows loading state before data arrives", () => {
    vi.stubGlobal("fetch", vi.fn().mockReturnValue(new Promise(() => {})));
    render(<BalanceList />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it("renders balances after successful API response", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({
        balances: mockHcmBalances,
        lastSyncedAt: "2026-06-12T12:00:00.000Z",
        source: "hcm",
      }),
    );
    render(<BalanceList />);
    await waitFor(() => {
      expect(screen.getByText("New York")).toBeInTheDocument();
    });
  });

  it("shows empty state when API returns no balances", async () => {
    vi.stubGlobal(
      "fetch",
      mockFetch({ balances: [], lastSyncedAt: "", source: "hcm" }),
    );
    render(<BalanceList />);
    await waitFor(() => {
      expect(screen.getByText(/no balances/i)).toBeInTheDocument();
    });
  });

  it("shows error state when API fails", async () => {
    vi.stubGlobal("fetch", mockFetch(null, 500));
    render(<BalanceList />);
    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });
});
