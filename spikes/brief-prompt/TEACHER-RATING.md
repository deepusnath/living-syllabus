# Teacher blind-rating sheet — AC 2

The questions below are **live harness output** (2026-08-17, tutor=sonnet): this sheet is ready to run with a real teacher.

## Protocol

1. Pick a teacher who has taught CST306 (or any algorithms course) to a real class.
2. Collect 8–10 questions students asked **unaided** in a normal week on greedy/DP — from memory, notes, or by asking a colleague. Write them on the same sheet.
3. Shuffle them together with the AI-session questions below. Remove the source labels. Hand the mixed list over.
4. For each question, the teacher rates 1–5:
   - **Class value** — if asked aloud, would answering it improve the hour for everyone?
   - **Engagement** — does it show the student actually wrestled with the material?
   - **Teacher advantage** — can you answer it meaningfully better than a search engine or AI could?
5. Then one forced choice, after revealing nothing: *"If a class walked in with the top half of this list, would tomorrow's lecture change?"*

**Pass bar for the spike:** AI-session questions rate at or above the unaided set on all three scales, and the forced-choice answer is yes.

## Questions from the live sessions (2026-08-17 run)

| # | Question | Session |
| --- | --- | --- |
| 1 | Is there a trick for holding (i,j) ranges in your head, or does everyone trip on that jump from 1D to 2D subproblems at first? | p1 |
| 2 | How do you tell upfront whether a new problem needs 2D range subproblems like matrix chain, or 1D ones like knapsack? | p1 |
| 3 | You showed us earliest-finish-time works for activity selection — but how do we actually know it's optimal, not just a rule that happens to work? | p2 |
| 4 | Why does grabbing the most valuable item first fail for knapsack when it's basically the same "greedy pick" idea that worked for scheduling? | p2 |
| 5 | How do I know upfront whether a problem should be solved greedily or needs DP? | p3 |
| 6 | Why does picking earliest finish time actually guarantee the optimal answer, not just a good one? | p3 |
| 7 | How do I know before trying whether a problem needs DP instead of greedy, or do I just have to watch greedy fail? | p4 |
| 8 | I filled the table bottom-up because smaller chains have to exist first — could I do this recursively with memoization instead, and does it matter which I use? | p4 |
| 9 | Matrix chain, knapsack, and optimal BST all use this same split-and-combine DP pattern, but Huffman and activity selection are greedy — what's the thread tying this whole module together? | p4 |
| 10 | How do you actually know what shape your DP table should be before you start — is that just practice, or is there a real way to figure it out from the problem? | p5 |
| 11 | Is there a way to tell ahead of time if greedy will even work on a problem, or do you just try it and watch it break like knapsack did? | p5 |

Note for the facilitator: #2, #5, #7, and #11 are convergent variants of the module's central question (greedy-vs-DP recognition) — that convergence is itself confusion-map signal. The p3 questions carry a caveat recorded in RESULTS.md: they were tutor-synthesized under low engagement (a v0.1 defect, fixed in v0.2), so weight them accordingly.

## Record the outcome

Add the teacher's ratings, the forced-choice answer, and any verbatim reactions to RESULTS.md. If the AI questions lose, the spike fails honestly — the prompt gets redesigned, not the bar.
