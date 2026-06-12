import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SyncStatus } from "../../enums/sync-status";
import { BalanceCard } from "./index";

describe("BalanceCard", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

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

  it("does not call fetch directly", () => {
    const fetchSpy = vi.fn();
    vi.stubGlobal("fetch", fetchSpy);
    renderToStaticMarkup(<BalanceCard balance={balance} />);
    expect(fetchSpy).not.toHaveBeenCalled();
  });
});
