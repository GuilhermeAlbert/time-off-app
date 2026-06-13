import { beforeEach, describe, expect, it } from "vitest";

import { timeOffBalances } from "../../data/balances";
import { timeOffRequests } from "../../data/requests";
import { HcmErrorCode } from "../../enums/hcm-error-code";
import { resetHcmData } from "../../helpers/reset-hcm-data";
import { POST } from "./route";

function createRequest(body: Record<string, unknown>) {
  return new Request(
    "http://localhost/api/hcm/simulations/anniversary-bonus",
    {
      method: "POST",
      body: JSON.stringify(body),
      headers: { "content-type": "application/json" },
    },
  );
}

describe("POST /api/hcm/simulations/anniversary-bonus", () => {
  beforeEach(() => {
    resetHcmData();
  });

  it("adds bonus days to the specified balance", async () => {
    const response = await POST(
      createRequest({
        balanceId: "balance-new-york-employee-example-001",
        bonusDays: 5,
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.balance.availableDays).toBe(23);
    expect(timeOffBalances[0].availableDays).toBe(23);
  });

  it("uses the first balance as default when no balanceId is provided", async () => {
    const response = await POST(createRequest({ bonusDays: 3 }));
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.balance.availableDays).toBe(21);
  });

  it("updates lastSyncedAt on the balance", async () => {
    const original = timeOffBalances[0].lastSyncedAt;

    await POST(
      createRequest({
        balanceId: "balance-new-york-employee-example-001",
        bonusDays: 5,
      }),
    );

    expect(timeOffBalances[0].lastSyncedAt).not.toBe(original);
  });

  it("does not create a time-off request", async () => {
    await POST(
      createRequest({
        balanceId: "balance-new-york-employee-example-001",
        bonusDays: 5,
      }),
    );

    expect(timeOffRequests).toHaveLength(0);
  });

  it("returns 404 for an unknown balance ID", async () => {
    const response = await POST(
      createRequest({ balanceId: "unknown-balance", bonusDays: 5 }),
    );
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error).toEqual({
      code: HcmErrorCode.NotFound,
      message: "Balance was not found",
    });
  });
});
