import type { AIRunRequest, AIRunResult } from "../aiTypes";
import { runMiniBrain } from "@/lib/intelligence/miniBrain";

function readDeterministicText(request: AIRunRequest) {
  const metadata = request.metadata || {};
  const value =
    metadata.deterministicText ||
    metadata.deterministic_text ||
    metadata.miniBrainText ||
    metadata.mini_brain_text;

  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function readMiniBrainContext(request: AIRunRequest) {
  const value = request.metadata?.miniBrainContext || request.metadata?.mini_brain_context;
  return value && typeof value === "object" ? value : null;
}

export const deterministicMiniBrainProvider = {
  name: "mini_brain" as const,
  local: false,
  canRun(request: AIRunRequest) {
    return Boolean(readDeterministicText(request) || readMiniBrainContext(request));
  },
  async run(request: AIRunRequest): Promise<AIRunResult> {
    const miniBrainContext = readMiniBrainContext(request);
    const text = miniBrainContext
      ? JSON.stringify(runMiniBrain(miniBrainContext as any))
      : readDeterministicText(request);

    return {
      text,
      providerUsed: "mini_brain",
      local: false,
      fallbackUsed: false,
      task: request.task,
    };
  },
};
