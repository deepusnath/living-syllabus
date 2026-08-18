import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { syllabusSourceContract } from "@living-syllabus/core/contracts";
import { GitHubRawFileStore, WikiSyllabusSource, resolveLatestCommit, type FetchLike } from "../src/index.ts";

const FIXTURE_PATH = "universities/a-p-j-abdul-kalam-technological-university/computer-science-and-design/2019/s06/03.md";
const FIXTURE_COMMIT = "2d85ffe";
const here = dirname(fileURLToPath(import.meta.url));

/** Serves the committed CST306 bytes for exactly the fixture URL; 404s all else. */
function fakeGitHub() {
  const requested: string[] = [];
  const fetchFn: FetchLike = async (url) => {
    requested.push(url);
    const expected = `https://raw.githubusercontent.com/The-Purple-Movement/WikiSyllabus/${FIXTURE_COMMIT}/${FIXTURE_PATH}`;
    if (url === expected) {
      const body = await readFile(join(here, "fixtures", "cst306.md"), "utf8");
      return { ok: true, status: 200, text: async () => body };
    }
    return { ok: false, status: 404, text: async () => "404: Not Found" };
  };
  return { fetchFn, requested };
}

// Liskov, third adapter: the GitHub-backed store runs the very same suite as
// the in-memory fake and the file-based store — against real repo bytes,
// served by a fake network.
syllabusSourceContract("wikisyllabus over GitHubRawFileStore (fake network)", async () => ({
  source: new WikiSyllabusSource(new GitHubRawFileStore({ fetchFn: fakeGitHub().fetchFn })),
  fixture: {
    path: FIXTURE_PATH,
    commit: FIXTURE_COMMIT,
    knownModule: "m3",
    expectedContent: "knapsack",
  },
}));

describe("GitHubRawFileStore", () => {
  it("fetches a commit-pinned raw URL exactly once, then serves from cache", async () => {
    const { fetchFn, requested } = fakeGitHub();
    const store = new GitHubRawFileStore({ fetchFn });

    const first = await store.read(FIXTURE_PATH, FIXTURE_COMMIT);
    const second = await store.read(FIXTURE_PATH, FIXTURE_COMMIT);

    assert.equal(first, second);
    assert.equal(requested.length, 1, "immutable content at a commit is fetched once");
    assert.ok(requested[0]!.includes(`/${FIXTURE_COMMIT}/`), "URL pins the commit");
  });

  it("throws a clear error on a missing path", async () => {
    const store = new GitHubRawFileStore({ fetchFn: fakeGitHub().fetchFn });
    await assert.rejects(store.read("universities/nope.md", FIXTURE_COMMIT), /HTTP 404.*universities\/nope\.md@2d85ffe/);
  });
});

describe("resolveLatestCommit", () => {
  it("returns the sha GitHub reports for the ref", async () => {
    const fetchFn: FetchLike = async (url, init) => {
      assert.equal(url, "https://api.github.com/repos/The-Purple-Movement/WikiSyllabus/commits/HEAD");
      assert.equal(init?.headers?.["accept"], "application/vnd.github.sha");
      return { ok: true, status: 200, text: async () => "2d85ffe0aa11bb22cc33dd44ee55ff6677889900\n" };
    };
    assert.equal(await resolveLatestCommit({ fetchFn }), "2d85ffe0aa11bb22cc33dd44ee55ff6677889900");
  });

  it("rejects non-sha responses instead of pinning garbage", async () => {
    const fetchFn: FetchLike = async () => ({ ok: true, status: 200, text: async () => "<html>rate limited</html>" });
    await assert.rejects(resolveLatestCommit({ fetchFn }), /unexpected commit resolution/);
  });
});

// Live smoke against the real WikiSyllabus repo — opt-in only (LS_LIVE_TESTS=1)
// so CI and normal runs stay fully offline.
describe("live GitHub smoke", { skip: process.env["LS_LIVE_TESTS"] !== "1" }, () => {
  it("resolves the real CST306 module 3 at the pinned commit", async () => {
    const source = new WikiSyllabusSource(new GitHubRawFileStore());
    const content = await source.resolve({ path: FIXTURE_PATH, commit: FIXTURE_COMMIT, module: "m3" });
    assert.equal(content.courseCode, "cst306");
    assert.ok(content.markdown.includes("knapsack"));
  });

  it("resolves HEAD to a real commit sha", async () => {
    const sha = await resolveLatestCommit();
    assert.match(sha, /^[0-9a-f]{40}$/);
  });
});
