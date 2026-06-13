import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { describe, expect, it } from "vitest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const doc = readFileSync(join(__dirname, "coverage-proof.md"), "utf-8");

const REQUIRED_SECTIONS = [
  "Commands",
  "API Behavior Tests",
  "Unit Tests",
  "Component Tests",
  "Integration Tests",
  "Storybook Stories",
  "Storybook Interaction Tests",
  "Known Gaps",
];

describe("docs/coverage-proof.md", () => {
  REQUIRED_SECTIONS.forEach((section) => {
    it(`has "${section}" section`, () => {
      expect(doc).toContain(section);
    });
  });
});
