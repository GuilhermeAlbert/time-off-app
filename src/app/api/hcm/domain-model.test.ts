import { describe, expect, it } from "vitest";

import { timeOffBalances } from "./data/balances";
import { locations } from "./data/locations";
import { timeOffRequests } from "./data/requests";
import { HcmErrorCode } from "./enums/hcm-error-code";
import { HcmSimulationMode } from "./enums/hcm-simulation-mode";
import { ManagerDecision } from "./enums/manager-decision";
import { RequestStatus } from "./enums/request-status";
import { SyncStatus } from "./enums/sync-status";
import { resetHcmData } from "./helpers/reset-hcm-data";

describe("mock HCM domain model", () => {
  it("starts with New York, London, and Remote balances", () => {
    resetHcmData();

    expect(locations.map((location) => location.name)).toEqual([
      "New York",
      "London",
      "Remote",
    ]);
    expect(
      timeOffBalances.map((balance) => ({
        locationId: balance.locationId,
        availableDays: balance.availableDays,
        pendingDays: balance.pendingDays,
      })),
    ).toEqual([
      { locationId: "new-york", availableDays: 18, pendingDays: 0 },
      { locationId: "london", availableDays: 12, pendingDays: 0 },
      { locationId: "remote", availableDays: 22, pendingDays: 0 },
    ]);
  });

  it("starts with no seeded requests", () => {
    resetHcmData();

    expect(timeOffRequests).toEqual([]);
  });

  it("resets mutable balances and requests to their initial state", () => {
    resetHcmData();

    timeOffBalances[0].availableDays = 1;
    timeOffRequests.push({
      id: "request-test",
      employeeId: "employee-example-001",
      balanceId: timeOffBalances[0].id,
      locationId: "new-york",
      status: RequestStatus.Pending,
      requestedDays: 2,
      startDate: "2026-07-01",
      endDate: "2026-07-02",
      version: 1,
      createdAt: "2026-06-12T12:00:00.000Z",
    });

    resetHcmData();

    expect(timeOffBalances[0].availableDays).toBe(18);
    expect(timeOffRequests).toEqual([]);
  });

  it("exposes stable enum values used by the API contracts", () => {
    expect(RequestStatus.Pending).toBe("pending");
    expect(RequestStatus.Confirmed).toBe("confirmed");
    expect(RequestStatus.Conflict).toBe("conflict");
    expect(SyncStatus.ReconciliationNeeded).toBe("reconciliation-needed");
    expect(HcmErrorCode.InsufficientBalance).toBe("insufficient-balance");
    expect(HcmSimulationMode.SilentWrong).toBe("silent-wrong");
    expect(ManagerDecision.Approve).toBe("approve");
    expect(ManagerDecision.Deny).toBe("deny");
  });
});
