import { initialTimeOffBalances, timeOffBalances } from "../data/balances";
import { initialTimeOffRequests, timeOffRequests } from "../data/requests";

export function resetHcmData() {
  timeOffBalances.splice(
    0,
    timeOffBalances.length,
    ...initialTimeOffBalances.map((balance) => ({ ...balance })),
  );

  timeOffRequests.splice(
    0,
    timeOffRequests.length,
    ...initialTimeOffRequests.map((request) => ({ ...request })),
  );
}
