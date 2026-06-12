import { describe, expect, it } from "vitest";

import { timeOffBalances } from "../data/balances";
import { resetHcmData } from "../helpers/reset-hcm-data";
import { GET } from "./route";

describe("GET /api/hcm/balances", () => {
  it("returns all HCM balances with sync metadata", async () => {
    resetHcmData();

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.balances).toHaveLength(timeOffBalances.length);
    expect(
      body.data.balances.map((balance: { locationId: string }) => balance.locationId),
    ).toEqual(["new-york", "london", "remote"]);
    expect(body.data.lastSyncedAt).toBe("2026-06-12T12:00:00.000Z");
    expect(body.data.source).toBe("hcm");
  });
});
