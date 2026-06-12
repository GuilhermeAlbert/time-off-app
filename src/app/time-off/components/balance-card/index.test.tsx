import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { SyncStatus } from "../../enums/sync-status";
import { BalanceCard } from "./index";

describe("BalanceCard", () => {
  const balance = {
    id: "1",
    location: "New York",
    availableDays: 18,
    pendingDays: 3,
    syncStatus: SyncStatus.Fresh,
  };

  it("renders location", () => {
    const html = renderToStaticMarkup(<BalanceCard balance={balance} />);
    expect(html).toContain("New York");
  });

  it("renders available days", () => {
    const html = renderToStaticMarkup(<BalanceCard balance={balance} />);
    expect(html).toContain("18");
  });

  it("renders pending days", () => {
    const html = renderToStaticMarkup(<BalanceCard balance={balance} />);
    expect(html).toContain("3");
  });
});
