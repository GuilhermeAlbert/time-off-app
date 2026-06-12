import { beforeEach, describe, expect, it } from "vitest";

import { timeOffBalances } from "../../../data/balances";
import { timeOffRequests } from "../../../data/requests";
import { HcmErrorCode } from "../../../enums/hcm-error-code";
import { ManagerDecision } from "../../../enums/manager-decision";
import { RequestStatus } from "../../../enums/request-status";
import { resetHcmData } from "../../../helpers/reset-hcm-data";
import { POST } from "./route";

function createDecisionRequest(body: Record<string, unknown>) {
  return new Request(
    "http://localhost/api/hcm/requests/request-1/decision",
    {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "content-type": "application/json",
      },
    },
  );
}

function createContext(requestId = "request-1") {
  return {
    params: Promise.resolve({
      "request-id": requestId,
    }),
  };
}

function seedPendingRequest() {
  timeOffRequests.push({
    id: "request-1",
    employeeId: "employee-example-001",
    balanceId: "balance-new-york-employee-example-001",
    locationId: "new-york",
    status: RequestStatus.Pending,
    requestedDays: 3,
    startDate: "2026-07-01",
    endDate: "2026-07-03",
    version: 1,
    createdAt: "2026-06-12T12:05:00.000Z",
  });
}

describe("POST /api/hcm/requests/[requestId]/decision", () => {
  beforeEach(() => {
    resetHcmData();
  });

  it("marks a denied request as rejected without mutating the balance", async () => {
    seedPendingRequest();
    const balanceBeforeDecision = { ...timeOffBalances[0] };

    const response = await POST(
      createDecisionRequest({ decision: ManagerDecision.Deny }),
      createContext(),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.request).toMatchObject({
      id: "request-1",
      status: RequestStatus.Rejected,
      decision: ManagerDecision.Deny,
      decidedAt: "2026-06-12T12:10:00.000Z",
    });
    expect(body.data.decidedAt).toBe("2026-06-12T12:10:00.000Z");
    expect(timeOffBalances[0]).toEqual(balanceBeforeDecision);
  });

  it("approves by deducting from the current authoritative balance", async () => {
    seedPendingRequest();
    timeOffBalances[0].availableDays = 10;

    const response = await POST(
      createDecisionRequest({ decision: ManagerDecision.Approve }),
      createContext(),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.request).toMatchObject({
      id: "request-1",
      status: RequestStatus.Confirmed,
      decision: ManagerDecision.Approve,
      version: 2,
      decidedAt: "2026-06-12T12:10:00.000Z",
    });
    expect(body.data.balance).toMatchObject({
      id: "balance-new-york-employee-example-001",
      availableDays: 7,
      version: 2,
      lastSyncedAt: "2026-06-12T12:10:00.000Z",
    });
    expect(timeOffBalances[0].availableDays).toBe(7);
  });

  it("rejects approval when authoritative balance is insufficient at decision time", async () => {
    seedPendingRequest();
    timeOffBalances[0].availableDays = 2;

    const response = await POST(
      createDecisionRequest({ decision: ManagerDecision.Approve }),
      createContext(),
    );
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body.error).toEqual({
      code: HcmErrorCode.InsufficientBalance,
      message: "Available balance is insufficient at decision time",
    });
    expect(timeOffRequests[0].status).toBe(RequestStatus.Pending);
    expect(timeOffBalances[0].availableDays).toBe(2);
  });

  it("returns conflict when request is already decided", async () => {
    seedPendingRequest();
    timeOffRequests[0].status = RequestStatus.Rejected;
    timeOffRequests[0].decision = ManagerDecision.Deny;

    const response = await POST(
      createDecisionRequest({ decision: ManagerDecision.Approve }),
      createContext(),
    );
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body.error).toEqual({
      code: HcmErrorCode.Conflict,
      message: "Request was already decided",
    });
  });

  it("returns not found for an unknown request", async () => {
    const response = await POST(
      createDecisionRequest({ decision: ManagerDecision.Deny }),
      createContext("unknown-request"),
    );
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.error).toEqual({
      code: HcmErrorCode.NotFound,
      message: "Request was not found",
    });
  });
});
