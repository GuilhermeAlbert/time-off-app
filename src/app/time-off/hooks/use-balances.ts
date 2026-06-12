import { useEffect, useState } from "react";

import { getBalances } from "../services/time-off-service";
import type { SyncStatus } from "../enums/sync-status";
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

function toDisplayLocation(locationId: string): string {
  return locationId
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

type UseBalancesResult = {
  balances: TimeOffBalance[];
  isLoading: boolean;
  error: string | null;
};

export function useBalances(): UseBalancesResult {
  const [balances, setBalances] = useState<TimeOffBalance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getBalances()
      .then((data) => {
        const response = data as GetBalancesData;
        const mapped: TimeOffBalance[] = response.balances.map((b) => ({
          id: b.id,
          location: toDisplayLocation(b.locationId),
          availableDays: b.availableDays,
          pendingDays: b.pendingDays,
          syncStatus: b.syncStatus as SyncStatus,
        }));
        setBalances(mapped);
        setIsLoading(false);
      })
      .catch((err: Error) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  return { balances, isLoading, error };
}
