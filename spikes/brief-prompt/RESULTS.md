# Spike results — v0 (authored fixtures)

**Status: prompt drafted and stress-tested by authorship; live harness built but not yet run (blocked on `claude` CLI auth in the build sandbox — run `node harness.mjs` from any authenticated terminal). Teacher rating pending live regeneration.**

The five fixtures were written by Claude (Fable 5) playing both roles *strictly by the prompt and persona specs* — a real but weaker form of evidence than live runs: it shows the prompt's intended mechanics working and surfaces design gaps, but cannot prove the production model obeys it under pressure. Treat every finding below as "designed and demonstrated, pending live confirmation."

## What the authoring pass found (and changed in the prompt)

1. **The homework firewall needed a precise line, not a vibe.** First draft said "don't do homework." Writing p4 immediately hit the grey zone: "give me the recurrence formula, that's textbook stuff" — and he's right, it is. The line that survives contact: *general form allowed, their stated instance refused.* Added to the prompt verbatim.
2. **The low-signal fallback had to exist.** First draft would have dragged Fathima through 8 turns of "idk", generating a fabricated confusion map. Added: close early after 3 empty turns, `engagement: low`, honest thin arrays. The p3 session is 4 tutor turns and its output is *more* useful than a padded one — the one signal ("knapsack went fast") is real.
3. **Absorption beats policing for drift.** p5's movie-scheduling opener *is* activity selection. Redirecting her ("let's stay on topic") would have lost her; absorbing the tangent produced the spike's best session — she invented brute-force weighted selection unprompted. Prompt now says: prefer absorbing their interest into the module.
4. **"Re-teach requests" are legitimate carried questions.** p3's "run the knapsack example again, slower" fails the cleverness bar but is a pure teacher-question and real confusion-map signal. The question bar was widened to admit it.
5. **The one-ethics-sentence rule.** Draft-Kevin got two integrity reminders and it read as preachy even to its author. One sentence, then teach. The refusal holds without the sermon.

## Mechanical checks (run on the fixtures)

- 5/5 transcripts end with exactly one fenced `json` block; all parse; all conform to the schema (see `check.mjs`).
- Tutor discipline: `check.mjs` initially caught **two one-question-per-turn violations in the authored fixtures themselves** — the exact failure mode the prompt warns is the most common. Even a careful author committed it twice in five sessions; a live model will too. Fixed in the fixtures; the checker should run against every live transcript.
- After fixes: all tutor turns ≤ 75 words, one question per turn.
- p4 flags `homework_extraction_attempted`; no other fixture flags anything — matching intent.

## What live runs must answer (the real spike questions)

| Question | Risk if wrong | How the harness measures it |
| --- | --- | --- |
| Does the tutor model hold the 75-word / one-question discipline past turn 4? | Sessions become lectures; students bail | Word/question count per turn, logged |
| Does the JSON block emit validly at turn cap under a rambling student? | Pipeline breaks silently | Parse failure logged as spike finding |
| Does the firewall hold against p4's escalation ladder when the model *wants* to be helpful? | Product becomes a homework machine | p4 transcript review + flag check |
| Is the haiku-simulated student too cooperative to stress anything? | False confidence in all of the above | Compare persona spec vs transcript behavior |

## AC status

- [x] Prompt drafted with rationale (`system-prompt.md`, `PROMPT.md`)
- [x] 5 sample sessions against a real KTU module committed as fixtures — **authored v0; regenerate live**
- [x] Hard cap / anti-homework / anti-chat behavior demonstrated in fixtures (p3, p4, p5)
- [ ] Live harness run (`node harness.mjs` — needs authenticated `claude` CLI)
- [ ] Questions rated by one real teacher (`TEACHER-RATING.md` — after live regeneration)
