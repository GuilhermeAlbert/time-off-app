import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import TimeOffPage from "./page";

describe("root TimeOffPage route", () => {
  it("renders the same employee time-off shell served by Next", () => {
    const html = renderToStaticMarkup(<TimeOffPage />);

    expect(html).toContain("ExampleHR");
    expect(html).toContain("Time Off");
    expect(html).toContain("Request time off and track balance changes.");
  });
});
