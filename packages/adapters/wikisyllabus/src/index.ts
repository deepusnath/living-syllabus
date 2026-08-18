// SyllabusSource over WikiSyllabus's markdown format: YAML frontmatter +
// "### Module N: Title" headings (see the repo's contribution format).
// This adapter is content-addressed: callers hand it file content per
// (path, commit); fetching (git, GitHub API) composes around it. That keeps
// the parser deterministic and the contract suite network-free.

import type { ModuleContent, SyllabusRef, SyllabusSource } from "@living-syllabus/core";

export interface SyllabusFileStore {
  /** Return the raw markdown of a syllabus file at a commit. */
  read(path: string, commit: string): Promise<string>;
}

interface ParsedSyllabus {
  courseCode: string;
  courseTitle: string;
  modules: Map<string, { name: string; markdown: string }>;
}

const frontmatterField = (fm: string, key: string): string =>
  new RegExp(`^${key}:\\s*"?([^"\\n]+)"?\\s*$`, "m").exec(fm)?.[1]?.trim() ?? "";

export function parseSyllabus(markdown: string): ParsedSyllabus {
  const fmMatch = /^---\n([\s\S]*?)\n---/.exec(markdown);
  const fm = fmMatch?.[1] ?? "";
  const modules = new Map<string, { name: string; markdown: string }>();
  const heading = /^### Module (\d+):([^\n]*)\n([\s\S]*?)(?=\n### |\n## |$)/gm;
  for (const m of markdown.matchAll(heading)) {
    const [, num, title, body] = m;
    modules.set(`m${num}`, {
      name: `Module ${num}:${title ?? ""}`.trim(),
      markdown: (body ?? "").trim(),
    });
  }
  return {
    courseCode: frontmatterField(fm, "course_code"),
    courseTitle: frontmatterField(fm, "course_title"),
    modules,
  };
}

export class WikiSyllabusSource implements SyllabusSource {
  private readonly store: SyllabusFileStore;
  constructor(store: SyllabusFileStore) {
    this.store = store;
  }

  private async parsed(path: string, commit: string): Promise<ParsedSyllabus> {
    return parseSyllabus(await this.store.read(path, commit));
  }

  async listModules(path: string, commit: string): Promise<readonly SyllabusRef[]> {
    const { modules } = await this.parsed(path, commit);
    return [...modules.keys()].map((module) => ({ path, commit, module }));
  }

  async resolve(ref: SyllabusRef): Promise<ModuleContent> {
    const { courseCode, courseTitle, modules } = await this.parsed(ref.path, ref.commit);
    const mod = modules.get(ref.module);
    if (!mod) throw new Error(`module "${ref.module}" not found in ${ref.path}@${ref.commit}`);
    return { ref, courseCode, courseTitle, moduleName: mod.name, markdown: mod.markdown };
  }
}
