# Living Syllabus — Product Spec

**Draft v0.2 · 17 Aug 2026 · Beyond Syllabus · The Purple Movement**
Substrate: [WikiSyllabus](https://github.com/The-Purple-Movement/WikiSyllabus)

---

## Problem

Class time is spent transmitting content students could get anywhere, while the questions students actually have go unasked. The flipped classroom fixes this on paper, and has failed in practice for three reasons: teachers had to author pre-class material, students skipped the pre-work, and teachers walked in blind to who was prepared. AI plus structured syllabi deletes all three failure modes — the pre-work is generated from the syllabus file, it takes ten conversational minutes with a visible output, and the teacher sees the class's preparation as an aggregate before walking in.

## The bet

General AI will always out-explain anything we build. It will never know that *this* student, at *this* college, has *this* module tomorrow at 9am. The defensible asset is the syllabus commons plus the classroom loop — and a design where every classroom that runs the loop makes the next classroom better. We are not building a tutor. We are building the layer that makes any AI institution-aware, and the classroom the place where its output gets tested against a human teacher.

## The session rhythm

The atomic unit is not a chat — it is one cycle of a class, teacher-driven end to end:

1. **Push** — the teacher shares the next topic in one tap. The app suggests the next module from the real syllabus; the teacher confirms. This replaces timetable integration: the teacher *is* the scheduler, and a pushed topic is a small public promise about what the next class covers.
2. **Brief** — each student runs a bounded ~10-minute AI session on that module the night before. Socratic by default: it asks more than it answers, and it ends by distilling the 2–3 questions the student genuinely cannot answer, ranked by "your teacher can answer this better than I can."
3. **Map** — before class, the teacher opens the confusion map: what the class understood, what confused them, the top question clusters. The teacher also gets a **prep brief**: engagement strategies for this topic, informed by what confused the last cohort.
4. **Class** — the lecture shrinks. The claimed questions get asked aloud; the teacher teaches to the room's actual gaps.
5. **Quiz** — one tap fires a quick quiz: ~5 ungraded questions generated from the module's areas *and the confusion clusters that surfaced before class* — so it measures whether the discussion actually resolved the confusion, not generic recall. Default: last five minutes of class (completion). Morning-after delivery is a planned experiment (spaced retrieval).
6. **Clear-up** — quiz results mark each area resolved or unresolved. The next session opens with a five-minute clear-up of what didn't resolve, then the next push. Nothing carries forward silently.

**Teacher effort budget: ≤3 minutes outside class.** Push is one tap. Quiz is one tap (with optional per-question veto). The confusion map reads in under 30 seconds. Any teacher-facing feature that exceeds this budget does not ship.

## Surfaces

### Student — the pre-class brief
A bounded session, not an open chat box. Scoped to one module of the student's real syllabus, pulled from WikiSyllabus by university → branch → semester. The output is something the student carries into a room with a human in it. After class, the same surface delivers the quiz and the student's private results.

### Teacher — the console
Push, prep brief, confusion map, quiz trigger, clear-up card. The confusion map is the one thing no general AI offers, and the reason a teacher distributes the product to 60 students in a single decision.

### Commons — the living layer
Every session is keyed to a WikiSyllabus file path and module. Data aggregates across every classroom teaching the same course: real question banks, recurring misconceptions, questions classrooms consistently fail to answer, quiz-measured resolution rates, and staleness deltas versus industry practice. Written back to the commons as forkable YAML via moderated automated PRs. A teacher at college #41 inherits the misconception map from the forty classrooms before them.

**Coverage as a byproduct:** course missing from WikiSyllabus? Upload the PDF — the AI converts it to the repo's frontmatter format and opens a PR. The commons grows because the product is used.

## Who sees what

The governing principle: **contribution is visible, struggle is private.** A question is a contribution — names can go on it, by choice, at the moment of recognition. Confusion is a state — it is never individual.

| Data | Student sees | Teacher sees | Public living layer |
| --- | --- | --- | --- |
| Brief transcript | Own only (ephemeral, deletable) | Never | Never |
| Questions | Own; class's canonical clusters | Clustered canonical phrasings, unattributed | Clusters, aggregated |
| Question credit | Opt-in claim when picked for class | Claimed names only | Never |
| Confusion map | — | Aggregate, renders only at k ≥ 5 | Aggregate, institution-anonymized |
| Quiz results | Own, private | Areas only — never per-student | Resolution rates, aggregate |

**Anonymous to the room, accountable to the system.** Students are pseudonymous on screen but identified in the backend, so a pattern of abuse is traceable and actionable. The pipeline itself launders most abuse out: raw student text never reaches the teacher — questions are AI-distilled in the session and clustered before display, with a moderation filter in the distillation step. Full anonymity is a free-fire zone; forced transparency is a silence machine; this is the stable point between them.

**Quizzes are diagnostic, never evaluative.** No marks, no per-student reporting, no export to internal assessment. The moment results touch grades, students answer the quiz with another AI in the next tab and the signal becomes fiction.

## Non-goals

- **No open chat-with-your-syllabus box.** It becomes a homework-answer machine within a week and makes us indistinguishable from ChatGPT.
- **No per-student surveillance.** Teachers never see transcripts or individual confusion or individual quiz scores.
- **No grading, proctoring, or assessment.** See above — this is load-bearing, not squeamishness.
- **No replacing the teacher.** The product's entire output is a better classroom hour.
- **No syllabus CMS of our own.** WikiSyllabus's markdown-in-git is the source of truth.

## Adoption & metrics

**Teacher-first, non-negotiable.** One teacher brings 60 students in one decision and enforces the loop. μLearn campus chapters are the beachhead: recruit teachers, not users.

| Kind | Metric | Signal |
| --- | --- | --- |
| **North star** | Teachers who open the confusion map before class, 2+ consecutive weeks | The loop changed classroom behavior |
| Supporting | % of roster completing the brief per session | Students do the pre-work |
| Supporting | Questions asked aloud in class per session | Output survives contact with the room |
| Supporting | % of areas marked resolved by the quiz | The classroom absorbs the gaps |
| Guardrail | Median brief duration ≤ 12 min | Pre-work stays lighter than cramming |
| Guardrail | Quiz completion ≥ 80% when fired in class | The ritual holds |

## Rollout

| Phase | When | Scope | Exit test |
| --- | --- | --- | --- |
| **1 · One classroom** | Now → Sept 2026 | One real class, duct tape allowed | Students do the ten minutes; one teacher changes what they do in class because of the map |
| **2 · The network** | Oct → Nov 2026 | ~10 classrooms via μLearn; quiz loop live; commons keyed to syllabus paths | A teacher uses another classroom's misconception data; north-star metric holds |
| **3 · The record** | Dec 2026 | Outcomes record ships with the first living-syllabus dataset | The dataset is cited outside the movement |

Sprint-level breakdown lives in the [issue backlog](../../issues): epics are labels, sprints are milestones.

## Riskiest assumptions

| Assumption | Risk | Cheapest test |
| --- | --- | --- |
| Students will do 10 minutes the night before | Kills the loop; fights cramming culture | Two-week WhatsApp pilot in one class: manually generated questions at a fixed time. Do they ask them? |
| Teachers will teach to the map | Without behavior change this is a quiz app | Interview the pilot teacher after two weeks: did class time change? |
| Ungraded quizzes get taken honestly | Grades pressure → AI-answered quizzes → fictional signal | Watch pilot completion and wrong-answer rates; a suspiciously perfect class is a red flag, not a win |
| WikiSyllabus coverage is reachable | Empty substrate → generic tutor | Ship PDF→PR conversion in phase 1; measure files added per active classroom |
| Question quality beats what students ask unaided | The product's whole claim | Ask the teacher to blind-rate pilot questions vs. a normal week |

## Data schema — the living layer

Everything keys off `syllabus_ref`: the WikiSyllabus file path, the git commit it was read at (syllabi revise; data must survive revisions), and a module anchor parsed from the markdown headings.

| Entity | Keyed by | Holds |
| --- | --- | --- |
| `syllabus_ref` | path + commit + module | Pointer into WikiSyllabus, e.g. `universities/ktu/computer-science/2019/s06/03.md` @ `8f3c2a1`, module `m2` |
| `classroom` | teacher + syllabus_ref + term | Institution, roster size. No student identities beyond auth |
| `session` | classroom + module + push | The pushed topic; content hash of the generated brief |
| `interaction` | student × session | Engagement level, topic-level confusion signals, questions produced. Transcript ephemeral, student-owned |
| `question` | ulid | Text, pseudonymous author, cluster id, claim status; `drafted → asked → answered \| partial \| unanswered` |
| `quiz` | session | Generated items (area + source cluster), veto record, delivery mode |
| `quiz_result` | session (aggregate) | Per-area resolution: `resolved \| partial \| unresolved`. **No per-student row leaves the student's own view** |
| `confusion_map` | session | Aggregate: understood topics, confused topics, top clusters. Renders only at k ≥ 5 |
| `misconception` | module + cluster | Recurring wrong mental model; evidence count, classroom count |
| `gap_record` | module + cluster | Question that stays unanswered across classrooms; staleness deltas vs. industry. The advocacy dataset |

Written back to the commons as a parallel tree mirroring WikiSyllabus paths — plain YAML in git, appended by bot PRs, human-moderated:

```
living/universities/ktu/computer-science/2019/s06/03/
├── questions.yaml        # clustered, with in-class + quiz outcomes
├── misconceptions.yaml   # recurring wrong models, evidence counts
└── gaps.yaml             # unanswered across classrooms + staleness deltas
```

```yaml
# living/universities/ktu/computer-science/2019/s06/03/questions.yaml
syllabus_ref:
  path: universities/ktu/computer-science/2019/s06/03.md
  commit: 8f3c2a1
  module: m2-transport-layer
clusters:
  - id: q-cc-fairness
    canonical: "Why does TCP treat all flows equally when some
                apps need more bandwidth?"
    asked_count: 41
    classrooms: 7
    in_class: { answered: 23, partial: 9, unanswered: 9 }
    quiz_resolution: { resolved: 5, partial: 1, unresolved: 1 }   # classrooms
  - id: q-quic-vs-tcp
    canonical: "If QUIC is better, why are we still taught TCP
                as the default?"
    asked_count: 28
    classrooms: 6
    tags: [staleness-delta]
```

**Privacy invariants.** Teachers see aggregates, never transcripts. Nothing renders below five participants. The public layer strips institution identity until a college opts in. Students own their interaction history and can delete it.

## Built to last

- **Engineering:** pure domain core, ports for everything external (syllabus source, LLM, clustering, messaging, commons publishing), adapters at the edge. SOLID mapped concretely in [ARCHITECTURE.md](ARCHITECTURE.md); the core's framework-independence is CI-enforced.
- **UX:** every screen passes the hallway test — a stranger completes the core action unaided, first try. Rules and test ritual in [UX-PRINCIPLES.md](UX-PRINCIPLES.md).
- **Process:** each stage of the sprint cycle names the Claude skill that runs it — planning, design, review, QA, shipping, retro. See [PLAYBOOK.md](PLAYBOOK.md).
