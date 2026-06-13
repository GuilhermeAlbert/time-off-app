"use client";

import { useBalances } from "../../hooks/use-balances";
import { BalanceCard } from "../balance-card";

export function BalanceList() {
  const { balances, isLoading, error } = useBalances();

  if (isLoading) {
    return (
      <div>
        <p className="sr-only">Loading balances...</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-28 animate-pulse rounded-xl border border-[#F6F0E9] bg-[#F6F0E9]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3">
        <p className="text-sm text-red-600">Error: {error}</p>
      </div>
    );
  }

  if (balances.length === 0) {
    return (
      <div className="rounded-xl border border-[#F6F0E9] bg-[#FEFBF5] px-6 py-10 text-center">
        <p className="text-sm font-medium text-zinc-700">
          No balances available
        </p>
        <p className="mt-1 text-xs text-zinc-400">
          Check back once your HR system has synced.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {balances.map((balance) => (
        <BalanceCard key={balance.id} balance={balance} />
      ))}
    </div>
  );
}
