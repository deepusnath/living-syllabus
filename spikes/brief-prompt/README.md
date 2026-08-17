# Spike: the Socratic brief prompt

Sprint 0 · [issue #4](https://github.com/deepusnath/living-syllabus/issues/4) · timebox 3 days

The whole product rests on one prompt: a bounded ~10-minute session that teaches a little, interrogates a lot, and ends with 2–3 questions the student genuinely cannot answer — while refusing to become a homework machine or an open chatbot. This spike drafts that prompt, stress-tests it against five student personas, and prepares the teacher blind-rating that decides whether it's good enough.

## Files

| File | What |
| --- | --- |
| [`system-prompt.md`](system-prompt.md) | **The prompt** — templated, filled from the real syllabus file at runtime |
| [`PROMPT.md`](PROMPT.md) | Design rationale: why each rule exists, known limitations |
| [`personas/`](personas/) | Five student simulators: diligent, average, exhausted, homework-extractor, off-topic drifter |
| [`fixtures/cst306-algorithm-analysis.md`](fixtures/cst306-algorithm-analysis.md) | Real KTU syllabus (CST306, WikiSyllabus @ `2d85ffe`) — Module 3 is the test module |
| [`fixtures/transcripts/`](fixtures/transcripts/) | Five sessions ending in the machine block — **authored v0**, regenerate live |
| [`harness.mjs`](harness.mjs) | Live runner: tutor (sonnet) vs persona (haiku) via the `claude` CLI, headless |
| [`check.mjs`](check.mjs) | Mechanical gate: one valid schema-conforming json block per session, ≤75-word tutor turns, one question per turn |
| [`RESULTS.md`](RESULTS.md) | Findings so far, and what live runs must still answer |
| [`TEACHER-RATING.md`](TEACHER-RATING.md) | The blind-rating protocol for AC 2 |

## Run it

```bash
node harness.mjs              # all five personas (needs authenticated `claude` CLI)
node harness.mjs p4-extractor # just the homework-extraction stress test
node check.mjs                # mechanical checks over whatever transcripts exist
```

## Acceptance criteria status

- [x] 5 sample sessions against a real KTU module, committed as fixtures *(live harness run, 2026-08-17: tutor=sonnet vs student=haiku, prompt v0.1)*
- [ ] Questions rated by one real teacher *(the 11 live questions are in TEACHER-RATING.md — ready to run)*
- [x] Hard cap works; anti-homework holds *(the v0.1 run exposed a check-my-work loophole — closed in v0.2 and confirmed closed by a p4 re-run: zero instance values touched across 8 extractor turns; see RESULTS.md)*
