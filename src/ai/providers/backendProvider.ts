import type { AIRunRequest, AIRunResult } from "../aiTypes";
import { generateAIText } from "@/lib/ai/providers";

function stringifyInput(value: unknown) {
  if (typeof value === "string") return value;
  if (value === undefined || value === null) return "";
  return JSON.stringify(value, null, 2);
}

function profileForTask(request: AIRunRequest) {
  if (request.metadata?.profile) return String(request.metadata.profile) as any;
  if (["investor_report", "autonomous_simulation"].includes(request.task)) return "premium";
  if (request.task === "draft_followup" || request.task === "score_lead") return "cheap";
  return "balanced";
}

function providerUsedFromBackend(provider?: string): AIRunResult["providerUsed"] {
  if (provider === "openai") return "openai";
  if (provider === "claude") return "claude";
  return "backend";
}

function buildMockFallback(request: AIRunRequest) {
  if (request.task === "draft_followup") {
    return "Thanks for your interest. I wanted to follow up, answer any questions, and see if there is a good next step we can help with.";
  }

  if (request.task === "score_lead") {
    return "This lead should be reviewed based on recent activity, contact completeness, and pipeline status.";
  }

  if (request.task === "campaign_ideas") {
    return "Create a short review-gated campaign for the most engaged segment, using one clear offer and a direct call to action.";
  }

  if (request.task === "pipeline_analysis") {
    return "Review stale open deals, prioritize high-value opportunities, and schedule follow-up tasks for leads without recent communication.";
  }

  return "AI is temporarily unavailable. Use the deterministic SynaptiReach recommendation set and try again later.";
}

function mockFallbackAllowed(request: AIRunRequest) {
  return request.metadata?.allowMockFallback === true;
}

export const backendProvider = {
  name: "backend" as const,
  local: false,
  async run(request: AIRunRequest): Promise<AIRunResult> {
    const messages =
      request.messages?.length
        ? request.messages
        : [
            {
              role: "system" as const,
              content:
                "You are SynaptiReach's secure backend AI provider. Use only supplied data and keep output concise.",
            },
            {
              role: "user" as const,
              content: JSON.stringify({
                task: request.task,
                input: stringifyInput(request.input),
                context: stringifyInput(request.context),
                mode: request.mode,
                metadata: request.metadata,
              }),
            },
          ];

    try {
      const result = await generateAIText(messages, {
        profile: profileForTask(request),
      });

      return {
        text: result.text,
        providerUsed: providerUsedFromBackend(result.provider),
        local: false,
        fallbackUsed: result.fallback_used,
        task: request.task,
      };
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Backend AI provider failed.";

      if (!mockFallbackAllowed(request)) {
        return {
          text: "",
          providerUsed: "backend",
          local: false,
          fallbackUsed: true,
          task: request.task,
          error: message,
        };
      }

      return {
        text: buildMockFallback(request),
        providerUsed: "mock",
        local: false,
        fallbackUsed: true,
        task: request.task,
        error: message,
      };
    }
  },
};
