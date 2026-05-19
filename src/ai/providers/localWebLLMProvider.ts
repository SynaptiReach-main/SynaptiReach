import type { AIRunRequest, AIRunResult } from "../aiTypes";

export const localWebLLMProvider = {
  name: "local-webllm" as const,
  local: true,
  async run(request: AIRunRequest): Promise<AIRunResult> {
    return {
      text: "",
      providerUsed: "local-webllm",
      local: true,
      fallbackUsed: false,
      task: request.task,
      error: "Local WebLLM is not enabled for this SynaptiReach build.",
    };
  },
};
