import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getBalance,
  getBalances,
  submitTimeOffRequest,
  triggerAnniversaryBonus,
} from "./time-off-service";

function mockFetch(data: unknown, status = 200) {
  const ok = status >= 200 && status < 300;
  return vi.fn().mockResolvedValue({
    ok,
    status,
    json: () =>
      Promise.resolve(
        ok ? { data } : { error: { code: "ERR", message: "request failed" } },
      ),
  });
}

describe("time-off-service", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("getBalances calls /api/hcm/balances", async () => {
    const fetch = mockFetch({ balances: [], lastSyncedAt: "", source: "hcm" });
    vi.stubGlobal("fetch", fetch);

    await getBalances();

    expect(fetch.mock.calls[0][0]).toBe("/api/hcm/balances");
  });

  it("getBalance calls /api/hcm/balances/[balanceId]", async () => {
    const fetch = mockFetch({});
    vi.stubGlobal("fetch", fetch);

    await getBalance("balance-123");

    expect(fetch.mock.calls[0][0]).toBe("/api/hcm/balances/balance-123");
  });

  it("submitTimeOffRequest posts to /api/hcm/requests", async () => {
    const fetch = mockFetch({}, 201);
    vi.stubGlobal("fetch", fetch);

    await submitTimeOffRequest({
      employeeId: "emp-1",
      locationId: "new-york",
      startDate: "2026-07-01",
      endDate: "2026-07-03",
      daysRequested: 3,
    });

    expect(fetch.mock.calls[0][0]).toBe("/api/hcm/requests");
    expect(fetch.mock.calls[0][1]).toMatchObject({ method: "POST" });
  });

  it("triggerAnniversaryBonus posts to anniversary endpoint", async () => {
    const fetch = mockFetch({});
    vi.stubGlobal("fetch", fetch);

    await triggerAnniversaryBonus();

    expect(fetch.mock.calls[0][0]).toBe(
      "/api/hcm/balances/anniversary-bonus",
    );
    expect(fetch.mock.calls[0][1]).toMatchObject({ method: "POST" });
  });

  it("throws on non-2xx response", async () => {
    vi.stubGlobal("fetch", mockFetch(null, 409));

    await expect(getBalances()).rejects.toThrow("request failed");
  });
});
