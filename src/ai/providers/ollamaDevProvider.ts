import type { AIMessage, AIRunRequest, AIRunResult } from "../aiTypes";

const DEFAULT_OLLAMA_BASE_URL = "http://localhost:11434";
const DEFAULT_OLLAMA_MODEL = "gemma3:1b";

function readEnv(name: string) {
  return typeof process !== "undefined" ? process.env[name] : undefined;
}

function getOllamaBaseUrl() {
  return (
    readEnv("OLLAMA_BASE_URL") ||
    readEnv("VITE_OLLAMA_BASE_URL") ||
    readEnv("NEXT_PUBLIC_OLLAMA_BASE_URL") ||
    DEFAULT_OLLAMA_BASE_URL
  ).replace(/\/$/, "");
}

function getOllamaModel() {
  return (
    readEnv("OLLAMA_MODEL") ||
    readEnv("VITE_OLLAMA_MODEL") ||
    readEnv("NEXT_PUBLIC_OLLAMA_MODEL") ||
    DEFAULT_OLLAMA_MODEL
  );
}

function stringifyInput(value: unknown) {
  if (typeof value === "string") return value;
  if (value === undefined || value === null) return "";
  return JSON.stringify(value, null, 2);
}

function buildMessages(request: AIRunRequest): AIMessage[] {
  if (request.messages?.length) return request.messages;

  const context = stringifyInput(request.context);
  const input = stringifyInput(request.input);
  const userContent = [context && `Context:\n${context}`, input && `Input:\n${input}`]
    .filter(Boolean)
    .join("\n\n");

  return [
    {
      role: "system",
      content:
        "You are SynaptiReach's local development assistant. Keep responses concise, practical, and grounded in the supplied CRM data.",
    },
    {
      role: "user",
      content: userContent || `Run task: ${request.task}`,
    },
  ];
}

function friendlyOllamaError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error || "");
  const lower = message.toLowerCase();

  if (
    lower.includes("failed to fetch") ||
    lower.includes("econnrefused") ||
    lower.includes("connect") ||
    lower.includes("fetch failed")
  ) {
    return "Local Ollama is not available. Start Ollama and make sure http://localhost:11434 is reachable.";
  }

  if (lower.includes("404")) {
    return "Ollama responded, but the chat endpoint or model was not found. Confirm gemma3:1b is pulled locally.";
  }

  return "Local Ollama request failed. Falling back to the configured backend AI provider.";
}

export const ollamaDevProvider = {
  name: "ollama-dev" as const,
  local: true,
  async run(request: AIRunRequest): Promise<AIRunResult> {
    const baseUrl = getOllamaBaseUrl();
    const model = getOllamaModel();

    try {
      const response = await fetch(`${baseUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: buildMessages(request),
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama request failed with status ${response.status}`);
      }

      const data = await response.json();
      const text = String(data?.message?.content || "").trim();

      if (!text) {
        throw new Error("Ollama returned no message content.");
      }

      return {
        text,
        providerUsed: "ollama-dev",
        local: true,
        fallbackUsed: false,
        task: request.task,
      };
    } catch (error) {
      if (process.env.NODE_ENV === "development") {
        console.warn("[ai:ollama-dev]", error);
      }

      throw new Error(friendlyOllamaError(error));
    }
  },
};
