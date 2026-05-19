import type { AIRunResult, AIRunTaskInput } from "./aiTypes";

export const aiClient = {
  async runTask(taskName: string, options: AIRunTaskInput = {}): Promise<AIRunResult> {
    const request = {
      task: taskName,
      ...options,
    };

    if (typeof window !== "undefined") {
      const response = await fetch("/api/ai/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok || !data?.success) {
        return {
          text: "",
          providerUsed: "mock",
          local: false,
          fallbackUsed: true,
          task: taskName,
          error: data?.error || "AI request failed.",
        };
      }

      return data.result;
    }

    const { runAIRoute } = await import("./aiRouter");
    return runAIRoute(request);
  },
};
