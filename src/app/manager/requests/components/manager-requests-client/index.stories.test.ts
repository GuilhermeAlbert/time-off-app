import { describe, expect, it } from "vitest";

import * as stories from "./index.stories";

describe("ManagerRequestsClient stories — required exports", () => {
  it("has NoPendingRequests story", () =>
    expect(stories.NoPendingRequests).toBeDefined());
  it("has PendingRequestWithValidBalance story", () =>
    expect(stories.PendingRequestWithValidBalance).toBeDefined());
  it("has Approving story", () => expect(stories.Approving).toBeDefined());
  it("has Denied story", () => expect(stories.Denied).toBeDefined());
  it("has Approved story", () => expect(stories.Approved).toBeDefined());
  it("has ConflictAtDecisionTime story", () =>
    expect(stories.ConflictAtDecisionTime).toBeDefined());
  it("has BalanceChangedBeforeApproval story", () =>
    expect(stories.BalanceChangedBeforeApproval).toBeDefined());
  it("has ErrorState story", () => expect(stories.ErrorState).toBeDefined());
});
