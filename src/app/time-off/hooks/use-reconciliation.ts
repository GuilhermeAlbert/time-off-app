import { useEffect, useRef, useState } from "react";

import { detectChangedBalanceIds } from "../helpers/compare-balances";
import { getBalances } from "../services/time-off-service";
import type { TimeOffBalance } from "../types/time-off-balance";

type HcmBalance = {
  id: string;
  locationId: string;
  availableDays: number;
  pendingDays: number;
  syncStatus: string;
};

type GetBalancesData = {
  balances: HcmBalance[];
};

const DEFAULT_INTERVAL_MS = 30_000;

export type UseReconciliationResult = {
  balanceRefreshed: boolean;
  staleBalanceIds: string[];
};

export function useReconciliation(
  currentBalances: TimeOffBalance[],
  isSubmitting: boolean,
  intervalMs = DEFAULT_INTERVAL_MS,
): UseReconciliationResult {
  const [staleBalanceIds, setStaleBalanceIds] = useState<string[]>([]);
  const [balanceRefreshed, setBalanceRefreshed] = useState(false);
  const pendingChangedIdsRef = useRef<string[]>([]);
  const isSubmittingRef = useRef(isSubmitting);

  useEffect(() => {
    isSubmittingRef.current = isSubmitting;
  }, [isSubmitting]);

  // Apply deferred changes when submission completes
  useEffect(() => {
    if (!isSubmitting && pendingChangedIdsRef.current.length > 0) {
      setStaleBalanceIds(pendingChangedIdsRef.current);
      setBalanceRefreshed(true);
      pendingChangedIdsRef.current = [];
    }
  }, [isSubmitting]);

  useEffect(() => {
    const reconcile = async () => {
      try {
        const data = (await getBalances()) as GetBalancesData;
        const changedIds = detectChangedBalanceIds(currentBalances, data.balances);

        if (changedIds.length === 0) return;

        if (isSubmittingRef.current) {
          pendingChangedIdsRef.current = changedIds;
        } else {
          setStaleBalanceIds(changedIds);
          setBalanceRefreshed(true);
        }
      } catch {
        // background reconciliation failures are silent
      }
    };

    const id = setInterval(() => {
      void reconcile();
    }, intervalMs);

    return () => clearInterval(id);
  }, [currentBalances, intervalMs]);

  return { balanceRefreshed, staleBalanceIds };
}
