import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { syllabusSourceContract } from "@living-syllabus/core/contracts";
import { WikiSyllabusSource, parseSyllabus, type SyllabusFileStore } from "../src/index.ts";

const FIXTURE_PATH = "universities/a-p-j-abdul-kalam-technological-university/computer-science-and-design/2019/s06/03.md";
const FIXTURE_COMMIT = "2d85ffe";
const here = dirname(fileURLToPath(import.meta.url));

const fixtureStore: SyllabusFileStore = {
  async read(path, commit) {
    if (path !== FIXTURE_PATH || commit !== FIXTURE_COMMIT) throw new Error(`no fixture for ${path}@${commit}`);
    return readFile(join(here, "fixtures", "cst306.md"), "utf8");
  },
};

syllabusSourceContract("wikisyllabus (real CST306 fixture)", async () => ({
  source: new WikiSyllabusSource(fixtureStore),
  fixture: {
    path: FIXTURE_PATH,
    commit: FIXTURE_COMMIT,
    knownModule: "m3",
    expectedContent: "knapsack",
  },
}));

describe("parseSyllabus against the real KTU format", () => {
  it("reads frontmatter and all five modules", async () => {
    const parsed = parseSyllabus(await fixtureStore.read(FIXTURE_PATH, FIXTURE_COMMIT));
    assert.equal(parsed.courseCode, "cst306");
    assert.equal(parsed.courseTitle, "algorithm-analysis-and-design");
    assert.deepEqual([...parsed.modules.keys()], ["m1", "m2", "m3", "m4", "m5"]);
    assert.equal(parsed.modules.get("m3")?.name, "Module 3: Greedy and Dynamic Programming");
  });
});
