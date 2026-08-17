# Development Playbook

Every stage of the sprint cycle names the Claude skill that runs it. Issues in the backlog reference these by name (e.g. "Skill: `/design-shotgun`"), so anyone picking up an issue knows the workflow before writing a line. Skills marked `gstack` come from the gstack suite; others are plugin skills.

## The sprint cycle

| Stage | Skill | What it does here |
| --- | --- | --- |
| **Explore an idea** | `/office-hours`, `product-brainstorming` | Stress-test before it becomes work. This spec came out of one of these sessions. |
| **Spec a feature** | `/spec` | Turn vague intent into a precise, executable spec — for any epic bigger than one issue. |
| **Review the plan** | `/autoplan` | Runs CEO, engineering, design, and DX plan reviews sequentially with auto-decisions. Use before committing a sprint to the milestone. Individually: `/plan-ceo-review`, `/plan-eng-review`, `/plan-design-review`, `/plan-devex-review`. |
| **Plan the sprint** | `sprint-planning` | Size the milestone against real capacity; mark P0 vs stretch. |
| **Record a decision** | `engineering:architecture` | Any port added, boundary moved, or dependency taken gets an ADR in `docs/adr/`. |

## Building

| Stage | Skill | What it does here |
| --- | --- | --- |
| **New UI surface** | `/design-shotgun` → `/design-html` | Generate variants, compare, then production-quality HTML/CSS. Never build a screen from the first idea. |
| **Guardrails while coding** | `/careful`, `/freeze` | Destructive-command warnings; scope edits to the package you're in (respects the core-purity boundary). |
| **Stuck on a bug** | `/investigate` | Systematic root-cause debugging instead of guess-and-check. |
| **Capture a lesson** | `/learn` | Project learnings persist for the next contributor and the next Claude session. |

## Before merge — the quality gate

Run in this order; each catches what the previous can't:

1. `/review` (gstack) or `/code-review` — correctness, then SOLID boundary check: did anything leak into `core/`?
2. `security-review` — anything touching identity, pseudonymity, or the k ≥ 5 invariants.
3. `/design-review` — visual consistency, spacing, AI-slop patterns, slow interactions.
4. `/qa` — drive the real app headless, exercise the loop end to end, fix what breaks. `/qa-only` for report-only.
5. **Hallway test** (humans, not skills) — 3–5 strangers on the new surface. Failures become `hallway-fail` issues. See [UX-PRINCIPLES.md](UX-PRINCIPLES.md).

## Shipping

| Stage | Skill | What it does here |
| --- | --- | --- |
| **Ship** | `/ship` | Merge base, tests, diff review, version bump, changelog, PR. |
| **Deploy** | `/land-and-deploy` | Land and roll out (configure once with `/setup-deploy`). |
| **Watch it** | `/canary` | Post-deploy monitoring — especially before a class session fires. |
| **Performance** | `/benchmark` | Regression detection; the brief must start in <3s on a cheap phone. |

## After the sprint

| Stage | Skill | What it does here |
| --- | --- | --- |
| **Retro** | `/retro` | Weekly engineering retrospective against the milestone. |
| **Document** | `/document-release`, `/document-generate` | Update docs from what shipped; generate what's missing. |
| **Read the numbers** | `metrics-review` | North star: teachers opening the map before class. Weekly. |
| **Pilot feedback** | `synthesize-research` | Turn teacher interviews and student feedback into ranked findings that reshape the backlog. |
| **Reprioritize** | `roadmap-update` | Move issues between milestones with reasons, not vibes. |

## Standing rules

- The backlog is the source of truth: epics are labels, sprints are milestones. Work not in an issue doesn't exist.
- Every PR references its issue; every issue names its epic and sprint.
- Quality gates are not optional under deadline pressure — that is exactly when they pay for themselves.
