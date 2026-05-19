import type { AIRunRequest, AIRunResult } from "./aiTypes";
import { backendProvider } from "./providers/backendProvider";
import { customerLocalProvider } from "./providers/customerLocalProvider";
import { deterministicMiniBrainProvider } from "./providers/deterministicMiniBrainProvider";
import { ollamaDevProvider } from "./providers/ollamaDevProvider";
import { getTaskDefinition } from "./tasks/taskRegistry";

function readEnv(name: string) {
  return typeof process !== "undefined" ? process.env[name] : undefined;
}

function envEnabled(...names: string[]) {
  const value = names.map(readEnv).find((item) => item !== undefined);
  if (value === undefined) return false;
  return value === "true" || value === "1";
}

function envValue(...names: string[]) {
  return names.map(readEnv).find((item) => item !== undefined);
}

function isSafeDevOrDemo(request: AIRunRequest) {
  const mode = String(request.mode || request.metadata?.mode || "").toLowerCase();
  return (
    process.env.NODE_ENV !== "production" ||
    mode === "demo" ||
    mode === "development" ||
    request.metadata?.allowMockFallback === true
  );
}

function backendCapsAllow(request: AIRunRequest) {
  if (request.metadata?.backendAllowed === false) return false;
  return true;
}

function envDefaultProvider() {
  return envValue("AI_DEFAULT_PROVIDER", "VITE_AI_DEFAULT_PROVIDER");
}

function isDevelopmentMode() {
  return process.env.NODE_ENV === "development";
}

function shouldTryOllamaDev(task: string) {
  const definition = getTaskDefinition(task);

  return (
    definition.localAllowed &&
    (!envDefaultProvider() || envDefaultProvider() === "ollama-dev") &&
    envEnabled("AI_ENABLE_OLLAMA_DEV", "VITE_AI_ENABLE_OLLAMA_DEV") &&
    envEnabled("AI_ENABLE_LOCAL", "VITE_AI_ENABLE_LOCAL") &&
    isDevelopmentMode()
  );
}

export async function runAIRoute(request: AIRunRequest): Promise<AIRunResult> {
  const localErrors: string[] = [];

  if (deterministicMiniBrainProvider.canRun(request)) {
    return deterministicMiniBrainProvider.run(request);
  }

  if (shouldTryOllamaDev(request.task)) {
    try {
      return await ollamaDevProvider.run(request);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Local Ollama request failed.";
      localErrors.push(message);
    }
  }

  if (customerLocalProvider.canRun(request)) {
    const customerLocalResult = await customerLocalProvider.run(request);
    if (customerLocalResult.text) {
      return {
        ...customerLocalResult,
        fallbackUsed: localErrors.length > 0 || customerLocalResult.fallbackUsed,
        error: customerLocalResult.error || localErrors[0],
      };
    }
    if (customerLocalResult.error) localErrors.push(customerLocalResult.error);
  }

  if (!backendCapsAllow(request)) {
    return {
      text: isSafeDevOrDemo(request)
        ? "AI is temporarily unavailable. Use deterministic SynaptiReach recommendations and try again later."
        : "",
      providerUsed: "mock",
      local: false,
      fallbackUsed: true,
      task: request.task,
      error: localErrors[0] || "Backend AI is not enabled for this task.",
    };
  }

  const backendResult = await backendProvider.run({
    ...request,
    metadata: {
      ...(request.metadata || {}),
      allowMockFallback: isSafeDevOrDemo(request),
    },
  });
  const fallbackUsed = localErrors.length > 0 || backendResult.fallbackUsed;

  return {
    ...backendResult,
    fallbackUsed,
    error: backendResult.error || localErrors[0],
  };
}
