# ADR-0001: Monorepo tooling for the SOLID scaffold

**Status:** Accepted
**Date:** 2026-08-17
**Deciders:** Deepu (project lead)

## Context

docs/ARCHITECTURE.md commits us to a hexagonal monorepo — a pure `packages/core`, adapter packages, and apps — with the core's framework-independence *CI-enforced, not promised*. This ADR picks the tooling that delivers that with the fewest moving parts. Constraints: the project's minimal-dependency ethos (every dep justified in the PR that adds it), contributors moving between this repo and the Next.js-based beyond-syllabus platform, and open-source contributors who must be productive without learning bespoke tooling.

## Decision

npm workspaces + TypeScript with Node's native type stripping + `node --test` + ESLint 9 flat config using `no-restricted-imports` as the boundary enforcer. No build step for core and adapters (type-stripped TS runs directly); `tsc --noEmit` is the type gate.

## Options Considered

### Option A: npm workspaces + native Node (chosen)

| Dimension | Assessment |
|-----------|------------|
| Complexity | Low — zero orchestration tooling; node ≥23.6 runs `.ts` directly |
| Cost | Zero runtime deps for core; devDeps: typescript, eslint, typescript-eslint |
| Scalability | Fine to ~dozens of packages; revisit if build caching ever matters |
| Team familiarity | High — npm and eslint are universal; nothing bespoke to learn |

**Pros:** no build step for core/adapters; contract tests and invariant tests run with `node --test` out of the box; workspace symlinks resolve to real paths, so type stripping works across packages.
**Cons:** type stripping forbids enums/namespaces (mitigated: `erasableSyntaxOnly` makes this a compile-time rule — and unions are better anyway); no task caching.

### Option B: pnpm + turborepo + vitest

| Dimension | Assessment |
|-----------|------------|
| Complexity | Medium — two more tools, config, and a cache to reason about |
| Cost | More devDeps; faster CI at scale we don't have |
| Scalability | Better beyond ~30 packages or slow builds |
| Team familiarity | Mixed — common in industry, not universal among student contributors |

**Pros:** faster installs, task caching, watch-mode DX.
**Cons:** violates the minimal-deps ethos for no present benefit; every contributor needs pnpm installed.

### Option C: dependency-cruiser for boundary enforcement (instead of ESLint rule)

**Pros:** richer dependency-graph rules, diagrams.
**Cons:** a whole tool for what one well-scoped `no-restricted-imports` block expresses; the ESLint rule also runs in editors, failing at keystroke time, not CI time.

## Trade-off Analysis

The scaffold's only hard requirement is that the boundary rule *cannot be promised* — it must fail a build. ESLint's `no-restricted-imports`, scoped to `packages/core/src/**`, does this and is itself verified by a fixture test that lints a deliberately-violating file and asserts the failure (so the rule breaking silently is also caught). Everything else — package manager, test runner — is chosen to minimize what a first-time contributor must install or understand: clone, `npm install`, `npm test`. When the repo outgrows this (build caching, many packages), migrating npm workspaces → pnpm/turbo is mechanical; the reverse migration would be sunk ceremony.

## Consequences

- Easier: onboarding (stock npm), running any single test file (`node --test path`), editor-time boundary feedback.
- Harder: no TS enums/namespaces anywhere shared with core (enforced by `erasableSyntaxOnly`); apps/web keeps its own Next-flavored tsconfig apart from the base.
- Revisit when: CI exceeds ~5 minutes, package count strains flat npm workspaces, or an adapter needs a real build artifact.

## Action Items

1. [x] Scaffold per docs/ARCHITECTURE.md with the boundary rule and its fixture test
2. [x] CI: lint + typecheck + test on every PR
3. [ ] Add contract-test suites per port as adapters land (Sprint 0–1 stories)
