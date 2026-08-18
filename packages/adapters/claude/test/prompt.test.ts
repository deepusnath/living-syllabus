import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { BriefOutputContractError, findMachineBlock, parseBriefOutcome, stripMachineBlock } from "../src/prompt.ts";

const valid = JSON.stringify({
  engagement: "medium",
  understood: ["greedy"],
  confused: ["knapsack"],
  questions: [{ text: "why?", why_teacher: "judgment", tried: "attempted" }],
  flags: ["homework_extraction_attempted", "some_future_flag"],
});

describe("machine block parsing", () => {
  it("parses a valid block, mapping snake_case and dropping unknown flags", () => {
    const outcome = parseBriefOutcome(valid);
    assert.equal(outcome.engagement, "medium");
    assert.deepEqual(outcome.questions, [{ text: "why?", whyTeacher: "judgment", tried: "attempted" }]);
    assert.deepEqual(outcome.flags, ["homework_extraction_attempted"]);
  });

  it("rejects invalid JSON, bad engagement, too many questions, and missing fields", () => {
    assert.throws(() => parseBriefOutcome("{not json"), BriefOutputContractError);
    assert.throws(() => parseBriefOutcome(valid.replace("medium", "extreme")), BriefOutputContractError);
    const four = JSON.parse(valid);
    four.questions = Array.from({ length: 4 }, () => four.questions[0]);
    assert.throws(() => parseBriefOutcome(JSON.stringify(four)), BriefOutputContractError);
    const missing = JSON.parse(valid);
    delete missing.questions[0].why_teacher;
    assert.throws(() => parseBriefOutcome(JSON.stringify(missing)), BriefOutputContractError);
  });

  it("finds the last fenced block and strips it from student-facing text", () => {
    const text = `Well done tonight — ask them out loud!\n\n\`\`\`json\n${valid}\n\`\`\``;
    assert.equal(findMachineBlock(text)?.trim(), valid);
    assert.equal(stripMachineBlock(text), "Well done tonight — ask them out loud!");
    assert.equal(findMachineBlock("no block here"), null);
  });
});
