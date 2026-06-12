import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import TimeOffPage from "./page";

describe("TimeOffPage", () => {
  it("renders the employee time-off shell without auth UI", () => {
    const html = renderToStaticMarkup(<TimeOffPage />);

    expect(html).toContain("ExampleHR");
    expect(html).toContain("Time Off");
    expect(html).toContain("Request time off and track balance changes.");
    expect(html).toContain("Balance cards");
    expect(html).toContain("Request form");
    expect(html).toContain("Recent requests table");
    expect(html.toLowerCase()).not.toContain("avatar");
    expect(html.toLowerCase()).not.toContain("notifications");
    expect(html.toLowerCase()).not.toContain("profile");
  });
});
