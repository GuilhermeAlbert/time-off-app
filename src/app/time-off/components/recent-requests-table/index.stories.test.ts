import { describe, expect, it } from "vitest";

import * as stories from "./index.stories";

describe("RecentRequestsTable stories — required exports", () => {
  it("has Empty story", () => expect(stories.Empty).toBeDefined());
  it("has Pending story", () => expect(stories.Pending).toBeDefined());
  it("has Confirmed story", () => expect(stories.Confirmed).toBeDefined());
  it("has Rejected story", () => expect(stories.Rejected).toBeDefined());
  it("has NeedsReconciliation story", () =>
    expect(stories.NeedsReconciliation).toBeDefined());
  it("has MixedStatuses story", () =>
    expect(stories.MixedStatuses).toBeDefined());
});
