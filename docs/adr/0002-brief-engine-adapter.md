# ADR-0002: BriefEngine port shape and the Claude adapter

**Status:** Accepted
**Date:** 2026-08-17
**Deciders:** Deepu (project lead)

## Context

Issue #3 implements the LLM port: the `BriefEngine` that runs the bounded Socratic brief, with a Claude adapter and golden tests that never touch the network. The prompt is the one validated by the #4 spike (v0.2.1). Three decisions needed recording.

## Decision

**1. Port refined to a deliver/listen IO pair.** The scaffold's stub took one `studentTurn(tutorText) => reply` callback, which conflates two acts: the final tutor turn (the close) delivers text but must not await a reply. The port now takes `BriefIO { deliver(tutorText), listen() }` — `deliver` fires for every tutor turn including the close, `listen` only while the session continues. This is a pre-implementation refinement of an unimplemented stub, not a breaking change to working code.

**2. Transport injection for golden replay.** The adapter's engine depends on a one-method `TutorTransport` interface; the real `AnthropicTransport` wraps `@anthropic-ai/sdk`, and tests inject a replay transport that returns recorded tutor turns from the live spike run. Consequence: golden fixtures exercise the *engine's* mechanics (loop, turn cap, parsing, delivery) against real model text with zero network; the SDK wrapper itself stays thin enough to verify by reading.

**3. Model default `claude-sonnet-5`, env-overridable; no sampling parameters.** The product's economics (grant-funded free tier — spec discussion) and the #4 live spike both put the tutor on Sonnet-tier; `LS_BRIEF_MODEL` / `LS_BRIEF_MAX_TOKENS` / `LS_BRIEF_MAX_TUTOR_TURNS` override per environment (the issue's AC). `temperature`/`top_p`/`top_k` are rejected on Claude Sonnet 5, so the config deliberately has no sampling surface — steering lives in the prompt, which ships as a versioned markdown asset copied from the spike.

## Options Considered

- **Keep the single-callback port** — rejected: forces a fake final "reply" or skips delivering the close.
- **Mock the whole SDK in tests** — rejected: couples tests to SDK internals; a transport seam is smaller and is also the seam a future non-Anthropic provider implements.
- **Default to an Opus-tier model** — rejected for this port: the brief is a high-volume student-facing loop with short turns; capability-sensitive calls (quiz generation may differ) choose their own model when that port lands.

## Consequences

- Easier: replaying any future live transcript as a regression fixture; swapping providers (new transport, same engine).
- Harder: two interfaces (port IO + adapter transport) to keep straight — mitigated by both being one file each.
- Revisit when: the quiz generator port lands (may want a shared transport), or per-classroom model routing appears.

## Action Items

1. [x] Update `BriefEngine`/`BriefIO` in core; adapter + golden tests in `packages/adapters/claude`
2. [ ] Re-point the spike harness at the adapter (follow-up; harness still drives the CLI directly)
