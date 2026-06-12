import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { SyncStatus } from "../../enums/sync-status";
import { SyncStatusBadge } from "./index";

describe("SyncStatusBadge", () => {
  it("renders Fresh", () => {
    const html = renderToStaticMarkup(
      <SyncStatusBadge status={SyncStatus.Fresh} />,
    );
    expect(html).toContain("Fresh");
  });

  it("renders Refreshing", () => {
    const html = renderToStaticMarkup(
      <SyncStatusBadge status={SyncStatus.Refreshing} />,
    );
    expect(html).toContain("Refreshing");
  });

  it("renders Stale", () => {
    const html = renderToStaticMarkup(
      <SyncStatusBadge status={SyncStatus.Stale} />,
    );
    expect(html).toContain("Stale");
  });
});
