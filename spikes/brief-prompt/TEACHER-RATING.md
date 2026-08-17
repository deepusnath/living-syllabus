# Teacher blind-rating sheet — AC 2

**Do this only after regenerating the transcripts live** (`node harness.mjs`) — rating authored fixtures would validate the author, not the product.

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

## Questions from the v0 sessions (replace with live-run output)

| # | Question | Session |
| --- | --- | --- |
| 1 | In the exam, how do I recognize a problem is DP and not greedy BEFORE spending 20 minutes on the wrong one? | p1 |
| 2 | For 0/1 knapsack, I feel like the greedy answer "wastes leftover space" — can you show a two-item example where that actually happens? | p1 |
| 3 | Is memoization top-down and tabulation bottom-up just style, or do they compute different things? | p1 |
| 4 | Huffman feels like it "just works" — what actually guarantees it gives the smallest tree, and do we need to prove that in the exam? | p2 |
| 5 | If DP is just storing answers in arrays, why can't every problem be made faster that way — what has to "repeat" for DP to work? | p2 |
| 6 | Can you go through the knapsack example from last class again, a bit slower? | p3 |
| 7 | In matrix chain, is there any intuition for which split will win before computing the whole table, or is trying everything the entire point? | p4 |
| 8 | The final matrix is the same either way — why does the ORDER of multiplying change the cost this much? | p4 |
| 9 | When activities have different importance, comparing plans feels like checking every combination — how does DP avoid that without missing the best plan? | p5 |
| 10 | Earliest-finish-first felt like common sense — how do you actually PROVE a greedy rule is safe instead of just trusting the vibe? | p5 |

## Record the outcome

Add the teacher's ratings, the forced-choice answer, and any verbatim reactions to RESULTS.md. If the AI questions lose, the spike fails honestly — the prompt gets redesigned, not the bar.
