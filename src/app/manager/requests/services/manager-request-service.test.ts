import { afterEach, describe, expect, it, vi } from "vitest";

import {
  approveRequest,
  denyRequest,
  getPendingRequests,
} from "./manager-request-service";

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

describe("manager-request-service", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("getPendingRequests calls /api/hcm/requests", async () => {
    const fetch = mockFetch({ requests: [] });
    vi.stubGlobal("fetch", fetch);

    await getPendingRequests();

    expect(fetch.mock.calls[0][0]).toBe("/api/hcm/requests");
  });

  it("approveRequest posts approval decision", async () => {
    const fetch = mockFetch({});
    vi.stubGlobal("fetch", fetch);

    await approveRequest("request-001");

    expect(fetch.mock.calls[0][0]).toBe(
      "/api/hcm/requests/request-001/decision",
    );
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toMatchObject({
      decision: "approve",
    });
  });

  it("denyRequest posts denial decision", async () => {
    const fetch = mockFetch({});
    vi.stubGlobal("fetch", fetch);

    await denyRequest("request-001");

    expect(fetch.mock.calls[0][0]).toBe(
      "/api/hcm/requests/request-001/decision",
    );
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toMatchObject({
      decision: "deny",
    });
  });

  it("throws on non-2xx response", async () => {
    vi.stubGlobal("fetch", mockFetch(null, 404));

    await expect(getPendingRequests()).rejects.toThrow("request failed");
  });
});
