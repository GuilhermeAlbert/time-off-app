import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ManagerRequestCard } from "./index";

describe("ManagerRequestCard", () => {
  const request = {
    id: "request-001",
    employeeName: "Alice Smith",
    location: "New York",
    requestedDays: 5,
    startDate: "2026-07-01",
    endDate: "2026-07-05",
    availableBalance: 18,
    pendingBalance: 2,
  };

  it("renders employee name", () => {
    const html = renderToStaticMarkup(<ManagerRequestCard request={request} />);
    expect(html).toContain("Alice Smith");
  });

  it("renders location", () => {
    const html = renderToStaticMarkup(<ManagerRequestCard request={request} />);
    expect(html).toContain("New York");
  });

  it("renders requested days", () => {
    const html = renderToStaticMarkup(<ManagerRequestCard request={request} />);
    expect(html).toContain("5");
  });

  it("renders balance context", () => {
    const html = renderToStaticMarkup(<ManagerRequestCard request={request} />);
    expect(html).toContain("18");
    expect(html).toContain("2");
  });

  it("renders approve button", () => {
    const html = renderToStaticMarkup(<ManagerRequestCard request={request} />);
    expect(html).toContain("Approve");
  });

  it("renders deny button", () => {
    const html = renderToStaticMarkup(<ManagerRequestCard request={request} />);
    expect(html).toContain("Deny");
  });
});
