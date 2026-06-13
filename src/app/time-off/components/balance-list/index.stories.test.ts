import { describe, expect, it } from "vitest";

import * as stories from "./index.stories";

describe("BalanceList stories — required exports", () => {
  it("has Loading story", () => expect(stories.Loading).toBeDefined());
  it("has Empty story", () => expect(stories.Empty).toBeDefined());
  it("has Fresh story", () => expect(stories.Fresh).toBeDefined());
  it("has Refreshing story", () => expect(stories.Refreshing).toBeDefined());
  it("has Stale story", () => expect(stories.Stale).toBeDefined());
  it("has BalanceRefreshed story", () =>
    expect(stories.BalanceRefreshed).toBeDefined());
  it("BalanceRefreshed story has a play function", () =>
    expect(stories.BalanceRefreshed.play).toBeTypeOf("function"));
  it("has ErrorState story", () => expect(stories.ErrorState).toBeDefined());
});
