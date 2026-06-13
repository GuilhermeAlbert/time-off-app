import { describe, expect, it } from "vitest";

import * as stories from "./index.stories";

describe("BalanceCard stories — required exports", () => {
  it("has Fresh story", () => expect(stories.Fresh).toBeDefined());
  it("has Refreshing story", () => expect(stories.Refreshing).toBeDefined());
  it("has Stale story", () => expect(stories.Stale).toBeDefined());
  it("has BalanceRefreshed story", () =>
    expect(stories.BalanceRefreshed).toBeDefined());
});
