import { timeOffBalances } from "../data/balances";
import { employees } from "../data/employees";
import { locations } from "../data/locations";
import { timeOffRequests } from "../data/requests";
import { HcmErrorCode } from "../enums/hcm-error-code";
import { HcmSimulationMode } from "../enums/hcm-simulation-mode";
import { RequestStatus } from "../enums/request-status";
import type { HcmErrorResponse } from "../types/hcm-error-response";
import type { HcmSuccessResponse } from "../types/hcm-success-response";
import type { TimeOffBalance } from "../types/time-off-balance";
import type { TimeOffRequest } from "../types/time-off-request";

type SubmitRequestBody = {
  employeeId: string;
  locationId: string;
  startDate: string;
  endDate: string;
  daysRequested: number;
  notes?: string;
  simulationMode?: HcmSimulationMode;
};

type SubmitRequestResponseData = {
  request: TimeOffRequest;
  balance: TimeOffBalance;
  reconciliationHint?: "silent-wrong-balance-not-reserved";
};

const submittedAt = "2026-06-12T12:05:00.000Z";

function errorResponse(
  code: HcmErrorCode,
  message: string,
  status: number,
) {
  const response: HcmErrorResponse = {
    error: {
      code,
      message,
    },
  };

  return Response.json(response, { status });
}

export async function POST(request: Request) {
  const body = (await request.json()) as SubmitRequestBody;
  const simulationMode = body.simulationMode ?? HcmSimulationMode.Normal;

  const employee = employees.find((item) => item.id === body.employeeId);

  if (!employee) {
    return errorResponse(
      HcmErrorCode.ValidationError,
      "Employee was not found",
      400,
    );
  }

  const location = locations.find((item) => item.id === body.locationId);

  if (!location) {
    return errorResponse(
      HcmErrorCode.ValidationError,
      "Location was not found",
      400,
    );
  }

  if (simulationMode === HcmSimulationMode.Conflict) {
    return errorResponse(
      HcmErrorCode.Conflict,
      "HCM balance changed before request submission",
      409,
    );
  }

  const balance = timeOffBalances.find(
    (item) =>
      item.employeeId === body.employeeId && item.locationId === body.locationId,
  );

  if (!balance) {
    throw new Error("Expected balance to exist for valid test input");
  }

  if (
    simulationMode === HcmSimulationMode.InsufficientBalance ||
    body.daysRequested > balance.availableDays
  ) {
    return errorResponse(
      HcmErrorCode.InsufficientBalance,
      "Requested days exceed available balance",
      409,
    );
  }

  if (simulationMode !== HcmSimulationMode.SilentWrong) {
    balance.availableDays -= body.daysRequested;
    balance.pendingDays += body.daysRequested;
    balance.version += 1;
    balance.lastSyncedAt = submittedAt;
  }

  const timeOffRequest: TimeOffRequest = {
    id: `request-${timeOffRequests.length + 1}`,
    employeeId: body.employeeId,
    balanceId: balance.id,
    locationId: body.locationId,
    status: RequestStatus.Pending,
    requestedDays: body.daysRequested,
    startDate: body.startDate,
    endDate: body.endDate,
    version: 1,
    note: body.notes,
    createdAt: submittedAt,
  };

  timeOffRequests.push(timeOffRequest);

  const response: HcmSuccessResponse<SubmitRequestResponseData> = {
    data: {
      request: { ...timeOffRequest },
      balance: { ...balance },
      reconciliationHint:
        simulationMode === HcmSimulationMode.SilentWrong
          ? "silent-wrong-balance-not-reserved"
          : undefined,
    },
  };

  return Response.json(response, { status: 201 });
}

export function GET() {
  const pending = timeOffRequests.filter(
    (r) => r.status === RequestStatus.Pending,
  );

  const response: HcmSuccessResponse<{ requests: TimeOffRequest[] }> = {
    data: { requests: pending.map((r) => ({ ...r })) },
  };

  return Response.json(response);
}
