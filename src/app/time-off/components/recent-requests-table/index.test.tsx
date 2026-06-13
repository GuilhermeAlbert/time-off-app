import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { RequestStatus } from "../../enums/request-status";
import type { TimeOffRequest } from "../../types/time-off-request";
import { RecentRequestsTable } from "./index";

const pending: TimeOffRequest = {
  id: "r-1",
  startDate: "2026-07-01",
  location: "New York",
  requestedDays: 3,
  status: RequestStatus.Pending,
};

const confirmed: TimeOffRequest = {
  id: "r-2",
  startDate: "2026-07-10",
  location: "London",
  requestedDays: 2,
  status: RequestStatus.Confirmed,
};

const rejected: TimeOffRequest = {
  id: "r-3",
  startDate: "2026-07-15",
  location: "Remote",
  requestedDays: 5,
  status: RequestStatus.Rejected,
};

const needsReconciliation: TimeOffRequest = {
  id: "r-4",
  startDate: "2026-08-01",
  location: "New York",
  requestedDays: 1,
  status: RequestStatus.NeedsReconciliation,
};

describe("RecentRequestsTable", () => {
  it("renders empty state when no requests", () => {
    const html = renderToStaticMarkup(<RecentRequestsTable requests={[]} />);
    expect(html).toContain("No recent requests");
  });

  it("renders table column headers", () => {
    const html = renderToStaticMarkup(
      <RecentRequestsTable requests={[pending]} />,
    );
    expect(html).toContain("Date");
    expect(html).toContain("Location");
    expect(html).toContain("Days");
    expect(html).toContain("Status");
  });

  it("renders a pending request", () => {
    const html = renderToStaticMarkup(
      <RecentRequestsTable requests={[pending]} />,
    );
    expect(html).toContain("2026-07-01");
    expect(html).toContain("New York");
    expect(html).toContain("3");
    expect(html).toContain("Pending");
  });

  it("renders a confirmed request", () => {
    const html = renderToStaticMarkup(
      <RecentRequestsTable requests={[confirmed]} />,
    );
    expect(html).toContain("Confirmed");
  });

  it("renders a rejected request", () => {
    const html = renderToStaticMarkup(
      <RecentRequestsTable requests={[rejected]} />,
    );
    expect(html).toContain("Rejected");
  });

  it("renders a needs-reconciliation request", () => {
    const html = renderToStaticMarkup(
      <RecentRequestsTable requests={[needsReconciliation]} />,
    );
    expect(html).toContain("Needs Reconciliation");
  });
});
