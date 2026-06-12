import { timeOffBalances } from "../../../data/balances";
import { timeOffRequests } from "../../../data/requests";
import { HcmErrorCode } from "../../../enums/hcm-error-code";
import { ManagerDecision } from "../../../enums/manager-decision";
import { RequestStatus } from "../../../enums/request-status";
import type { HcmErrorResponse } from "../../../types/hcm-error-response";
import type { HcmSuccessResponse } from "../../../types/hcm-success-response";
import type { TimeOffBalance } from "../../../types/time-off-balance";
import type { TimeOffRequest } from "../../../types/time-off-request";

type DecisionRequestBody = {
  decision: ManagerDecision;
};

type DecisionRouteContext = {
  params: Promise<{
    "request-id": string;
  }>;
};

type DecisionResponseData = {
  request: TimeOffRequest;
  balance: TimeOffBalance;
  decidedAt: string;
};

const decidedAt = "2026-06-12T12:10:00.000Z";

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

export async function POST(
  request: Request,
  context: DecisionRouteContext,
) {
  const body = (await request.json()) as DecisionRequestBody;
  const { "request-id": requestId } = await context.params;
  const timeOffRequest = timeOffRequests.find((item) => item.id === requestId);

  if (!timeOffRequest) {
    return errorResponse(
      HcmErrorCode.NotFound,
      "Request was not found",
      404,
    );
  }

  const balance = timeOffBalances.find(
    (item) => item.id === timeOffRequest.balanceId,
  );

  if (!balance) {
    return errorResponse(
      HcmErrorCode.NotFound,
      "Balance was not found",
      404,
    );
  }

  if (timeOffRequest.status !== RequestStatus.Pending) {
    return errorResponse(
      HcmErrorCode.Conflict,
      "Request was already decided",
      409,
    );
  }

  if (body.decision === ManagerDecision.Deny) {
    timeOffRequest.status = RequestStatus.Rejected;
    timeOffRequest.decision = ManagerDecision.Deny;
    timeOffRequest.decidedAt = decidedAt;
    timeOffRequest.version += 1;
  }

  if (body.decision === ManagerDecision.Approve) {
    if (balance.availableDays < timeOffRequest.requestedDays) {
      return errorResponse(
        HcmErrorCode.InsufficientBalance,
        "Available balance is insufficient at decision time",
        409,
      );
    }

    timeOffRequest.status = RequestStatus.Confirmed;
    timeOffRequest.decision = ManagerDecision.Approve;
    timeOffRequest.decidedAt = decidedAt;
    timeOffRequest.version += 1;

    if (balance.pendingDays >= timeOffRequest.requestedDays) {
      balance.pendingDays -= timeOffRequest.requestedDays;
    } else {
      balance.availableDays -= timeOffRequest.requestedDays;
    }

    balance.version += 1;
    balance.lastSyncedAt = decidedAt;
  }

  const response: HcmSuccessResponse<DecisionResponseData> = {
    data: {
      request: { ...timeOffRequest },
      balance: { ...balance },
      decidedAt,
    },
  };

  return Response.json(response);
}
