import Anthropic from "@anthropic-ai/sdk";
import type { TutorTransport } from "./engine.ts";

/** Live transport over the official SDK. Deliberately thin: the engine and its
 * golden tests own all behavior; this file only moves text. Thinking stays at
 * the model's adaptive default; no sampling parameters (rejected on Claude
 * Sonnet 5 — ADR-0002). */
export class AnthropicTransport implements TutorTransport {
  private readonly client: Anthropic;

  constructor(client: Anthropic = new Anthropic()) {
    this.client = client;
  }

  async complete(request: {
    readonly model: string;
    readonly maxTokens: number;
    readonly system: string;
    readonly messages: readonly { readonly role: "user" | "assistant"; readonly content: string }[];
  }): Promise<string> {
    const response = await this.client.messages.create({
      model: request.model,
      max_tokens: request.maxTokens,
      system: request.system,
      messages: request.messages.map((m) => ({ role: m.role, content: m.content })),
    });

    if (response.stop_reason === "refusal") {
      throw new Error(`tutor model refused (category: ${response.stop_details?.category ?? "unknown"})`);
    }

    return response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("\n");
  }
}
