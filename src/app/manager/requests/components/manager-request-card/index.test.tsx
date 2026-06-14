// @vitest-environment jsdom
import "@testing-library/jest-dom/vitest";
import { cleanup, render, screen } from "@testing-library/react";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, describe, expect, it } from "vitest";

afterEach(cleanup);

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

  it("disables both buttons when decidingRequestId matches this card's request", () => {
    render(
      <ManagerRequestCard
        request={request}
        decidingRequestId={request.id}
      />,
    );
    expect(screen.getByRole("button", { name: /deny/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /approve/i })).toBeDisabled();
  });

  it("does not disable buttons when a different request is deciding", () => {
    render(
      <ManagerRequestCard
        request={request}
        decidingRequestId="some-other-request-id"
      />,
    );
    expect(screen.getByRole("button", { name: /deny/i })).not.toBeDisabled();
    expect(screen.getByRole("button", { name: /approve/i })).not.toBeDisabled();
  });
});
