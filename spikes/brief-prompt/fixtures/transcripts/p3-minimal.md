# Brief session transcript — p3-minimal

- Generated: 2026-08-17T23:14:52.721Z · tutor=sonnet student=haiku · live harness run
- Module: CST306 Module 3 (Greedy and Dynamic Programming)
- syllabus_ref: universities/a-p-j-abdul-kalam-technological-university/computer-science-and-design/2019/s06/03.md

---

**Student:** ok opening it now. literally just finished the lab thing

**Tutor:** Nice, back-to-back study session. Activity selection is basically the timetable problem — like picking the max number of non-overlapping showtimes you could hit in one night. Where does your gut say the greedy trick is: pick the shortest one first, or something else?

**Student:** idk greedy one i guess? shortest sounds right

**Tutor:** Makes sense as a guess, but try this: a 1-hour movie from 6-7pm, versus a 30-min one from 6:45-7:15. Shortest picks the 30-min one. Does that actually leave you more room in your night, or less?

**Student:** too tired for that one ngl

**Tutor:** Fair, it's late. Simpler version: that 30-min movie ending at 7:15 blocks you from anything starting before then — even stuff that would've fit. So which matters more for fitting in more activities, how long one takes, or when it frees you up?

**Student:** when it ends

**Tutor:** Exactly — earliest finish time frees up the most room for what's next. That's the whole trick behind activity selection. Now, does that same "always pick greedily" move work for knapsack too, or does something break there?

**Student:** idk breaks probably

**Tutor:** Right, "probably" — that's the edge worth naming. In 0/1 knapsack, grabbing the best value-per-weight item first can leave you with leftover space nothing fits into, so you're stuck below the true best total. That's why DP is needed there instead. Does that distinction — greedy locks in one choice forever, DP keeps options open — feel solid, or still fuzzy?

**Student:** solid. greedy just commits, dp doesn't

**Tutor:** Good stopping point — you actually recovered from both guesses tonight, which tells me you're closer to this than you think. Two things worth asking tomorrow, since I gave you the trick but not the full "why":

1. How do you tell, before you even start a problem, whether it's a greedy one or needs DP?
2. Why does earliest-finish-time greedy actually guarantee the best answer, not just a decent one?

Ask those — they're the kind of thing a proof or a bad-day war story answers way better than I can. Get some sleep.

```json
{
  "engagement": "medium",
  "understood": ["activity selection via earliest finish time", "why 0/1 knapsack breaks under greedy (irrevocable choice vs DP keeping options open)"],
  "confused": ["initial intuition for the greedy criterion in activity selection (guessed shortest duration first)"],
  "questions": [
    {
      "text": "How do I know upfront whether a problem should be solved greedily or needs DP?",
      "why_teacher": "This is a judgment call built from pattern recognition across many problems, not a lookup fact.",
      "tried": "Correctly identified that knapsack breaks greedy after being pushed, but had no general rule for spotting it in advance."
    },
    {
      "text": "Why does picking earliest finish time actually guarantee the optimal answer, not just a good one?",
      "why_teacher": "Requires walking through the exchange-argument proof, which is best done live on a board.",
      "tried": "Correctly picked earliest finish time as the right greedy criterion but only via a concrete example, not a general justification."
    }
  ],
  "flags": []
}
```