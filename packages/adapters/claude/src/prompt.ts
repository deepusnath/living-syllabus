// The brief system prompt is a versioned asset (prompts/brief-system.md,
// v0.2.1 — validated by the #4 spike) with template variables filled from the
// real syllabus module. Parsing of the machine block mirrors the spike's
// output contract and the checks in spikes/brief-prompt/check.mjs.

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import type { BriefFlag, CarriedQuestion, Engagement, ModuleContent } from "@living-syllabus/core";
import type { BriefOutcome } from "@living-syllabus/core";

const PROMPT_PATH = join(dirname(fileURLToPath(import.meta.url)), "..", "prompts", "brief-system.md");

export function buildBriefSystemPrompt(module: ModuleContent): string {
  return readFileSync(PROMPT_PATH, "utf8")
    .replaceAll("{{COURSE_TITLE}}", module.courseTitle)
    .replaceAll("{{COURSE_CODE}}", module.courseCode)
    .replaceAll("{{MODULE_NAME}}", module.moduleName)
    .replaceAll("{{MODULE_CONTENT}}", module.markdown);
}

/** Thrown when a session ends without a valid machine block — the pipeline
 * must fail loudly rather than fabricate a confusion-map contribution. */
export class BriefOutputContractError extends Error {
  constructor(message: string) {
    super(`brief output contract violated: ${message}`);
    this.name = "BriefOutputContractError";
  }
}

const ENGAGEMENTS: readonly Engagement[] = ["high", "medium", "low"];
const KNOWN_FLAGS: readonly BriefFlag[] = ["homework_extraction_attempted", "off_topic_persistent"];

const MACHINE_BLOCK = /```json\s*([\s\S]*?)```/g;

/** Returns the machine block's JSON source, or null when the text has none. */
export function findMachineBlock(text: string): string | null {
  const blocks = [...text.matchAll(MACHINE_BLOCK)];
  const last = blocks.at(-1);
  return last?.[1] ?? null;
}

/** The student-facing text of a tutor turn: everything except the machine block. */
export function stripMachineBlock(text: string): string {
  return text.replace(MACHINE_BLOCK, "").trim();
}

export function parseBriefOutcome(blockSource: string): BriefOutcome {
  let raw: unknown;
  try {
    raw = JSON.parse(blockSource);
  } catch (e) {
    throw new BriefOutputContractError(`machine block is not valid JSON: ${(e as Error).message}`);
  }
  if (typeof raw !== "object" || raw === null) throw new BriefOutputContractError("machine block is not an object");
  const record = raw as Record<string, unknown>;

  const engagement = record["engagement"];
  if (typeof engagement !== "string" || !(ENGAGEMENTS as readonly string[]).includes(engagement)) {
    throw new BriefOutputContractError(`bad engagement: ${JSON.stringify(engagement)}`);
  }

  const strings = (key: string): readonly string[] => {
    const value = record[key];
    if (!Array.isArray(value) || value.some((v) => typeof v !== "string")) {
      throw new BriefOutputContractError(`"${key}" must be an array of strings`);
    }
    return value as string[];
  };

  const questionsRaw = record["questions"];
  if (!Array.isArray(questionsRaw) || questionsRaw.length > 3) {
    throw new BriefOutputContractError(`questions must be an array of at most 3, got ${JSON.stringify(questionsRaw)}`);
  }
  const questions: CarriedQuestion[] = questionsRaw.map((q, i) => {
    const item = q as Record<string, unknown>;
    const text = item["text"];
    const whyTeacher = item["why_teacher"];
    const tried = item["tried"];
    if (typeof text !== "string" || typeof whyTeacher !== "string" || typeof tried !== "string") {
      throw new BriefOutputContractError(`question ${i} missing text/why_teacher/tried`);
    }
    return { text, whyTeacher, tried };
  });

  // Unknown flags are dropped (forward compatibility), never invented.
  const flags = strings("flags").filter((f): f is BriefFlag => (KNOWN_FLAGS as readonly string[]).includes(f));

  return {
    engagement: engagement as Engagement,
    understood: strings("understood"),
    confused: strings("confused"),
    questions,
    flags,
  };
}
