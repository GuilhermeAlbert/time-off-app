import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { describe, expect, it } from "vitest";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const doc = readFileSync(join(__dirname, "submission-checklist.md"), "utf-8");

const REQUIRED_ITEMS = [
  "App runs locally",
  "Storybook runs locally",
  "Tests run",
  "Lint passes",
  "Typecheck passes",
  "TRD exists",
  "Coverage proof exists",
  "Mock HCM endpoints work",
  "Employee flow works",
  "Manager flow works",
  "Reconciliation scenario works",
  "Silent-wrong scenario",
  "Conflict scenario",
  "README has setup instructions",
];

describe("docs/submission-checklist.md", () => {
  REQUIRED_ITEMS.forEach((item) => {
    it(`contains "${item}"`, () => {
      expect(doc).toContain(item);
    });
  });
});
