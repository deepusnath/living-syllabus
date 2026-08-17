# Brief session transcript — p2-average

- **AUTHORED FIXTURE (v0)** — both roles written by Claude (Fable 5) while drafting the prompt, following `system-prompt.md` and `personas/p2-average.md` strictly. Regenerate live with `harness.mjs` before teacher rating.
- Module: CST306 Module 3 (Greedy and Dynamic Programming)
- syllabus_ref: `universities/a-p-j-abdul-kalam-technological-university/computer-science-and-design/2019/s06/03.md` @ `2d85ffe`

---

**Student:** hey. match is on so lets make this quick lol

**Tutor:** Deal — ten minutes, and the match is actually useful. A captain setting a batting order is making greedy choices: best option now, hope it works out overall. Tomorrow is about when that works and when it backfires. Quick start: what does "greedy algorithm" mean to you?

**Student:** take the best option now basically. like huffman coding does that right

**Tutor:** Right, and Huffman is the star example. Here's the thing though — greedy usually *feels* right and is often wrong. Huffman is special because it's *guaranteed* optimal. Why do you think that guarantee holds for Huffman?

**Student:** hmm honestly it just works?? sir showed it and the tree came out smallest. never thought about why

**Tutor:** "It just works" is exactly the gap between knowing an algorithm and owning it — hold that thought, it's going on your list. Try an easier one first: activity selection. Bunch of activities with start and end times, pick the maximum number that don't clash. What would you sort by?

**Student:** sort by start time obviously. take whichever starts first then keep going

**Tutor:** Confident answer — let's test it. Two options: one activity running 9am to 5pm, or three short ones at 10, 12, and 3. Sorting by start time grabs which one first, and what happens after?

**Student:** oh. it takes the 9-5 one and then everything clashes with it. thats bad lol. so... sort by ending time?? take whatever ends first?

**Tutor:** You just fixed your own algorithm in one message — that's the whole game. Finish time, not start time. Now the harder half of tomorrow: dynamic programming. One honest sentence, what is it?

**Student:** using arrays to store answers so you dont repeat work? thats what the code looked like anyway

**Tutor:** That's what DP *looks like* — arrays are the costume, not the idea. The idea is about how a problem breaks into pieces. So here's my question back: if DP is just "store answers in arrays", why can't every problem be made faster that way?

**Student:** hmm no idea. i guess some problems dont... repeat? idk this is where it gets abstract for me

**Tutor:** You actually said the key word — "repeat" — and then walked past it. That's a carried question, not a failure. Time to wrap. You're taking three questions to class, and honestly the finish-time one you already answered yourself — so ask the other two and enjoy the match. You came in low-effort and figured out activity selection live. Decent innings.

```json
{
  "engagement": "medium",
  "understood": ["greedy as take-best-now", "activity selection by finish time (self-corrected)", "Huffman as greedy example"],
  "confused": ["why Huffman is guaranteed optimal", "what makes a problem DP-able", "DP beyond 'arrays storing answers'"],
  "questions": [
    {
      "text": "Huffman feels like it 'just works' — what actually guarantees it gives the smallest tree, and do we need to prove that in the exam?",
      "why_teacher": "The exchange-argument proof is exactly the kind of thing a teacher paces on the board and knows how KTU examines",
      "tried": "He could run the algorithm but had never once asked why it's optimal"
    },
    {
      "text": "If DP is just storing answers in arrays, why can't every problem be made faster that way — what has to 'repeat' for DP to work?",
      "why_teacher": "The teacher can contrast one problem where it helps and one where it doesn't, live, at the class's level",
      "tried": "He said 'some problems don't repeat' and couldn't take it further"
    }
  ],
  "flags": []
}
```
