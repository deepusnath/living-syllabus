// Domain types per docs/SPEC.md ("Data schema — the living layer").
// Pure data: no framework, no I/O, no SDK. The boundary lint rule and
// erasableSyntaxOnly keep it that way.

/** Pointer into WikiSyllabus, pinned to the commit the content was read at. */
export interface SyllabusRef {
  /** e.g. universities/ktu/computer-science-and-design/2019/s06/03.md */
  readonly path: string;
  /** git commit the syllabus was read at — data must survive revisions */
  readonly commit: string;
  /** module anchor parsed from the markdown headings, e.g. "m3" */
  readonly module: string;
}

export interface ModuleContent {
  readonly ref: SyllabusRef;
  readonly courseCode: string;
  readonly courseTitle: string;
  readonly moduleName: string;
  readonly markdown: string;
}

export interface Classroom {
  readonly id: string;
  readonly teacherId: string;
  readonly syllabusPath: string;
  readonly term: string;
  readonly rosterSize: number;
}

/** One cycle of the session rhythm, created by a teacher's push. */
export interface Session {
  readonly id: string;
  readonly classroomId: string;
  readonly ref: SyllabusRef;
  readonly pushedAt: string;
}

export type Engagement = "high" | "medium" | "low";

export type BriefFlag = "homework_extraction_attempted" | "off_topic_persistent";

/** What one student's brief produced. Transcripts never appear here — they
 * are ephemeral and student-owned (docs/SPEC.md, "Who sees what"). */
export interface InteractionSignal {
  readonly sessionId: string;
  /** pseudonymous — never a real name */
  readonly pseudonym: string;
  readonly engagement: Engagement;
  readonly understood: readonly string[];
  readonly confused: readonly string[];
  readonly questions: readonly CarriedQuestion[];
  readonly flags: readonly BriefFlag[];
}

export interface CarriedQuestion {
  readonly text: string;
  readonly whyTeacher: string;
  readonly tried: string;
}

export type QuestionStatus = "drafted" | "asked" | "answered" | "partial" | "unanswered";

export interface QuestionCluster {
  readonly id: string;
  /** canonical phrasing, kept in the students' voice */
  readonly canonical: string;
  readonly memberCount: number;
}

export type AreaResolution = "resolved" | "partial" | "unresolved";

/** Teacher-facing aggregate. By construction it carries no per-student data —
 * buildConfusionMap is the only way to produce one. */
export interface ConfusionMap {
  readonly sessionId: string;
  readonly participants: number;
  readonly understood: readonly { topic: string; count: number }[];
  readonly confused: readonly { topic: string; count: number }[];
  readonly topClusters: readonly QuestionCluster[];
}

/** Returned instead of a ConfusionMap when rendering it would violate a
 * privacy invariant. The UI renders the reason, never a partial map. */
export interface Withheld {
  readonly status: "withheld";
  readonly reason: "below_k_anonymity";
  readonly participants: number;
  readonly required: number;
}
