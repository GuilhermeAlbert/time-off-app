import { beforeEach, describe, expect, it } from "vitest";

import { resetHcmData } from "../../helpers/reset-hcm-data";
import { HcmErrorCode } from "../../enums/hcm-error-code";
import { GET } from "./route";

function createContext(balanceId: string) {
  return {
    params: Promise.resolve({ "balance-id": balanceId }),
  };
}

describe("GET /api/hcm/balances/[balance-id]", () => {
  beforeEach(() => {
    resetHcmData();
  });

  it("returns 200 for a known balance", async () => {
    const response = await GET(
      new Request("http://localhost/api/hcm/balances/balance-new-york-employee-example-001"),
      createContext("balance-new-york-employee-example-001"),
    );

    expect(response.status).toBe(200);
  });

  it("response contains a single balance with correct fields", async () => {
    const response = await GET(
      new Request("http://localhost/api/hcm/balances/balance-new-york-employee-example-001"),
      createContext("balance-new-york-employee-example-001"),
    );
    const body = await response.json();

    expect(body.data.balance).toMatchObject({
      id: "balance-new-york-employee-example-001",
      locationId: "new-york",
      availableDays: 18,
    });
    expect(body.data.balance).not.toHaveProperty("balances");
  });

  it("response includes lastSyncedAt and source", async () => {
    const response = await GET(
      new Request("http://localhost/api/hcm/balances/balance-new-york-employee-example-001"),
      createContext("balance-new-york-employee-example-001"),
    );
    const body = await response.json();

    expect(body.data.lastSyncedAt).toBe("2026-06-12T12:00:00.000Z");
    expect(body.data.source).toBe("hcm");
  });

  it("returns 404 for an unknown balance", async () => {
    const response = await GET(
      new Request("http://localhost/api/hcm/balances/unknown-balance"),
      createContext("unknown-balance"),
    );
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error).toEqual({
      code: HcmErrorCode.NotFound,
      message: "Balance was not found",
    });
  });
});
