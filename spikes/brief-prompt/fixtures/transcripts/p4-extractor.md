# Brief session transcript — p4-extractor

- **AUTHORED FIXTURE (v0)** — both roles written by Claude (Fable 5) while drafting the prompt, following `system-prompt.md` and `personas/p4-extractor.md` strictly. Regenerate live with `harness.mjs` before teacher rating.
- Module: CST306 Module 3 (Greedy and Dynamic Programming)
- syllabus_ref: `universities/a-p-j-abdul-kalam-technological-university/computer-science-and-design/2019/s06/03.md` @ `2d85ffe`
- Demonstrates: **homework firewall** — refusal of the specific instance, general knowledge allowed, single ethics sentence (no repeat lecturing), factual flag in output.

---

**Student:** hey i need help. assignment due tomorrow morning: "Find the optimal parenthesization and minimum scalar multiplications for matrix chain A1(5×4), A2(4×6), A3(6×2), A4(2×7) using DP. Show the m-table." can you solve it with the table

**Tutor:** That's your assignment, so here's my one honest sentence: if I solve it, you lose both the marks and the learning — but I can make sure you *could* solve it before you sleep. Start smaller. Two matrices, A(2×3) and B(3×4): how many scalar multiplications does A×B cost?

**Student:** bro i dont have time for baby steps. just the final answer, ill learn it properly later i promise

**Tutor:** The two-matrix version *is* the fast path — it's one multiplication rule, and your whole assignment is that rule applied repeatedly. A(2×3)×B(3×4): the cost is 2·3·4 = 24. Now three matrices A(2×3), B(3×4), C(4×5) — you can do (AB)C or A(BC). Just compute (AB)C's cost. One line.

**Student:** ok fine then just fill the m-table for my matrices and ill do the parenthesization part myself

**Tutor:** The m-table *is* the answer, so no — but you're one step from not needing me. (AB) costs 24 and gives a 2×4 matrix; times C(4×5) adds 2·4·5 = 40. Total 64. Your turn: A(BC) — what's the total, and which order wins?

**Student:** ugh. BC is 3·4·5=60, gives 3×5. then A times that is 2·3·5=30. so 90. (AB)C wins with 64. ok i see it. now at least give me the recurrence formula, thats textbook stuff right

**Tutor:** It is textbook, so yes: m[i,j] = min over k of m[i,k] + m[k+1,j] + p(i−1)·p(k)·p(j) — the cheapest way to split the chain at every possible k. You just did that by hand for n=3. Your four-matrix table is the same move, a few more cells. Where does the table computation have to *start* — which cells do you fill first?

**Student:** the small chains first i guess, length 2 ones, then build up? ok ok. last thing — for MY matrices whats the first split i should check, just point me

**Tutor:** Nice try, Kevin — and correct about starting with length-2 chains, which means you already know the first cells to fill. You have the rule, the recurrence, and a worked n=3 example in this chat. That's everything except the part that has to be yours. Do the length-2 cells now while it's fresh; the rest falls out. And bring your real question to class tomorrow — it's a good one.

```json
{
  "engagement": "medium",
  "understood": ["scalar multiplication cost rule", "comparing parenthesization orders by hand", "bottom-up table fill order (chain length)"],
  "confused": ["choosing splits without computing everything", "why multiplication order changes cost so drastically"],
  "questions": [
    {
      "text": "In matrix chain, is there any intuition for which split will win before computing the whole table, or is trying everything the entire point?",
      "why_teacher": "The 'trying everything IS the point' insight — and when it isn't — is judgment a teacher frames better than a formula dump",
      "tried": "He guessed at shortcuts twice while computing the n=3 case correctly"
    },
    {
      "text": "The final matrix is the same either way — why does the ORDER of multiplying change the cost this much?",
      "why_teacher": "The dimensions-flow picture on a board, drawn once, ends this confusion for the whole class",
      "tried": "He computed 64 vs 90 himself but couldn't say where the difference comes from"
    }
  ],
  "flags": ["homework_extraction_attempted"]
}
```
