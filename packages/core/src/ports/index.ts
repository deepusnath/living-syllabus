// The eight ports from docs/ARCHITECTURE.md. Every external dependency enters
// the core through one of these. Adapters implement them; contract tests
// (./contracts) define what "implements" means.

import type { CarriedQuestion, Engagement, BriefFlag, ModuleContent, QuestionCluster, SyllabusRef } from "../domain/types.ts";

/** Resolve syllabus content from the commons (WikiSyllabus or another source). */
export interface SyllabusSource {
  /** List the module anchors available in one syllabus file at one commit. */
  listModules(path: string, commit: string): Promise<readonly SyllabusRef[]>;
  /** Resolve one module's content. Same ref + commit ⇒ identical content. */
  resolve(ref: SyllabusRef): Promise<ModuleContent>;
}

export interface BriefOutcome {
  readonly engagement: Engagement;
  readonly understood: readonly string[];
  readonly confused: readonly string[];
  readonly questions: readonly CarriedQuestion[];
  readonly flags: readonly BriefFlag[];
}

/** Runs the bounded Socratic brief. The adapter owns prompts and the model;
 * the core owns the outcome schema. */
export interface BriefEngine {
  runBrief(module: ModuleContent, studentTurn: (tutorText: string) => Promise<string>): Promise<BriefOutcome>;
}

export interface QuestionClusterer {
  cluster(questions: readonly { id: string; text: string }[]): Promise<readonly QuestionCluster[]>;
}

export interface QuizItem {
  readonly area: string;
  readonly sourceClusterId: string | null;
  readonly prompt: string;
  readonly options: readonly string[];
  readonly correctIndex: number;
}

export interface QuizGenerator {
  generate(module: ModuleContent, confusedClusters: readonly QuestionCluster[]): Promise<readonly QuizItem[]>;
}

export interface ModerationVerdict {
  readonly allowed: boolean;
  readonly reason?: string;
}

export interface ModerationFilter {
  screen(questionText: string): Promise<ModerationVerdict>;
}

/** Reaches students: topic pushes, quiz triggers. Web push first; WhatsApp later. */
export interface MessageChannel {
  notify(pseudonymousRecipientIds: readonly string[], message: { kind: "topic_push" | "quiz"; sessionId: string; text: string }): Promise<void>;
}

/** Publishes aggregates to the commons as moderated PRs — never direct pushes. */
export interface CommonsPublisher {
  publish(ref: SyllabusRef, files: readonly { relativePath: string; yaml: string }[]): Promise<{ prUrl: string }>;
}

/** Pseudonymous to the room, accountable to the system (docs/SPEC.md). */
export interface IdentityProvider {
  issuePseudonym(classroomId: string, accountId: string): Promise<string>;
  /** For the abuse path only: pseudonym → account, audited. Never exposed to teacher surfaces. */
  trace(classroomId: string, pseudonym: string, auditReason: string): Promise<string>;
}
