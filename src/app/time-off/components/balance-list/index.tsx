import { balances } from "../../data/balances";
import { BalanceCard } from "../balance-card";

export function BalanceList() {
  return (
    <div>
      {balances.map((balance) => (
        <BalanceCard key={balance.id} balance={balance} />
      ))}
    </div>
  );
}
