# Brief session transcript — p1-diligent

- **AUTHORED FIXTURE (v0)** — both roles written by Claude (Fable 5) while drafting the prompt, following `system-prompt.md` and `personas/p1-diligent.md` strictly. Regenerate live with `harness.mjs` before teacher rating.
- Module: CST306 Module 3 (Greedy and Dynamic Programming)
- syllabus_ref: `universities/a-p-j-abdul-kalam-technological-university/computer-science-and-design/2019/s06/03.md` @ `2d85ffe`

---

**Student:** hi, tomorrow is greedy and DP right? i studied a bit already

**Tutor:** It is — and both are really answers to the same question: when you're choosing step by step, when can you trust the choice in front of you? You said you studied a bit. Tell me what dynamic programming means, in your own words — not the textbook's.

**Student:** ok so DP is when a problem has overlapping subproblems and optimal substructure. thats the definition we were given

**Tutor:** That's the definition, word-perfect. Now the test: "overlapping subproblems" — can you give me one actual example of two subproblems that overlap? Any problem you like.

**Student:** hmm. like in fibonacci fib(5) needs fib(4) and fib(3), and fib(4) also needs fib(3)?? so fib(3) comes twice... is that it?

**Tutor:** That's exactly it — fib(3) gets asked twice, so you save the answer instead of recomputing. You just explained memoization. Quick check: is that the same thing as tabulation, or different?

**Student:** i thought memoization and tabulation are just two names for the same trick honestly

**Tutor:** They give the same answers, but one starts from the top and remembers; the other builds a table from the bottom up. Where they differ is *which* subproblems get computed. Don't let me spoil it — that's worth 30 seconds of tomorrow's class. Next edge: you did fractional knapsack in tutorial. Why can't the same greedy trick handle 0/1 knapsack?

**Student:** i tried this one!! i know greedy by value/weight ratio works for fractional. for 0/1 it "doesn't work" but honestly i dont know WHY. i just know the answer is DP

**Tutor:** Good — you know *that* it fails but not *why*, and you noticed. That's the real gap. Try this: two items, and you can't cut them. What could go wrong if you grab the best-ratio one first?

**Student:** ohh maybe the best ratio item is small and blocks... no wait. maybe taking it leaves space you cant fill? like the leftover space gets wasted?? im not sure im saying it right

**Tutor:** You're circling the right idea — "leftover space gets wasted" is the heart of it, and you can't quite pin it. Perfect question to carry. Last probe: optimal binary search trees are on tomorrow's list too. One honest sentence — what do you know about them?

**Student:** honestly? the name scares me and i know nothing else 😅 also i keep wondering how in the exam i'd even KNOW a problem is DP and not greedy before wasting 20 minutes

**Tutor:** That last sentence is the best question you've asked all night — write it down exactly like that. Here's what you're carrying tomorrow: three real questions, ranked. Ask the first one early — half your class is stuck on the same thing, they just haven't noticed yet. You did the work tonight; tomorrow, collect.

```json
{
  "engagement": "high",
  "understood": ["overlapping subproblems", "memoization idea", "greedy for fractional knapsack"],
  "confused": ["memoization vs tabulation difference", "why greedy fails 0/1 knapsack", "optimal binary search trees", "recognizing DP vs greedy problems"],
  "questions": [
    {
      "text": "In the exam, how do I recognize a problem is DP and not greedy BEFORE spending 20 minutes on the wrong one?",
      "why_teacher": "This is exam judgment from years of setting and grading papers — an AI gives a checklist, the teacher knows which problems actually appear",
      "tried": "She has the definitions but admitted she has no test for choosing between the two approaches"
    },
    {
      "text": "For 0/1 knapsack, I feel like the greedy answer 'wastes leftover space' — can you show a two-item example where that actually happens?",
      "why_teacher": "A worked counterexample on the board, at the moment of confusion, beats any text explanation",
      "tried": "She reasoned her way to 'leftover space gets wasted' but couldn't construct the failing case"
    },
    {
      "text": "Is memoization top-down and tabulation bottom-up just style, or do they compute different things?",
      "why_teacher": "The teacher can tie it to which one the KTU exam expects and when each matters in practice",
      "tried": "She believed they were two names for the same trick until probed"
    }
  ],
  "flags": []
}
```
