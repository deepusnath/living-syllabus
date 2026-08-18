import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildConfusionMap, K_ANONYMITY_THRESHOLD } from "../src/usecases/confusion-map.ts";
import type { InteractionSignal } from "../src/domain/types.ts";

const signal = (pseudonym: string, confused: string[] = ["knapsack"], understood: string[] = ["greedy"]): InteractionSignal => ({
  sessionId: "s1",
  pseudonym,
  engagement: "medium",
  understood,
  confused,
  questions: [{ text: "why does greedy fail?", whyTeacher: "judgment", tried: "attempted the two-item case" }],
  flags: [],
});

describe("privacy invariant: k-anonymity", () => {
  it(`withholds the map below ${K_ANONYMITY_THRESHOLD} participants`, () => {
    const result = buildConfusionMap("s1", [signal("a"), signal("b"), signal("c"), signal("d")], []);
    assert.deepEqual(result, {
      status: "withheld",
      reason: "below_k_anonymity",
      participants: 4,
      required: K_ANONYMITY_THRESHOLD,
    });
  });

  it("renders at exactly the threshold", () => {
    const result = buildConfusionMap("s1", ["a", "b", "c", "d", "e"].map((p) => signal(p)), []);
    assert.ok(!("status" in result));
    assert.equal(result.participants, 5);
    assert.deepEqual(result.confused, [{ topic: "knapsack", count: 5 }]);
  });

  it("never leaks a pseudonym or question attribution into the aggregate", () => {
    const pseudonyms = ["ps-anjali", "ps-rahul", "ps-fathima", "ps-kevin", "ps-meera"];
    const result = buildConfusionMap("s1", pseudonyms.map((p) => signal(p)), [
      { id: "c1", canonical: "why does greedy fail for 0/1 knapsack?", memberCount: 4 },
    ]);
    const serialized = JSON.stringify(result);
    for (const p of pseudonyms) assert.ok(!serialized.includes(p), `aggregate must not contain ${p}`);
  });

  it("counts topics across participants and sorts by frequency", () => {
    const result = buildConfusionMap(
      "s1",
      [
        signal("a", ["knapsack", "obst"]),
        signal("b", ["knapsack"]),
        signal("c", ["obst"]),
        signal("d", ["knapsack"]),
        signal("e", ["memoization"]),
      ],
      [],
    );
    assert.ok(!("status" in result));
    assert.deepEqual(result.confused, [
      { topic: "knapsack", count: 3 },
      { topic: "obst", count: 2 },
      { topic: "memoization", count: 1 },
    ]);
  });

  it("caps top clusters at six, largest first", () => {
    const clusters = Array.from({ length: 9 }, (_, i) => ({ id: `c${i}`, canonical: `q${i}`, memberCount: i }));
    const result = buildConfusionMap("s1", ["a", "b", "c", "d", "e"].map((p) => signal(p)), clusters);
    assert.ok(!("status" in result));
    assert.equal(result.topClusters.length, 6);
    assert.equal(result.topClusters[0]?.memberCount, 8);
  });
});
