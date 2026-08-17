# Living Syllabus — agent guide

Read `docs/SPEC.md` before product work and `docs/ARCHITECTURE.md` before writing code.

Hard rules:
- `packages/core` stays pure: no imports from `apps/`, `adapters/`, `next`, or any SDK. CI enforces this; don't fight it, add an adapter.
- Privacy invariants (k ≥ 5 aggregation, no per-student quiz results to teachers, ephemeral transcripts) are domain rules in `core/` with tests. Never re-implement or bypass them at the UI layer.
- Quizzes are diagnostic, never graded. Do not add scoring, ranking, or export of individual results.
- UX changes must satisfy `docs/UX-PRINCIPLES.md` (hallway test, one primary action per screen, classroom language not system language).
- Follow `docs/PLAYBOOK.md` for which skill to invoke at each stage; issues name their skill.
- Backlog discipline: epics are labels, sprints are milestones; reference the issue in every PR.
