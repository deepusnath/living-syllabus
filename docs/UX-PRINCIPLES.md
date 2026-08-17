# UX Principles

The bar: **the hallway test.** Pull a stranger from the hallway — a first-year student, or a professor who has taught for thirty years and never used an AI tool — hand them the app cold, and they complete the core action unaided, first try, in under a minute. No onboarding video. No training session. No manual.

If a screen needs explaining, the screen is wrong, not the user.

## The two home screens

Each side of the app has exactly one primary action, and the home screen *is* that action:

- **Teacher home = "Push next topic."** One big button, pre-filled with the next module from the syllabus. Everything else — prep brief, confusion map, quiz trigger — appears when it's relevant, not before.
- **Student home = tonight's brief.** One card: the topic, the time it takes, a start button. After class it becomes the quiz; after that, their private result.

## Rules

1. **One primary action per screen.** If a screen has two calls to action, split it or cut one.
2. **Speak classroom, not system.** "What confused the class," never "clusters." "Tomorrow's topic," never "session push." The word on the button is the word a teacher would say aloud.
3. **Every number explains itself.** "31 of 47 prepared" — never a bare "66%". A metric without its sentence is a support ticket.
4. **Empty states teach.** The first-run screen is the tutorial: it shows what will be here and offers the one action that fills it. Nobody reads docs; everybody reads the screen in front of them.
5. **Progressive disclosure.** The teacher sees push → map → quiz as the rhythm unfolds, not a dashboard of twelve widgets on day one.
6. **Mobile-first, low-bandwidth-first.** Students are on phones, often on hostel Wi-Fi. The brief must work on a three-year-old Android over 3G.
7. **Respect the effort budgets.** Teacher: ≤3 minutes outside class, every action one tap. Student: brief ≤ 12 minutes hard cap, quiz ≤ 3 minutes.
8. **Trust is a UI feature.** "Your teacher sees the class, never you" is written where the student can see it, every time it's true. The claim-your-question moment is explicit and reversible.
9. **Accessible by default.** Keyboard navigable, screen-reader labeled, WCAG AA contrast in both themes. English first; Malayalam localization planned.

## The test ritual

- **Every sprint**, run the hallway test on whatever shipped: 3–5 people who have never seen the app (μLearn volunteers, not teammates). Pass = 4 of 5 complete the core action unaided. Every failure becomes an issue labeled `hallway-fail` — these are P0 UX bugs, not polish.
- **Design work flows through the skills** (see [PLAYBOOK.md](PLAYBOOK.md)): `/design-consultation` established the system; `/design-shotgun` generates variants before building a new surface; `/design-review` audits what shipped; `/qa` exercises the flows end-to-end.
