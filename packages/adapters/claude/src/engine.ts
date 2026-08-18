import type { BriefEngine, BriefIO, BriefOutcome, ModuleContent } from "@living-syllabus/core";
import { BriefOutputContractError, buildBriefSystemPrompt, findMachineBlock, parseBriefOutcome, stripMachineBlock } from "./prompt.ts";

/** The seam golden tests replay through (ADR-0002): one call, tutor text out.
 * The live implementation is AnthropicTransport. */
export interface TutorTransport {
  complete(request: {
    readonly model: string;
    readonly maxTokens: number;
    readonly system: string;
    readonly messages: readonly { readonly role: "user" | "assistant"; readonly content: string }[];
  }): Promise<string>;
}

export interface BriefEngineConfig {
  readonly model: string;
  /** Per-turn output cap. Tutor turns are ≤75 words; the distill turn carries
   * the machine block — 2048 gives both ample room. */
  readonly maxTokensPerTurn: number;
  /** The prompt's arc budget; one forced-distill turn is added beyond it. */
  readonly maxTutorTurns: number;
}

/** AC (issue #3): model id and parameters configurable per environment.
 * No sampling parameters by design — they are rejected on Claude Sonnet 5. */
export function briefConfigFromEnv(env: Record<string, string | undefined> = process.env): BriefEngineConfig {
  return {
    model: env["LS_BRIEF_MODEL"] ?? "claude-sonnet-5",
    maxTokensPerTurn: Number(env["LS_BRIEF_MAX_TOKENS"] ?? 2048),
    maxTutorTurns: Number(env["LS_BRIEF_MAX_TUTOR_TURNS"] ?? 8),
  };
}

const KICKOFF = "The student has just opened tonight's brief. Begin the session now.";
const FORCED_DISTILL =
  "SYSTEM NOTE: the turn budget is exhausted. Close the session now — plain-language close, then the machine block.";

export class ClaudeBriefEngine implements BriefEngine {
  private readonly transport: TutorTransport;
  private readonly config: BriefEngineConfig;

  constructor(transport: TutorTransport, config: BriefEngineConfig = briefConfigFromEnv()) {
    this.transport = transport;
    this.config = config;
  }

  async runBrief(module: ModuleContent, io: BriefIO): Promise<BriefOutcome> {
    const system = buildBriefSystemPrompt(module);
    const messages: { role: "user" | "assistant"; content: string }[] = [{ role: "user", content: KICKOFF }];

    for (let tutorTurn = 1; tutorTurn <= this.config.maxTutorTurns + 1; tutorTurn++) {
      const forced = tutorTurn > this.config.maxTutorTurns;
      if (forced) messages.push({ role: "user", content: FORCED_DISTILL });

      const tutorText = await this.transport.complete({
        model: this.config.model,
        maxTokens: this.config.maxTokensPerTurn,
        system,
        messages,
      });
      messages.push({ role: "assistant", content: tutorText });

      const block = findMachineBlock(tutorText);
      await io.deliver(stripMachineBlock(tutorText));

      if (block !== null) return parseBriefOutcome(block);
      if (forced) break;

      messages.push({ role: "user", content: await io.listen() });
    }

    throw new BriefOutputContractError(
      `no machine block after ${this.config.maxTutorTurns} turns plus a forced distill`,
    );
  }
}
