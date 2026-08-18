import type { ConfusionMap, InteractionSignal, QuestionCluster, Withheld } from "../domain/types.ts";

/** Privacy invariant (docs/SPEC.md): nothing renders below five participants.
 * This is a domain rule, not a UI convention — screens receive either an
 * aggregate or a Withheld, never raw signals. */
export const K_ANONYMITY_THRESHOLD = 5;

function countTopics(signals: readonly InteractionSignal[], pick: (s: InteractionSignal) => readonly string[]) {
  const counts = new Map<string, number>();
  for (const s of signals) {
    for (const topic of pick(s)) counts.set(topic, (counts.get(topic) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([topic, count]) => ({ topic, count }))
    .sort((a, b) => b.count - a.count || a.topic.localeCompare(b.topic));
}

export function buildConfusionMap(
  sessionId: string,
  signals: readonly InteractionSignal[],
  clusters: readonly QuestionCluster[],
): ConfusionMap | Withheld {
  const participants = signals.length;
  if (participants < K_ANONYMITY_THRESHOLD) {
    return { status: "withheld", reason: "below_k_anonymity", participants, required: K_ANONYMITY_THRESHOLD };
  }
  return {
    sessionId,
    participants,
    understood: countTopics(signals, (s) => s.understood),
    confused: countTopics(signals, (s) => s.confused),
    topClusters: [...clusters].sort((a, b) => b.memberCount - a.memberCount).slice(0, 6),
  };
}
