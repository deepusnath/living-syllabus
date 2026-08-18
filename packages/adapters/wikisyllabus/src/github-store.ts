// SyllabusFileStore over GitHub's raw-content host. Content is addressed by
// (path, commit), and a file at a commit is immutable — so responses cache
// forever and determinism (the contract's third law) holds by construction.
// raw.githubusercontent.com was chosen over the contents API (rate limits,
// base64 indirection) and a local clone (operational weight); no SDK needed,
// Node's global fetch suffices.

import type { SyllabusFileStore } from "./index.ts";

export interface GitHubRepoRef {
  readonly owner: string;
  readonly repo: string;
}

export const WIKISYLLABUS_REPO: GitHubRepoRef = { owner: "The-Purple-Movement", repo: "WikiSyllabus" };

/** The slice of fetch the store uses — injectable so tests stay offline. */
export type FetchLike = (
  url: string,
  init?: { headers?: Record<string, string> },
) => Promise<{ ok: boolean; status: number; text(): Promise<string> }>;

export interface GitHubRawFileStoreOptions {
  readonly repo?: GitHubRepoRef;
  readonly fetchFn?: FetchLike;
}

export class GitHubRawFileStore implements SyllabusFileStore {
  private readonly repo: GitHubRepoRef;
  private readonly fetchFn: FetchLike;
  private readonly cache = new Map<string, string>();

  constructor(options: GitHubRawFileStoreOptions = {}) {
    this.repo = options.repo ?? WIKISYLLABUS_REPO;
    this.fetchFn = options.fetchFn ?? (globalThis.fetch as FetchLike);
  }

  async read(path: string, commit: string): Promise<string> {
    const key = `${path}@${commit}`;
    const cached = this.cache.get(key);
    if (cached !== undefined) return cached;

    const url = `https://raw.githubusercontent.com/${this.repo.owner}/${this.repo.repo}/${encodeURIComponent(commit)}/${path}`;
    const response = await this.fetchFn(url);
    if (!response.ok) {
      throw new Error(`syllabus fetch failed (HTTP ${response.status}) for ${key} in ${this.repo.owner}/${this.repo.repo}`);
    }
    const text = await response.text();
    this.cache.set(key, text);
    return text;
  }
}

/** Resolve a branch or "HEAD" to a commit sha — used once, when a classroom
 * pins its syllabus (docs/SPEC.md: data must survive syllabus revisions). */
export async function resolveLatestCommit(options: GitHubRawFileStoreOptions & { readonly ref?: string } = {}): Promise<string> {
  const repo = options.repo ?? WIKISYLLABUS_REPO;
  const fetchFn = options.fetchFn ?? (globalThis.fetch as FetchLike);
  const ref = options.ref ?? "HEAD";

  const url = `https://api.github.com/repos/${repo.owner}/${repo.repo}/commits/${encodeURIComponent(ref)}`;
  const response = await fetchFn(url, {
    headers: { accept: "application/vnd.github.sha", "user-agent": "living-syllabus" },
  });
  if (!response.ok) {
    throw new Error(`commit resolution failed (HTTP ${response.status}) for ${ref} in ${repo.owner}/${repo.repo}`);
  }
  const sha = (await response.text()).trim();
  if (!/^[0-9a-f]{7,40}$/.test(sha)) throw new Error(`unexpected commit resolution response for ${ref}: ${sha.slice(0, 80)}`);
  return sha;
}
