# Architecture

The maintainability goal: a contributor who has never seen this codebase can add a new syllabus source, LLM provider, or delivery channel **without touching the domain core** — and the domain core can be tested **without a network connection**.

The shape is hexagonal (ports & adapters), with SOLID applied at the boundaries rather than recited in comments.

## Repo layout

```
packages/
  core/          # pure domain — entities, use-cases, ports. Zero framework imports.
  adapters/      # one package per port implementation
    wikisyllabus/  # SyllabusSource over the WikiSyllabus git repo
    claude/        # BriefEngine + QuizGenerator over the Claude API
    commons-git/   # CommonsPublisher — YAML write-back via bot PRs
    ...
apps/
  web/           # Next.js App Router — teacher console + student surface
  bot/           # commons publisher runner (scheduled)
```

## The ports

Every external dependency enters the core through a small interface. These are the seams of the system:

| Port | Responsibility | First adapter |
| --- | --- | --- |
| `SyllabusSource` | Resolve `syllabus_ref` → module content | WikiSyllabus git repo |
| `BriefEngine` | Run the bounded Socratic session; emit distilled questions | Claude |
| `QuestionClusterer` | Questions → canonical clusters | Embedding-based |
| `QuizGenerator` | Module areas + confusion clusters → quiz items | Claude |
| `ModerationFilter` | Screen distilled questions before display | Claude |
| `MessageChannel` | Reach students (push topic, fire quiz) | Web push; WhatsApp later |
| `CommonsPublisher` | Aggregates → YAML → moderated PR | GitHub bot |
| `IdentityProvider` | Pseudonym-on-screen, accountable-in-backend | Magic link |

## SOLID, concretely

- **Single responsibility** — clustering, quiz generation, confusion aggregation, and commons publishing are separate modules with separate reasons to change. A prompt tweak never touches aggregation math; a schema change in the living layer never touches the UI.
- **Open/closed** — new syllabus sources (another university system, a non-WikiSyllabus repo), new LLM providers, and new delivery channels are new adapter packages. Adding one requires zero edits to `core/`.
- **Liskov substitution** — every adapter passes its port's **contract test suite** (`packages/core/src/ports/__contracts__/`). If the mock passes and the real adapter passes, the core cannot tell them apart. New adapters start by running the contract suite.
- **Interface segregation** — ports are small and per-capability. The teacher console depends on the confusion-map port, not on a god-service. No screen imports a port it doesn't call.
- **Dependency inversion** — `core/` depends only on its own port interfaces. Next.js, the Claude SDK, and git live in adapters and apps. Enforced in CI by a lint rule: `packages/core` may not import from `apps/`, `adapters/`, `next`, or any SDK.

## Rules that keep it honest

1. **Core purity is CI-enforced, not promised.** The import-boundary lint rule fails the build.
2. **No LLM calls in core tests.** The core is tested against port fakes; adapters are tested against golden prompts/responses committed to the repo.
3. **Privacy invariants live in the core.** k ≥ 5 aggregation, no per-student quiz rows, transcript ephemerality — these are domain rules with unit tests, not UI conventions. An adapter or screen cannot bypass them because the data it receives has already been aggregated.
4. **One decision, one ADR.** Significant choices get an Architecture Decision Record in `docs/adr/` (use the `engineering:architecture` skill — see [PLAYBOOK.md](PLAYBOOK.md)).

## Stack

TypeScript everywhere. Next.js (App Router) for `apps/web` — matching the Beyond Syllabus platform so contributors move between the two. Minimal runtime dependencies; every addition is justified in the PR that adds it.
