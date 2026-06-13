import { describe, expect, it } from "vitest";

import { SyncStatus } from "../enums/sync-status";
import type { TimeOffBalance } from "../types/time-off-balance";
import { detectChangedBalanceIds } from "./compare-balances";

const balance: TimeOffBalance = {
  id: "bal-1",
  locationId: "new-york",
  location: "New York",
  availableDays: 18,
  pendingDays: 0,
  syncStatus: SyncStatus.Fresh,
};

describe("detectChangedBalanceIds", () => {
  it("returns empty array when nothing changed", () => {
    const fresh = [{ id: "bal-1", availableDays: 18, pendingDays: 0 }];
    expect(detectChangedBalanceIds([balance], fresh)).toHaveLength(0);
  });

  it("detects changed available days", () => {
    const fresh = [{ id: "bal-1", availableDays: 20, pendingDays: 0 }];
    expect(detectChangedBalanceIds([balance], fresh)).toContain("bal-1");
  });

  it("detects changed pending days", () => {
    const fresh = [{ id: "bal-1", availableDays: 18, pendingDays: 3 }];
    expect(detectChangedBalanceIds([balance], fresh)).toContain("bal-1");
  });

  it("ignores balances not present in current", () => {
    const fresh = [{ id: "bal-99", availableDays: 5, pendingDays: 0 }];
    expect(detectChangedBalanceIds([balance], fresh)).toHaveLength(0);
  });
});
