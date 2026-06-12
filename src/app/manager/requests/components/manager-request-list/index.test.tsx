import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { ManagerRequestList } from "./index";

describe("ManagerRequestList", () => {
  it("renders empty state when no requests", () => {
    const html = renderToStaticMarkup(<ManagerRequestList requests={[]} />);
    expect(html).toContain("No pending requests");
  });
});
