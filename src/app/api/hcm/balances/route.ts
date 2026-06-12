import { timeOffBalances } from "../data/balances";
import type { HcmSuccessResponse } from "../types/hcm-success-response";
import type { TimeOffBalance } from "../types/time-off-balance";

type BatchBalancesResponseData = {
  balances: TimeOffBalance[];
  lastSyncedAt: string;
  source: "hcm";
};

export async function GET() {
  const lastSyncedAt = timeOffBalances.reduce(
    (latest, balance) =>
      balance.lastSyncedAt > latest ? balance.lastSyncedAt : latest,
    "",
  );

  const response: HcmSuccessResponse<BatchBalancesResponseData> = {
    data: {
      balances: timeOffBalances.map((balance) => ({ ...balance })),
      lastSyncedAt,
      source: "hcm",
    },
  };

  return Response.json(response);
}
