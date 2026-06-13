// @vitest-environment jsdom
import { act, renderHook, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useManagerRequests } from "./use-manager-requests";

const sampleHcmRequest = {
  id: "request-1",
  employeeId: "emp-001",
  locationId: "new-york",
  balanceId: "bal-001",
  requestedDays: 3,
  startDate: "2026-07-01",
  endDate: "2026-07-03",
  status: "pending",
  version: 1,
  createdAt: "2026-06-12T12:05:00.000Z",
};

const sampleHcmBalance = {
  id: "bal-001",
  employeeId: "emp-001",
  locationId: "new-york",
  availableDays: 18,
  pendingDays: 3,
  version: 1,
  syncStatus: "fresh",
  lastSyncedAt: "2026-06-12T12:00:00.000Z",
};

type MockEntry = {
  data?: unknown;
  status?: number;
  errorMessage?: string;
};

function buildFetch(spec: Record<string, MockEntry>) {
  return vi.fn().mockImplementation((url: string) => {
    const key =
      Object.keys(spec).find((k) => url === k) ??
      Object.keys(spec)
        .sort((a, b) => b.length - a.length)
        .find((k) => (url as string).startsWith(k + "/"));
    const entry = key ? spec[key] : undefined;
    const status = entry?.status ?? 200;
    const ok = status >= 200 && status < 300;
    return Promise.resolve({
      ok,
      status,
      json: () =>
        Promise.resolve(
          ok
            ? { data: entry?.data ?? {} }
            : {
                error: {
                  code: "ERR",
                  message: entry?.errorMessage ?? "Request failed",
                },
              },
        ),
    });
  });
}

const defaultSpec: Record<string, MockEntry> = {
  "/api/hcm/requests": {
    data: { requests: [sampleHcmRequest] },
  },
  "/api/hcm/balances": {
    data: {
      balances: [sampleHcmBalance],
      lastSyncedAt: "2026-06-12T12:00:00.000Z",
      source: "hcm",
    },
  },
};

const decisionSuccessSpec: Record<string, MockEntry> = {
  ...defaultSpec,
  "/api/hcm/requests/request-1/decision": {
    data: { request: { status: "confirmed" }, decidedAt: "2026-06-12T12:10:00.000Z" },
  },
};

describe("useManagerRequests", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("loads pending requests from API on mount", async () => {
    vi.stubGlobal("fetch", buildFetch(defaultSpec));

    const { result } = renderHook(() => useManagerRequests());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.requests).toHaveLength(1);
    expect(result.current.requests[0].id).toBe("request-1");
  });

  it("enriches requests with balance context", async () => {
    vi.stubGlobal("fetch", buildFetch(defaultSpec));

    const { result } = renderHook(() => useManagerRequests());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.requests[0].availableBalance).toBe(18);
    expect(result.current.requests[0].pendingBalance).toBe(3);
  });

  it("deny removes the request from the list", async () => {
    vi.stubGlobal(
      "fetch",
      buildFetch({
        ...defaultSpec,
        "/api/hcm/requests/request-1/decision": {
          data: { request: { status: "rejected" }, decidedAt: "2026-06-12T12:10:00.000Z" },
        },
      }),
    );

    const { result } = renderHook(() => useManagerRequests());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.deny("request-1");
    });

    expect(result.current.requests).toHaveLength(0);
  });

  it("deny does not change balance context of remaining requests", async () => {
    const secondRequest = { ...sampleHcmRequest, id: "request-2", balanceId: "bal-002" };
    const secondBalance = {
      id: "bal-002",
      employeeId: "emp-001",
      locationId: "london",
      availableDays: 12,
      pendingDays: 1,
      version: 1,
      syncStatus: "fresh",
      lastSyncedAt: "2026-06-12T12:00:00.000Z",
    };

    vi.stubGlobal(
      "fetch",
      buildFetch({
        "/api/hcm/requests": {
          data: { requests: [sampleHcmRequest, secondRequest] },
        },
        "/api/hcm/balances": {
          data: {
            balances: [sampleHcmBalance, secondBalance],
            lastSyncedAt: "2026-06-12T12:00:00.000Z",
            source: "hcm",
          },
        },
        "/api/hcm/requests/request-1/decision": {
          data: { request: { status: "rejected" }, decidedAt: "2026-06-12T12:10:00.000Z" },
        },
      }),
    );

    const { result } = renderHook(() => useManagerRequests());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const balanceBefore = result.current.requests.find((r) => r.id === "request-2")
      ?.availableBalance;

    await act(async () => {
      await result.current.deny("request-1");
    });

    const balanceAfter = result.current.requests.find((r) => r.id === "request-2")
      ?.availableBalance;

    expect(balanceAfter).toBe(balanceBefore);
  });

  it("approve calls POST on the decision endpoint", async () => {
    const fetchMock = buildFetch(decisionSuccessSpec);
    vi.stubGlobal("fetch", fetchMock);

    const { result } = renderHook(() => useManagerRequests());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.approve("request-1");
    });

    const decisionCall = fetchMock.mock.calls.find(([url]) =>
      (url as string).includes("/decision"),
    );
    expect(decisionCall).toBeDefined();
    expect(JSON.parse(decisionCall![1].body as string)).toMatchObject({
      decision: "approve",
    });
  });

  it("approve removes the request from the list on success", async () => {
    vi.stubGlobal("fetch", buildFetch(decisionSuccessSpec));

    const { result } = renderHook(() => useManagerRequests());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.approve("request-1");
    });

    expect(result.current.requests).toHaveLength(0);
  });

  it("approve sets decisionError on balance conflict", async () => {
    vi.stubGlobal(
      "fetch",
      buildFetch({
        ...defaultSpec,
        "/api/hcm/requests/request-1/decision": {
          status: 409,
          errorMessage: "Available balance is insufficient at decision time",
        },
      }),
    );

    const { result } = renderHook(() => useManagerRequests());
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.approve("request-1");
    });

    expect(result.current.decisionError).toBe(
      "Available balance is insufficient at decision time",
    );
    expect(result.current.requests).toHaveLength(1);
  });

  it("sets error state when load fails", async () => {
    vi.stubGlobal(
      "fetch",
      buildFetch({
        "/api/hcm/requests": {
          status: 500,
          errorMessage: "Internal server error",
        },
        "/api/hcm/balances": {
          data: { balances: [], lastSyncedAt: "", source: "hcm" },
        },
      }),
    );

    const { result } = renderHook(() => useManagerRequests());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.error).toBe("Internal server error");
    expect(result.current.requests).toHaveLength(0);
  });
});
