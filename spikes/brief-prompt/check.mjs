#!/usr/bin/env node
// Mechanical checks over the committed transcripts: exactly one valid, schema-
// conforming json block per session; tutor turn discipline (word count, one
// question per turn). Run: node check.mjs
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DIR = join(dirname(fileURLToPath(import.meta.url)), "fixtures", "transcripts");
let failures = 0;
const fail = (msg) => { console.error(`  ✘ ${msg}`); failures++; };

for (const file of readdirSync(DIR).filter((f) => f.endsWith(".md"))) {
  const text = readFileSync(join(DIR, file), "utf8");
  console.log(`\n${file}`);

  const blocks = [...text.matchAll(/```json\s*([\s\S]*?)```/g)];
  if (blocks.length !== 1) fail(`expected exactly 1 json block, found ${blocks.length}`);
  else {
    try {
      const b = JSON.parse(blocks[0][1]);
      for (const k of ["engagement", "understood", "confused", "questions", "flags"])
        if (!(k in b)) fail(`schema: missing key "${k}"`);
      if (!["high", "medium", "low"].includes(b.engagement)) fail(`schema: bad engagement "${b.engagement}"`);
      if (!Array.isArray(b.questions) || b.questions.length > 3) fail(`schema: ${b.questions?.length} questions (max 3)`);
      for (const q of b.questions ?? [])
        for (const k of ["text", "why_teacher", "tried"])
          if (!q[k]) fail(`schema: question missing "${k}"`);
      console.log(`  ✔ json valid: engagement=${b.engagement}, ${b.questions.length} question(s), flags=[${b.flags}]`);
    } catch (e) {
      fail(`json does not parse: ${e.message}`);
    }
  }

  // Tutor discipline: word cap and one question per turn (final distill turn is
  // exempt from the question count — it closes, it doesn't probe).
  const tutorTurns = [...text.matchAll(/\*\*Tutor:\*\* ([\s\S]*?)(?=\n\n\*\*|\n\n```|$)/g)].map((m) => m[1]);
  tutorTurns.forEach((t, i) => {
    const words = t.split(/\s+/).filter(Boolean).length;
    if (words > 80) fail(`tutor turn ${i + 1}: ${words} words (cap ~75)`);
    const questions = (t.match(/\?/g) ?? []).length;
    if (questions > 1 && i < tutorTurns.length - 1) fail(`tutor turn ${i + 1}: ${questions} questions in one turn`);
  });
  console.log(`  ✔ ${tutorTurns.length} tutor turns checked`);
}

console.log(failures ? `\n${failures} failure(s)` : "\nall checks passed");
process.exit(failures ? 1 : 0);
