import { beforeEach, describe, expect, it } from "vitest";

import { timeOffBalances } from "../data/balances";
import { timeOffRequests } from "../data/requests";
import { HcmErrorCode } from "../enums/hcm-error-code";
import { ManagerDecision } from "../enums/manager-decision";
import { HcmSimulationMode } from "../enums/hcm-simulation-mode";
import { RequestStatus } from "../enums/request-status";
import { resetHcmData } from "../helpers/reset-hcm-data";
import { GET, POST } from "./route";
import { POST as postDecision } from "./[request-id]/decision/route";

function createRequest(body: Record<string, unknown>) {
  return new Request("http://localhost/api/hcm/requests", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
    },
  });
}

function validRequestBody(overrides: Record<string, unknown> = {}) {
  return {
    employeeId: "employee-example-001",
    locationId: "new-york",
    startDate: "2026-07-01",
    endDate: "2026-07-03",
    daysRequested: 3,
    notes: "Family trip",
    ...overrides,
  };
}

describe("POST /api/hcm/requests", () => {
  beforeEach(() => {
    resetHcmData();
  });

  it("creates a pending request for valid input", async () => {
    const response = await POST(createRequest(validRequestBody()));
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.data.request).toMatchObject({
      employeeId: "employee-example-001",
      locationId: "new-york",
      status: RequestStatus.Pending,
      requestedDays: 3,
      startDate: "2026-07-01",
      endDate: "2026-07-03",
      note: "Family trip",
    });
    expect(body.data.request.status).not.toBe(RequestStatus.Confirmed);
    expect(body.data.balance).toMatchObject({
      locationId: "new-york",
      availableDays: 15,
      pendingDays: 3,
      version: 2,
    });
    expect(timeOffRequests).toHaveLength(1);
    expect(timeOffBalances[0]).toMatchObject({
      availableDays: 15,
      pendingDays: 3,
      version: 2,
    });
  });

  it("rejects an invalid employee", async () => {
    const response = await POST(
      createRequest(validRequestBody({ employeeId: "unknown-employee" })),
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toEqual({
      code: HcmErrorCode.ValidationError,
      message: "Employee was not found",
    });
    expect(timeOffRequests).toEqual([]);
  });

  it("rejects an invalid location", async () => {
    const response = await POST(
      createRequest(validRequestBody({ locationId: "unknown-location" })),
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toEqual({
      code: HcmErrorCode.ValidationError,
      message: "Location was not found",
    });
    expect(timeOffRequests).toEqual([]);
  });

  it("rejects insufficient balance", async () => {
    const response = await POST(
      createRequest(validRequestBody({ daysRequested: 99 })),
    );
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body.error).toEqual({
      code: HcmErrorCode.InsufficientBalance,
      message: "Requested days exceed available balance",
    });
    expect(timeOffRequests).toEqual([]);
    expect(timeOffBalances[0]).toMatchObject({
      availableDays: 18,
      pendingDays: 0,
      version: 1,
    });
  });

  it("returns conflict for conflict simulation", async () => {
    const response = await POST(
      createRequest(
        validRequestBody({ simulationMode: HcmSimulationMode.Conflict }),
      ),
    );
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body.error).toEqual({
      code: HcmErrorCode.Conflict,
      message: "HCM balance changed before request submission",
    });
    expect(timeOffRequests).toEqual([]);
  });

  it("returns silent-wrong success with inconsistent state", async () => {
    const response = await POST(
      createRequest(
        validRequestBody({ simulationMode: HcmSimulationMode.SilentWrong }),
      ),
    );
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.data.request.status).toBe(RequestStatus.Pending);
    expect(body.data.reconciliationHint).toBe(
      "silent-wrong-balance-not-reserved",
    );
    expect(timeOffRequests).toHaveLength(1);
    expect(timeOffBalances[0]).toMatchObject({
      availableDays: 18,
      pendingDays: 0,
      version: 1,
    });
  });

  it("handles slow simulation deterministically", async () => {
    const response = await POST(
      createRequest(validRequestBody({ simulationMode: HcmSimulationMode.Slow })),
    );
    const body = await response.json();

    expect(response.status).toBe(201);
    expect(body.data.request).toMatchObject({
      id: "request-1",
      status: RequestStatus.Pending,
      createdAt: "2026-06-12T12:05:00.000Z",
    });
  });
});

describe("GET /api/hcm/requests", () => {
  beforeEach(() => {
    resetHcmData();
  });

  it("returns empty list when no pending requests exist", async () => {
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data.requests).toEqual([]);
  });

  it("returns only pending requests", async () => {
    await POST(createRequest(validRequestBody()));

    const response = await GET();
    const body = await response.json();

    expect(body.data.requests).toHaveLength(1);
    expect(body.data.requests[0].status).toBe(RequestStatus.Pending);
  });

  it("returns only pending requests after a deny decision — decided request is excluded", async () => {
    await POST(createRequest(validRequestBody()));
    const requestId = timeOffRequests[0].id;

    await postDecision(
      new Request(`http://localhost/api/hcm/requests/${requestId}/decision`, {
        method: "POST",
        body: JSON.stringify({ decision: ManagerDecision.Deny }),
        headers: { "content-type": "application/json" },
      }),
      { params: Promise.resolve({ "request-id": requestId }) },
    );

    const response = await GET();
    const body = await response.json();

    expect(body.data.requests).toHaveLength(0);
  });
});
