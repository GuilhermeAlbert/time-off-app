import type { TimeOffBalance } from "../types/time-off-balance";

type FreshBalance = {
  id: string;
  availableDays: number;
  pendingDays: number;
};

export function detectChangedBalanceIds(
  current: TimeOffBalance[],
  fresh: FreshBalance[],
): string[] {
  return fresh
    .filter((f) => {
      const c = current.find((b) => b.id === f.id);
      return (
        c !== undefined &&
        (c.availableDays !== f.availableDays || c.pendingDays !== f.pendingDays)
      );
    })
    .map((f) => f.id);
}
