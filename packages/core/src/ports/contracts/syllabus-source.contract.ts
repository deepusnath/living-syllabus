// Liskov, made executable: every SyllabusSource adapter runs this same suite.
// If the in-memory fake passes and the real adapter passes, the core cannot
// tell them apart. New adapters start here (docs/ARCHITECTURE.md).

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { SyllabusSource } from "../index.ts";

export interface SyllabusSourceFixture {
  /** A syllabus path known to the adapter under test. */
  readonly path: string;
  readonly commit: string;
  /** A module anchor expected among listModules results. */
  readonly knownModule: string;
  /** A substring expected in that module's markdown. */
  readonly expectedContent: string;
}

export function syllabusSourceContract(
  name: string,
  make: () => Promise<{ source: SyllabusSource; fixture: SyllabusSourceFixture }>,
): void {
  describe(`SyllabusSource contract: ${name}`, () => {
    it("lists modules with refs pinned to the given path and commit", async () => {
      const { source, fixture } = await make();
      const modules = await source.listModules(fixture.path, fixture.commit);
      assert.ok(modules.length > 0, "at least one module");
      for (const ref of modules) {
        assert.equal(ref.path, fixture.path);
        assert.equal(ref.commit, fixture.commit);
        assert.ok(ref.module.length > 0);
      }
      assert.ok(
        modules.some((m) => m.module === fixture.knownModule),
        `expected module "${fixture.knownModule}" in [${modules.map((m) => m.module).join(", ")}]`,
      );
    });

    it("resolves a module to content that matches its ref", async () => {
      const { source, fixture } = await make();
      const content = await source.resolve({ path: fixture.path, commit: fixture.commit, module: fixture.knownModule });
      assert.equal(content.ref.module, fixture.knownModule);
      assert.ok(content.courseCode.length > 0, "courseCode parsed");
      assert.ok(content.markdown.includes(fixture.expectedContent));
    });

    it("is deterministic: same ref + commit yields identical content", async () => {
      const { source, fixture } = await make();
      const ref = { path: fixture.path, commit: fixture.commit, module: fixture.knownModule };
      const [a, b] = [await source.resolve(ref), await source.resolve(ref)];
      assert.deepEqual(a, b);
    });

    it("rejects an unknown module anchor", async () => {
      const { source, fixture } = await make();
      await assert.rejects(
        source.resolve({ path: fixture.path, commit: fixture.commit, module: "no-such-module-anchor" }),
      );
    });
  });
}
