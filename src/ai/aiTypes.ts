export type AIProviderUsed =
  | "ollama-dev"
  | "local-webllm"
  | "customer-local"
  | "backend"
  | "openai"
  | "claude"
  | "mini_brain"
  | "deterministic"
  | "mock";

export type AIMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type AIRunResult = {
  text: string;
  providerUsed: AIProviderUsed;
  local: boolean;
  fallbackUsed: boolean;
  task: string;
  error?: string;
};

export type AIRunTaskInput = {
  input?: unknown;
  context?: unknown;
  messages?: AIMessage[];
  mode?: string;
  metadata?: Record<string, unknown>;
};

export type CustomerLocalProviderStatus =
  | "setup_required"
  | "connected"
  | "unavailable";

export type CustomerLocalProviderConfig = {
  enabled?: boolean;
  status?: CustomerLocalProviderStatus;
  endpointUrl?: string;
  model?: string;
  workspaceId?: string;
};

export type AIRunRequest = AIRunTaskInput & {
  task: string;
};

export type AITaskComplexity = "light" | "medium" | "heavy";

export type AITaskDefinition = {
  name: string;
  localAllowed: boolean;
  estimatedComplexity: AITaskComplexity;
  requiresLongContext: boolean;
};

export type AIProvider = {
  name: AIProviderUsed;
  local: boolean;
  run: (request: AIRunRequest) => Promise<AIRunResult>;
};
