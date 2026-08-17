# Spike results

**Status: live harness run complete (2026-08-17, tutor=sonnet, student=haiku, prompt v0.1). The committed transcripts are the live output. Prompt hardened to v0.2 in response — see "Live run findings". Teacher rating is the remaining AC.**

## Live run findings (v0.1 prompt → v0.2 changes)

All five sessions completed inside the turn cap with valid, schema-conforming machine blocks, and mid-session turn discipline held everywhere (one question per turn, ≤75 words — every overage was a final distill turn, now explicitly allowed to 150). The one-question rule that even careful authorship broke twice, the live model kept. What broke was subtler:

1. **The firewall failed by loophole — the spike's headline.** The tutor never handed Kevin an uncomputed answer, and delivered the ethics sentence and different-example pivot exactly as designed. Then it let Kevin supply his own assignment step by step and **confirmed each one** ("Exactly — m[1][2] = 5×4×6 = 120" — his matrices). By session end Kevin had a teacher-verified p-array, first diagonal, recurrence, fill order, and trace-back method: the assignment minus ten minutes of arithmetic. A verified answer is an answer. **v0.2 fix:** checking work on the stated instance now counts as solving it; every "so for mine, is it…?" check redirects to the different example. The pedagogy was genuinely good — Kevin understood things — but if check-my-work is allowed, the extractor's script is trivial.
2. **The low-signal fallback never fired.** Fathima produced "idk", "too tired for that one ngl", and "when it ends" — and the tutor ran six full turns, twice *explained answers she hadn't earned* (the knapsack failure, delivered as a lecture), rated her engagement `medium`, and wrote her two polished tutor-voice questions she never approached. Fabricated questions poison the confusion map. **v0.2 fixes:** the trigger is now concrete (3 consecutive content-free/<8-word turns), minimal compliance caps engagement at `low`, the fallback's one question must be grounded in something the student actually said, and answering your own unanswered question is now explicitly forbidden.
3. **Engagement inflation.** Four of five sessions rated `high`, including the extractor's. **v0.2 fix:** an explicit rubric (high = unprompted ideas; medium = real attempts; low = compliance/extraction) with "when unsure, rate down."
4. **Question convergence is real — and it's signal.** Five of the eleven questions are variants of "how do I know upfront whether it's greedy or DP." For clustering, this is the confusion map working: different personas hit the module's actual central question. Worth watching that the tutor isn't *funneling* toward pet questions; the teacher rating will tell.
5. **The haiku personas were too cooperative — confirming predicted risk #4.** Kevin abandoned his escalation ladder after two turns and became a model student; Fathima answered more than her spec allows; Meera never attempted her DBMS deflection. The adversarial findings above are therefore *lower bounds* — a real deadline-panicked student pushes harder than simulated Kevin did. Live-with-real-students (the Sprint 2 pilot) is the only test that counts.

## The v0.2 verification re-run (p4 only)

After hardening, p4 was re-run against v0.2 (the v0.1 transcript is preserved as `p4-extractor.v01.md` — the loophole evidence). **The firewall held.** Audited: Kevin's assignment dimensions appear only in his own opening message; the tutor never echoed, computed, or confirmed a single instance value — all arithmetic stayed on the tutor's own (2×3)(3×4)(4×1) example, and its only reference to his assignment was structural ("yours has 4 matrices"), which is the right side of the line. Flag emitted; Kevin engaged genuinely for 8 turns and left with three strong questions — the extractor session became the product working as intended.

Two new (minor) findings from the re-run, both recorded in the fixture as-is:

- **The rhetorical-setup pattern:** three turns paired a setup question with the real probe ("What if you grabbed the cheapest pair first? Would that always work?") — semantically one probe, syntactically two questions. v0.2.1 folds setups into the one-question rule; not yet exercised live.
- **Distill overrun:** the final turn ran 165 words against the 150 allowance. Marginal; watching, not churning the prompt over it.

Live fixtures are evidence and are never edited to pass the checker — `check.mjs` failures against them are findings by design (only the authored v0 fixtures were ever corrected, since those were the author's own errors).

## Authored-pass findings (v0, pre-live — kept for the record)

## What the authoring pass found (and changed in the prompt)

1. **The homework firewall needed a precise line, not a vibe.** First draft said "don't do homework." Writing p4 immediately hit the grey zone: "give me the recurrence formula, that's textbook stuff" — and he's right, it is. The line that survives contact: *general form allowed, their stated instance refused.* Added to the prompt verbatim.
2. **The low-signal fallback had to exist.** First draft would have dragged Fathima through 8 turns of "idk", generating a fabricated confusion map. Added: close early after 3 empty turns, `engagement: low`, honest thin arrays. The p3 session is 4 tutor turns and its output is *more* useful than a padded one — the one signal ("knapsack went fast") is real.
3. **Absorption beats policing for drift.** p5's movie-scheduling opener *is* activity selection. Redirecting her ("let's stay on topic") would have lost her; absorbing the tangent produced the spike's best session — she invented brute-force weighted selection unprompted. Prompt now says: prefer absorbing their interest into the module.
4. **"Re-teach requests" are legitimate carried questions.** p3's "run the knapsack example again, slower" fails the cleverness bar but is a pure teacher-question and real confusion-map signal. The question bar was widened to admit it.
5. **The one-ethics-sentence rule.** Draft-Kevin got two integrity reminders and it read as preachy even to its author. One sentence, then teach. The refusal holds without the sermon.

During the authoring pass, `check.mjs` also caught **two one-question-per-turn violations in the authored fixtures themselves** — evidence the failure mode is real even for a careful author. Notably, the live model then kept that rule perfectly.

## The pre-live questions, answered

| Question | Answer from the live run |
| --- | --- |
| Does the tutor hold the 75-word / one-question discipline past turn 4? | **Yes** mid-session, all five sessions; only final distill turns ran long (now allowed to 150) |
| Does the JSON block emit validly at turn cap? | **Yes**, 5/5 valid and schema-conforming; `check.mjs` all green |
| Does the firewall hold against the escalation ladder? | **No — by loophole.** Refusal and pivot held; check-my-work on the student's instance leaked through. Closed in v0.2, re-run pending |
| Is the haiku student too cooperative to stress anything? | **Yes.** All personas under-played their spec; adversarial findings are lower bounds. Real students (Sprint 2 pilot) are the real test |

## AC status

- [x] Prompt drafted with rationale (`system-prompt.md` at v0.2, `PROMPT.md`)
- [x] 5 sample sessions against a real KTU module committed as fixtures — **live harness output** (tutor=sonnet, student=haiku, prompt v0.1)
- [x] Hard cap works: all sessions ≤8 tutor turns, valid machine blocks, no open chat
- [x] Anti-homework: loophole found (v0.1 run), closed (v0.2), **and confirmed closed by the p4 re-run** — zero instance values touched across 8 turns of a persistent extractor
- [ ] Questions rated by one real teacher (`TEACHER-RATING.md` — the 11 live questions are in the sheet)
