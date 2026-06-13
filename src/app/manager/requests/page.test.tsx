import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import ManagerRequestsPage from "./page";

describe("ManagerRequestsPage", () => {
  it("renders manager review title", () => {
    const html = renderToStaticMarkup(<ManagerRequestsPage />);
    expect(html).toContain("Manager Review");
  });

  it("renders manager workspace label", () => {
    const html = renderToStaticMarkup(<ManagerRequestsPage />);
    expect(html).toContain("Manager workspace");
  });

  it("renders loading state while requests are fetched", () => {
    const html = renderToStaticMarkup(<ManagerRequestsPage />);
    expect(html).toContain("Loading requests");
  });
});
