import { timeOffBalances } from "../../data/balances";
import { HcmErrorCode } from "../../enums/hcm-error-code";
import type { HcmErrorResponse } from "../../types/hcm-error-response";
import type { HcmSuccessResponse } from "../../types/hcm-success-response";
import type { TimeOffBalance } from "../../types/time-off-balance";

type AnniversaryBonusBody = {
  balanceId?: string;
  bonusDays?: number;
};

type AnniversaryBonusResponseData = {
  balance: TimeOffBalance;
};

const DEFAULT_BONUS_DAYS = 5;

export async function POST(request: Request) {
  const body = (await request.json()) as AnniversaryBonusBody;
  const bonusDays = body.bonusDays ?? DEFAULT_BONUS_DAYS;

  let balance;

  if (body.balanceId !== undefined) {
    balance = timeOffBalances.find((b) => b.id === body.balanceId);

    if (!balance) {
      const error: HcmErrorResponse = {
        error: { code: HcmErrorCode.NotFound, message: "Balance was not found" },
      };
      return Response.json(error, { status: 404 });
    }
  } else {
    balance = timeOffBalances[0];
  }

  balance.availableDays += bonusDays;
  balance.version += 1;
  balance.lastSyncedAt = new Date().toISOString();

  const response: HcmSuccessResponse<AnniversaryBonusResponseData> = {
    data: { balance: { ...balance } },
  };

  return Response.json(response);
}
