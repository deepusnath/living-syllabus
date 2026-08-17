# Brief session transcript — p5-drifter

- **AUTHORED FIXTURE (v0)** — both roles written by Claude (Fable 5) while drafting the prompt, following `system-prompt.md` and `personas/p5-drifter.md` strictly. Regenerate live with `harness.mjs` before teacher rating.
- Module: CST306 Module 3 (Greedy and Dynamic Programming)
- syllabus_ref: `universities/a-p-j-abdul-kalam-technological-university/computer-science-and-design/2019/s06/03.md` @ `2d85ffe`
- Demonstrates: **redirect by absorption** — the off-topic interest becomes the module's own example; one clean deflection of the other-course request.

---

**Student:** hii ok so not about class but we're trying to fit 3 movie shows AND lunch on saturday and the timings all clash, its a disaster 😭

**Tutor:** I have excellent news: your Saturday disaster is literally tomorrow's syllabus. Picking the most non-clashing shows from a messy timetable is called activity selection, and it's the first thing in Module 3. So solve it with me: gut instinct — which show do you lock in first?

**Student:** wait what 😂 ok obviously the one that ENDS earliest, then see what still fits after. thats just common sense??

**Tutor:** Your "common sense" is a theorem — earliest finish time first is *provably* the best strategy, and half the class will get it wrong tomorrow by sorting on start times. You're ahead. Now break your own rule: if the 6pm show is the one you'd genuinely riot over missing, does earliest-finish still work?

**Student:** ok before that — can we do SQL instead?? dbms exam next week and thats what im actually scared of

**Tutor:** SQL is next week's fear; tonight costs you ten minutes and tomorrow's class is the payoff — DBMS gets its own brief. Back to your riot show: earliest-finish treats every show as equal. Yours aren't. What breaks?

**Student:** hmm ya. if the must-watch one is LONG, earliest-finish might skip it for two boring short ones. so the rule picks MORE shows but not the BEST saturday

**Tutor:** That sentence is the exact border between greedy and dynamic programming — you just walked across it barefoot. When choices have *weights*, "grab the obvious one" stops working, and you need DP: comparing whole plans, not single picks. Try: how would you even compare "watch the long one" vs "watch two short ones" fairly?

**Student:** lmaooo my roommate just sent the worst meme. ok ok im back. umm... give each show a score and add up? whichever plan totals more wins? but thats like checking every combination, isnt that super slow

**Tutor:** "Isn't that super slow" is the question the entire field asked — and DP's answer (you don't need every combination, only the best plan ending at each point) is tomorrow's big reveal. I'm not spoiling the trick before your teacher does it on the board. Last one: want to guess, or carry it in as your question?

**Student:** carry it! ok this was accidentally interesting. saturday is getting the scores treatment btw

**Tutor:** Saturday is in safe hands. You came in with a scheduling emergency and walked out with the two sharpest questions on tomorrow's topic — ask them out loud, because the "isn't that slow" one especially is the one everyone's thinking. Enjoy the shows you scientifically selected.

```json
{
  "engagement": "high",
  "understood": ["activity selection by earliest finish (intuited unprompted)", "why unweighted greedy picks more-not-best", "weighted case needs whole-plan comparison"],
  "confused": ["how DP avoids checking every combination", "formalizing 'score each plan' beyond brute force"],
  "questions": [
    {
      "text": "When shows (activities) have different importance, adding scores and comparing plans feels like checking every combination — how does DP avoid that without missing the best plan?",
      "why_teacher": "The board reveal of the DP recurrence at the moment of suspense is the class working at its best — an AI answer would just deflate it",
      "tried": "She invented brute-force weighted selection herself and spotted its cost, but couldn't see the shortcut"
    },
    {
      "text": "Earliest-finish-first felt like common sense — how do you actually PROVE a greedy rule is safe instead of just trusting the vibe?",
      "why_teacher": "Exchange arguments are exactly what a teacher paces slowly, and she'll trust it more having bet her Saturday on the rule",
      "tried": "She applied the rule correctly by instinct but had no idea why it's guaranteed"
    }
  ],
  "flags": []
}
```
