import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ManagerRequestsPage from "./page";

describe("ManagerRequestsPage", () => {
  it("renders manager review title", () => {
    const html = renderToStaticMarkup(<ManagerRequestsPage />);
    expect(html).toContain("Manager Review");
  });

  it("renders pending request", () => {
    const html = renderToStaticMarkup(<ManagerRequestsPage />);
    expect(html).toContain("2026-07-01");
  });
});
