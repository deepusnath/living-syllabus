// Commons publisher runner (docs/ARCHITECTURE.md). The real implementation —
// batching living-layer aggregates into moderated PRs via the CommonsPublisher
// port — is the Sprint 4 story "Bot PRs into the commons, human-moderated".
import type { CommonsPublisher } from "@living-syllabus/core";

export function plannedRun(publisher: CommonsPublisher | null): string {
  return publisher ? "publishing batch" : "nothing to publish — no publisher configured (scaffold)";
}

console.log(plannedRun(null));
