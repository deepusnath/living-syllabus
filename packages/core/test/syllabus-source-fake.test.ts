// The in-memory fake runs the same contract every real adapter runs.
// It is also the fake other core tests may inject.

import type { ModuleContent, SyllabusRef, SyllabusSource } from "../src/index.ts";
import { syllabusSourceContract } from "../src/ports/contracts/index.ts";

type FakeFiles = ReadonlyMap<string, { courseCode: string; courseTitle: string; modules: ReadonlyMap<string, string> }>;

export class InMemorySyllabusSource implements SyllabusSource {
  private readonly files: FakeFiles;
  constructor(files: FakeFiles) {
    this.files = files;
  }

  async listModules(path: string, commit: string): Promise<readonly SyllabusRef[]> {
    const file = this.files.get(`${path}@${commit}`);
    if (!file) throw new Error(`unknown syllabus: ${path}@${commit}`);
    return [...file.modules.keys()].map((module) => ({ path, commit, module }));
  }

  async resolve(ref: SyllabusRef): Promise<ModuleContent> {
    const file = this.files.get(`${ref.path}@${ref.commit}`);
    const markdown = file?.modules.get(ref.module);
    if (!file || markdown === undefined) throw new Error(`unknown module: ${ref.module}`);
    return { ref, courseCode: file.courseCode, courseTitle: file.courseTitle, moduleName: ref.module, markdown };
  }
}

syllabusSourceContract("in-memory fake", async () => ({
  source: new InMemorySyllabusSource(
    new Map([
      [
        "universities/ktu/cs/2019/s06/03.md@2d85ffe",
        {
          courseCode: "cst306",
          courseTitle: "algorithm-analysis-and-design",
          modules: new Map([
            ["m1", "Asymptotic notation, recurrences."],
            ["m3", "Huffman coding, knapsack, matrix chain multiplication."],
          ]),
        },
      ],
    ]),
  ),
  fixture: {
    path: "universities/ktu/cs/2019/s06/03.md",
    commit: "2d85ffe",
    knownModule: "m3",
    expectedContent: "knapsack",
  },
}));
