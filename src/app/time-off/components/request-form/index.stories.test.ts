import { describe, expect, it } from "vitest";

import * as stories from "./index.stories";

describe("RequestForm stories — required exports", () => {
  it("has Empty story", () => expect(stories.Empty).toBeDefined());
  it("has ValidationError story", () =>
    expect(stories.ValidationError).toBeDefined());
  it("has Submitting story", () => expect(stories.Submitting).toBeDefined());
  it("has OptimisticPending story", () =>
    expect(stories.OptimisticPending).toBeDefined());
  it("has HcmRejected story", () =>
    expect(stories.HcmRejected).toBeDefined());
  it("has HcmSilentlyWrong story", () =>
    expect(stories.HcmSilentlyWrong).toBeDefined());
  it("has OptimisticRolledBack story", () =>
    expect(stories.OptimisticRolledBack).toBeDefined());
});
