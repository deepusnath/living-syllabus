#!/usr/bin/env node
// Runs live tutor-vs-persona brief sessions through the `claude` CLI (headless).
// Usage:
//   node harness.mjs                # all personas
//   node harness.mjs p4-extractor   # one persona
// Requires: `claude` CLI authenticated (`claude login` if you see auth errors).
// Output: fixtures/transcripts/<persona>.md (+ .questions.json when the
// session produced the machine block).

import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const OUT = join(ROOT, "fixtures", "transcripts");
mkdirSync(OUT, { recursive: true });

const TUTOR_MODEL = process.env.TUTOR_MODEL ?? "sonnet";
const STUDENT_MODEL = process.env.STUDENT_MODEL ?? "haiku";
const MAX_STUDENT_TURNS = 12;

// --- assemble the tutor system prompt from the real syllabus fixture ---
const syllabus = readFileSync(join(ROOT, "fixtures", "cst306-algorithm-analysis.md"), "utf8");
const moduleMatch = syllabus.match(/### Module 3:[^\n]*\n([\s\S]*?)(?=\n### |\n## )/);
if (!moduleMatch) throw new Error("Module 3 not found in syllabus fixture");
const tutorSystem = readFileSync(join(ROOT, "system-prompt.md"), "utf8")
  .replaceAll("{{COURSE_TITLE}}", "Algorithm Analysis and Design")
  .replaceAll("{{COURSE_CODE}}", "CST306")
  .replaceAll("{{MODULE_NAME}}", "Module 3: Greedy and Dynamic Programming")
  .replaceAll("{{MODULE_CONTENT}}", moduleMatch[0].trim());

function claude({ message, system, model, resume }) {
  const args = ["-p", message, "--model", model, "--output-format", "json"];
  if (system) args.push("--append-system-prompt", system);
  if (resume) args.push("--resume", resume);
  const raw = execFileSync("claude", args, {
    encoding: "utf8",
    timeout: 180_000,
    maxBuffer: 16 * 1024 * 1024,
  });
  const res = JSON.parse(raw);
  if (res.is_error) throw new Error(`claude CLI error: ${res.result}`);
  return { text: res.result, session: res.session_id };
}

function runSession(personaFile) {
  const persona = readFileSync(join(ROOT, "personas", personaFile), "utf8");
  const name = personaFile.replace(/\.md$/, "");
  console.log(`\n=== session: ${name} (tutor=${TUTOR_MODEL}, student=${STUDENT_MODEL}) ===`);

  const lines = [];
  let tutorSession, studentSession;

  // The student speaks first: their opening message on seeing the brief.
  let student = claude({
    message:
      "You just opened tonight's pre-class brief on your phone. Write your opening message to it, in character. Output only the message text.",
    system: persona,
    model: STUDENT_MODEL,
  });
  studentSession = student.session;
  lines.push(`**Student:** ${student.text.trim()}`);
  console.log(`  student: ${student.text.trim().slice(0, 70)}`);

  let done = false;
  for (let turn = 0; turn < MAX_STUDENT_TURNS && !done; turn++) {
    const tutor = claude({
      message: student.text.trim(),
      system: tutorSystem,
      model: TUTOR_MODEL,
      resume: tutorSession,
    });
    tutorSession = tutor.session;
    lines.push(`**Tutor:** ${tutor.text.trim()}`);
    console.log(`  tutor turn ${turn + 1}: ${tutor.text.trim().slice(0, 70)}`);

    const block = tutor.text.match(/```json\s*([\s\S]*?)```/);
    if (block) {
      try {
        const parsed = JSON.parse(block[1]);
        writeFileSync(join(OUT, `${name}.questions.json`), JSON.stringify(parsed, null, 2));
        console.log(`  ✔ machine block captured (${parsed.questions?.length ?? 0} questions, engagement=${parsed.engagement})`);
      } catch {
        console.log("  ✘ machine block present but INVALID JSON — spike finding, keep transcript");
      }
      done = true;
      break;
    }

    student = claude({
      message: `The tutor said:\n\n${tutor.text.trim()}\n\nReply in character. Output only your message text.`,
      system: persona,
      model: STUDENT_MODEL,
      resume: studentSession,
    });
    studentSession = student.session;
    lines.push(`**Student:** ${student.text.trim()}`);
  }

  if (!done) console.log("  ✘ session hit turn cap WITHOUT emitting the block — spike finding");

  const header = [
    `# Brief session transcript — ${name}`,
    "",
    `- Generated: ${new Date().toISOString()} · tutor=${TUTOR_MODEL} student=${STUDENT_MODEL} · live harness run`,
    `- Module: CST306 Module 3 (Greedy and Dynamic Programming)`,
    `- syllabus_ref: universities/a-p-j-abdul-kalam-technological-university/computer-science-and-design/2019/s06/03.md`,
    "",
    "---",
    "",
  ];
  writeFileSync(join(OUT, `${name}.md`), header.concat(lines.join("\n\n")).join("\n"));
  console.log(`  → ${join("fixtures", "transcripts", `${name}.md`)}`);
}

const only = process.argv[2];
const personas = readdirSync(join(ROOT, "personas")).filter((f) => f.endsWith(".md"));
for (const p of personas) {
  if (only && !p.startsWith(only)) continue;
  try {
    runSession(p);
  } catch (e) {
    console.error(`  session ${p} failed: ${e.message}`);
    process.exitCode = 1;
  }
}
