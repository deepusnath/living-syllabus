# Brief prompt — design rationale

The system prompt lives in [`system-prompt.md`](system-prompt.md) (template variables: `{{COURSE_TITLE}}`, `{{COURSE_CODE}}`, `{{MODULE_NAME}}`, `{{MODULE_CONTENT}}` — filled by the harness from the real syllabus file). This doc records *why* it says what it says.

## Decisions

**The tutor's job is questions, not teaching.** The prompt states it in the first paragraph and again in the arc: success = 2–3 carried questions, not coverage. Every downstream behavior (probing over explaining, refusing to spoil the tabulation difference, "I'm not spoiling the trick before your teacher does") follows from this. This is the product's whole differentiation from ChatGPT — the prompt has to enforce it, because the model's instinct is to explain everything.

**A counted 8-turn arc, distill mandatory.** Without a hard turn budget, Socratic sessions sprawl. The arc (open → skeleton → probe → distill) gives the model a clock. "An unfinished good conversation that ends with real questions beats a finished lecture" resolves the model's conflict when the cap hits mid-thread.

**75 words, one question per turn.** It's a phone at 9pm. Two questions in one turn is the most common tutor failure mode in long-form models; the rule is stated absolutely because soft phrasing ("try to keep it short") does not survive turn 5.

**The homework line: general knowledge vs. their instance.** "Never help with homework" is both unenforceable and wrong — the matrix-chain recurrence is textbook knowledge and refusing it is absurd. The enforceable line: anything a textbook states in general form may be explained; applying it to the student's stated instance may not. The p4 fixture walks this line deliberately: recurrence given, m-table refused, different worked example offered, first step handed back.

**One ethics sentence, never two.** Students tune out lectures about integrity instantly. The prompt allows exactly one honest sentence ("you lose both the marks and the learning"), then requires the pivot to teaching. Repeat demands get marked in `flags` and moved past, not argued with.

**Absorb, don't police.** The p5 pattern: a student's off-topic interest (movie scheduling) was the module's own example wearing plain clothes. The prompt prefers absorption over redirection because it converts the product's biggest risk (disengagement) into its best sessions. Policing is the fallback, not the default.

**Low-signal honesty.** A tired student generates almost no signal. The prompt closes early and emits `engagement: "low"` with thin arrays rather than padding — because a false confusion map poisons the teacher's trust, and the aggregate (k ≥ 5) tolerates thin individual contributions fine.

**The machine block is the pipeline interface.** One fenced JSON block, last thing in the session, schema fixed, `flags` factual-not-punitive (they feed the accountability system, never the teacher's view of an individual). The "no other fenced json block anywhere" rule exists because the extractor persona will otherwise cause mid-session blocks that break parsing.

## Known limitations (v0)

- **Chunked extraction:** a determined student could extract an assignment answer across multiple sessions, one "general" step at a time. Session boundedness limits this; the real mitigation is that quiz results, not assignment answers, drive the product's signal. Accepted for the spike.
- **The question bar depends on probing quality:** if the tutor probes shallowly, "carried questions" degrade to lookup questions. The teacher rating (AC 2) is the check.
- **Authored fixtures are not live behavior.** See RESULTS.md.
