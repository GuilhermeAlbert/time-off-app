import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { describe, expect, it } from "vitest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const trd = readFileSync(join(__dirname, "trd.md"), "utf-8");

const REQUIRED_SECTIONS = [
  "Problem Summary",
  "Product Constraints",
  "User Personas",
  "Architecture Overview",
  "API Design",
  "UI State Model",
  "Data Fetching Strategy",
  "Optimistic vs Pessimistic Strategy",
  "Cache Invalidation Strategy",
  "Reconciliation Strategy",
  "Background Refresh Strategy",
  "Component Tree",
  "State Ownership",
  "Testing Strategy",
  "Storybook Strategy",
  "Alternatives Considered",
  "Tradeoffs",
  "Known Limitations",
  "Future Improvements",
];

describe("docs/trd.md", () => {
  REQUIRED_SECTIONS.forEach((section) => {
    it(`has "${section}" section`, () => {
      expect(trd).toContain(section);
    });
  });
});
