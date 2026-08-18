// AC (issue #1): the lint rule blocking core from importing apps/, adapters/,
// next, or any SDK must be VERIFIED BY A FAILING FIXTURE — if the rule ever
// stops firing, this test fails, not just the promise.

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const run = promisify(execFile);
const repoRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..");

async function lint(target: string): Promise<{ errorCount: number; ruleIds: string[] }> {
  try {
    const { stdout } = await run("npx", ["eslint", "--no-ignore", "--format", "json", target], { cwd: repoRoot });
    const [report] = JSON.parse(stdout);
    return { errorCount: report.errorCount, ruleIds: report.messages.map((m: { ruleId: string }) => m.ruleId) };
  } catch (e) {
    // eslint exits non-zero when errors are found — the report is still on stdout
    const stdout = (e as { stdout?: string }).stdout ?? "";
    const [report] = JSON.parse(stdout);
    return { errorCount: report.errorCount, ruleIds: report.messages.map((m: { ruleId: string }) => m.ruleId) };
  }
}

describe("CI-enforced core purity", () => {
  it("the boundary rule rejects framework, SDK, I/O, and adapter imports", async () => {
    const { errorCount, ruleIds } = await lint("packages/core/test/fixtures/violates-boundary.ts");
    assert.ok(errorCount >= 4, `expected ≥4 boundary errors, got ${errorCount}`);
    assert.ok(ruleIds.every((r) => r === "no-restricted-imports"), `unexpected rules: ${ruleIds}`);
  });

  it("clean core sources pass the same rule", async () => {
    const { errorCount } = await lint("packages/core/src/index.ts");
    assert.equal(errorCount, 0);
  });
});
