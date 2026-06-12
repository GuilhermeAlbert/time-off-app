import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { BalanceList } from "./index";

describe("BalanceList", () => {
  it("renders New York, London, and Remote", () => {
    const html = renderToStaticMarkup(<BalanceList />);
    expect(html).toContain("New York");
    expect(html).toContain("London");
    expect(html).toContain("Remote");
  });
});
