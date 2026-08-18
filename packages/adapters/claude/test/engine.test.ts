// Golden test: replays the LIVE spike session (tutor=sonnet, 2026-08-17)
// through the engine — real model text, zero network (ADR-0002). Core tests
// never hit the network; neither do these.

import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import type { BriefIO, ModuleContent } from "@living-syllabus/core";
import { BriefOutputContractError, ClaudeBriefEngine, type TutorTransport } from "../src/index.ts";

const here = dirname(fileURLToPath(import.meta.url));

interface Golden {
  studentOpening: string;
  tutorTurns: string[];
  studentReplies: string[];
  expectedOutcome: {
    engagement: string;
    understood: string[];
    confused: string[];
    questions: { text: string; why_teacher: string; tried: string }[];
    flags: string[];
  };
}
const golden: Golden = JSON.parse(readFileSync(join(here, "golden", "p1-diligent.json"), "utf8"));

const module_: ModuleContent = {
  ref: {
    path: "universities/a-p-j-abdul-kalam-technological-university/computer-science-and-design/2019/s06/03.md",
    commit: "2d85ffe",
    module: "m3",
  },
  courseCode: "cst306",
  courseTitle: "algorithm-analysis-and-design",
  moduleName: "Module 3: Greedy and Dynamic Programming",
  markdown: "Huffman coding, activity selection, knapsack, matrix chain multiplication, optimal binary search tree.",
};

type Captured = Parameters<TutorTransport["complete"]>[0];

class ReplayTransport implements TutorTransport {
  readonly requests: Captured[] = [];
  private readonly turns: readonly string[];
  constructor(turns: readonly string[]) {
    this.turns = turns;
  }
  async complete(request: Captured): Promise<string> {
    this.requests.push(structuredClone(request)); // snapshot — the engine reuses its messages array
    const turn = this.turns[this.requests.length - 1];
    if (turn === undefined) throw new Error("replay exhausted");
    return turn;
  }
}

function scriptedIO(replies: readonly string[]) {
  const delivered: string[] = [];
  let i = 0;
  const io: BriefIO = {
    async deliver(text) {
      delivered.push(text);
    },
    async listen() {
      const reply = replies[i++];
      if (reply === undefined) throw new Error("listen called past the script");
      return reply;
    },
  };
  return { io, delivered };
}

describe("ClaudeBriefEngine against the live golden session", () => {
  const config = { model: "claude-sonnet-5", maxTokensPerTurn: 2048, maxTutorTurns: 8 };

  it("replays to the exact outcome the live run produced", async () => {
    const transport = new ReplayTransport(golden.tutorTurns);
    const { io, delivered } = scriptedIO(golden.studentReplies);

    const outcome = await new ClaudeBriefEngine(transport, config).runBrief(module_, io);

    assert.deepEqual(outcome, {
      engagement: golden.expectedOutcome.engagement,
      understood: golden.expectedOutcome.understood,
      confused: golden.expectedOutcome.confused,
      questions: golden.expectedOutcome.questions.map((q) => ({
        text: q.text,
        whyTeacher: q.why_teacher,
        tried: q.tried,
      })),
      flags: golden.expectedOutcome.flags,
    });

    assert.equal(delivered.length, golden.tutorTurns.length, "every tutor turn is delivered, close included");
    assert.ok(!delivered.at(-1)!.includes("```json"), "the machine block never reaches the student");
    assert.equal(transport.requests.length, golden.tutorTurns.length);
  });

  it("builds requests from the syllabus module and the configured model", async () => {
    const transport = new ReplayTransport(golden.tutorTurns);
    const { io } = scriptedIO(golden.studentReplies);
    await new ClaudeBriefEngine(transport, config).runBrief(module_, io);

    const first = transport.requests[0]!;
    assert.equal(first.model, "claude-sonnet-5");
    assert.equal(first.maxTokens, 2048);
    assert.ok(first.system.includes(module_.markdown), "module content is in the system prompt");
    assert.ok(first.system.includes("cst306"), "course code is filled in");
    assert.ok(!first.system.includes("{{"), "no unfilled template variables");
    assert.equal(first.messages.length, 1);
    assert.equal(first.messages[0]!.role, "user");
    for (const request of transport.requests) {
      request.messages.forEach((m, i) => assert.equal(m.role, i % 2 === 0 ? "user" : "assistant"));
    }
  });

  it("forces a distill at the turn cap and returns its outcome", async () => {
    const rambling = Array.from({ length: 3 }, (_, i) => `Interesting — tell me more about part ${i}?`);
    const transport = new ReplayTransport([...rambling, golden.tutorTurns.at(-1)!]);
    const { io } = scriptedIO(["ok", "sure", "hm"]);

    const outcome = await new ClaudeBriefEngine(transport, { ...config, maxTutorTurns: 3 }).runBrief(module_, io);

    assert.equal(outcome.engagement, golden.expectedOutcome.engagement);
    assert.equal(transport.requests.length, 4, "3 budgeted turns + 1 forced distill");
    const lastRequest = transport.requests.at(-1)!;
    assert.ok(lastRequest.messages.some((m) => m.content.includes("turn budget is exhausted")));
  });

  it("fails loudly when even the forced distill produces no block", async () => {
    const transport = new ReplayTransport(Array.from({ length: 4 }, () => "still just chatting?"));
    const { io } = scriptedIO(["a", "b", "c"]);

    await assert.rejects(
      new ClaudeBriefEngine(transport, { ...config, maxTutorTurns: 3 }).runBrief(module_, io),
      BriefOutputContractError,
    );
  });
});
