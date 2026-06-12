"use client";

import { useBalances } from "../../hooks/use-balances";
import { BalanceCard } from "../balance-card";

export function BalanceList() {
  const { balances, isLoading, error } = useBalances();

  if (isLoading) {
    return <p>Loading balances...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  if (balances.length === 0) {
    return <p>No balances available</p>;
  }

  return (
    <div>
      {balances.map((balance) => (
        <BalanceCard key={balance.id} balance={balance} />
      ))}
    </div>
  );
}
