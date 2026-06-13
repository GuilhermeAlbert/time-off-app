import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ManagerRequestList } from "./index";

const sampleRequest = {
  id: "req-001",
  employeeName: "Jane Doe",
  location: "London",
  requestedDays: 4,
  startDate: "2026-08-01",
  endDate: "2026-08-05",
  availableBalance: 12,
  pendingBalance: 0,
};

describe("ManagerRequestList", () => {
  it("renders empty state when no requests", () => {
    const html = renderToStaticMarkup(<ManagerRequestList requests={[]} />);
    expect(html).toContain("No pending requests");
  });

  it("renders employee name and location when requests are present", () => {
    const html = renderToStaticMarkup(
      <ManagerRequestList requests={[sampleRequest]} />,
    );
    expect(html).toContain("Jane Doe");
    expect(html).toContain("London");
    expect(html).toContain("Approve");
    expect(html).toContain("Deny");
  });
});
