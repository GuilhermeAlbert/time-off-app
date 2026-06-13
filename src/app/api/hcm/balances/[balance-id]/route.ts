import { timeOffBalances } from "../../data/balances";
import { HcmErrorCode } from "../../enums/hcm-error-code";
import type { HcmErrorResponse } from "../../types/hcm-error-response";
import type { HcmSuccessResponse } from "../../types/hcm-success-response";
import type { TimeOffBalance } from "../../types/time-off-balance";

type SingleBalanceResponseData = {
  balance: TimeOffBalance;
  lastSyncedAt: string;
  source: "hcm";
};

type RouteContext = {
  params: Promise<{ "balance-id": string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { "balance-id": balanceId } = await context.params;
  const balance = timeOffBalances.find((b) => b.id === balanceId);

  if (!balance) {
    const error: HcmErrorResponse = {
      error: { code: HcmErrorCode.NotFound, message: "Balance was not found" },
    };
    return Response.json(error, { status: 404 });
  }

  const response: HcmSuccessResponse<SingleBalanceResponseData> = {
    data: {
      balance: { ...balance },
      lastSyncedAt: balance.lastSyncedAt,
      source: "hcm",
    },
  };

  return Response.json(response);
}
