export type AIProfile = "cheap" | "balanced" | "premium" | "fallback";

export type AIMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type AIProviderName = "gemini" | "openai" | "openrouter";

export type AIProviderResult = {
  text: string;
  provider: AIProviderName;
  model: string;
  fallback_used: boolean;
  provider_errors: Array<{
    provider: AIProviderName;
    reason: string;
  }>;
  provider_warnings?: Array<{
    provider: AIProviderName;
    reason: string;
  }>;
};

export class AIProvidersUnavailableError extends Error {
  provider_errors: Array<{
    provider: AIProviderName;
    reason: string;
  }>;

  constructor(
    providerErrors: Array<{
      provider: AIProviderName;
      reason: string;
    }>
  ) {
    super("AI providers are unavailable or out of quota.");
    this.name = "AIProvidersUnavailableError";
    this.provider_errors = providerErrors;
  }
}

const DEFAULT_OPENROUTER_MODEL = "openrouter/free";

const MODEL_BY_PROVIDER: Record<AIProviderName, Record<AIProfile, string>> = {
  gemini: {
    cheap: process.env.GEMINI_CHEAP_MODEL || "gemini-1.5-flash-8b",
    balanced: process.env.GEMINI_BALANCED_MODEL || "gemini-1.5-flash",
    premium: process.env.GEMINI_PREMIUM_MODEL || "gemini-1.5-pro",
    fallback: process.env.GEMINI_FALLBACK_MODEL || "gemini-1.5-flash-8b",
  },
  openai: {
    cheap: process.env.OPENAI_CHEAP_MODEL || "gpt-4o-mini",
    balanced: process.env.OPENAI_BALANCED_MODEL || "gpt-4o-mini",
    premium: process.env.OPENAI_PREMIUM_MODEL || "gpt-4o",
    fallback: process.env.OPENAI_FALLBACK_MODEL || "gpt-4o-mini",
  },
  openrouter: {
    cheap: process.env.OPENROUTER_CHEAP_MODEL || process.env.OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL,
    balanced: process.env.OPENROUTER_BALANCED_MODEL || process.env.OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL,
    premium: process.env.OPENROUTER_PREMIUM_MODEL || process.env.OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL,
    fallback: process.env.OPENROUTER_FALLBACK_MODEL || process.env.OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL,
  },
};

const OPENROUTER_SECONDARY_MODEL =
  process.env.OPENROUTER_SECONDARY_MODEL ||
  DEFAULT_OPENROUTER_MODEL;

function isOpenAIEnabled() {
  return process.env.AI_ENABLE_OPENAI === "true";
}

function configuredProviders() {
  return {
    gemini: Boolean(process.env.GEMINI_API_KEY),
    openai: Boolean(process.env.OPENAI_API_KEY && isOpenAIEnabled()),
    openrouter: Boolean(process.env.OPENROUTER_API_KEY),
  };
}

export function getAIProviderStatus() {
  const plan = getProviderPlan();

  return {
    configured: {
      gemini: Boolean(process.env.GEMINI_API_KEY),
      openai: Boolean(process.env.OPENAI_API_KEY),
      openrouter: Boolean(process.env.OPENROUTER_API_KEY),
    },
    enabled: {
      gemini: Boolean(process.env.GEMINI_API_KEY),
      openai: Boolean(process.env.OPENAI_API_KEY && isOpenAIEnabled()),
      openrouter: Boolean(process.env.OPENROUTER_API_KEY),
    },
    priority: plan.order,
    warnings: plan.warnings,
    models: MODEL_BY_PROVIDER,
    openrouter_model: process.env.OPENROUTER_MODEL || DEFAULT_OPENROUTER_MODEL,
    openai_enabled: isOpenAIEnabled(),
  };
}

function parseProviderOrder(value?: string): AIProviderName[] {
  return (value || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter((item): item is AIProviderName =>
      ["gemini", "openai", "openrouter"].includes(item)
    );
}

function defaultProviderOrder(profile: AIProfile): AIProviderName[] {
  if (profile === "fallback") {
    return ["openrouter", "gemini"];
  }

  return ["gemini", "openrouter"];
}

function getProviderPlan(profile: AIProfile = "balanced") {
  const configured = configuredProviders();
  const explicitOrder = parseProviderOrder(process.env.AI_PROVIDER_ORDER);
  const requestedOrder =
    explicitOrder.length > 0 ? explicitOrder : defaultProviderOrder(profile);
  const warnings: AIProviderResult["provider_errors"] = [];

  const order = requestedOrder.filter((provider) => {
    if (provider === "openai" && !isOpenAIEnabled()) {
      warnings.push({
        provider: "openai",
        reason: "openai skipped because AI_ENABLE_OPENAI is not enabled",
      });
      return false;
    }

    return configured[provider];
  });

  return { order, warnings };
}

export function getProviderOrder(profile: AIProfile = "balanced") {
  return getProviderPlan(profile).order;
}

function sanitizeProviderError(error: any) {
  const message = String(error?.message || error || "provider request failed");
  const lower = message.toLowerCase();

  if (lower.includes("openai skipped because ai_enable_openai is not enabled")) {
    return "openai skipped because AI_ENABLE_OPENAI is not enabled";
  }

  if (lower.includes("quota/rate limit")) {
    return "quota/rate limit";
  }

  if (lower.includes("missing key")) {
    return "missing key";
  }

  if (lower.includes("invalid model")) {
    return "invalid model";
  }

  if (lower.includes("response parsing failed")) {
    return "response parsing failed";
  }

  if (lower.includes("no content returned")) {
    return "no content returned";
  }

  const statusMatch = lower.match(/status\s+(\d{3})/);
  if (statusMatch && !["401", "403", "429"].includes(statusMatch[1])) {
    return `request failed with status ${statusMatch[1]}`;
  }

  if (
    lower.includes("quota") ||
    lower.includes("billing") ||
    lower.includes("insufficient_quota")
  ) {
    return "quota or billing limit";
  }

  if (
    lower.includes("rate") ||
    lower.includes("429") ||
    lower.includes("too many") ||
    lower.includes("rate limit")
  ) {
    return lower.includes("openrouter") ? "quota/rate limit" : "rate limited";
  }

  if (
    lower.includes("auth") ||
    lower.includes("api key") ||
    lower.includes("401") ||
    lower.includes("403") ||
    lower.includes("permission")
  ) {
    return lower.includes("openrouter") ? "auth failed" : "authentication failed";
  }

  if (lower.includes("not configured")) {
    return "not configured";
  }

  return "request failed";
}

function messagesToGeminiText(messages: AIMessage[]) {
  return messages
    .map((message) => `${message.role.toUpperCase()}:\n${message.content}`)
    .join("\n\n");
}

async function callGemini(messages: AIMessage[], profile: AIProfile) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("Gemini is not configured.");
  }

  const model = MODEL_BY_PROVIDER.gemini[profile];
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: messagesToGeminiText(messages),
              },
            ],
          },
        ],
      }),
    }
  );

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.error?.message || `Gemini request failed: ${response.status}`);
  }

  return {
    text: data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "",
    model,
  };
}

async function callOpenAI(messages: AIMessage[], profile: AIProfile) {
  if (!isOpenAIEnabled()) {
    throw new Error("OpenAI skipped because AI_ENABLE_OPENAI is not enabled.");
  }

  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OpenAI is not configured.");
  }

  const model = MODEL_BY_PROVIDER.openai[profile];
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.4,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.error?.message || `OpenAI request failed: ${response.status}`);
  }

  return {
    text: data?.choices?.[0]?.message?.content?.trim() || "",
    model,
  };
}

async function callOpenRouterModel(messages: AIMessage[], model: string) {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("OpenRouter missing key.");
  }

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
      "X-Title": "SynaptiReach CRM",
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.4,
    }),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const detail = String(data?.error?.message || "");
    const lowerDetail = detail.toLowerCase();

    if (response.status === 401 || response.status === 403) {
      throw new Error("OpenRouter auth failed.");
    }

    if (response.status === 429 || lowerDetail.includes("quota") || lowerDetail.includes("rate")) {
      throw new Error("OpenRouter quota/rate limit.");
    }

    if (
      response.status === 400 &&
      (lowerDetail.includes("model") || lowerDetail.includes("not found"))
    ) {
      throw new Error("OpenRouter invalid model.");
    }

    throw new Error(`OpenRouter request failed with status ${response.status}.`);
  }

  const choice = data?.choices?.[0];
  const text =
    choice?.message?.content?.trim?.() ||
    choice?.text?.trim?.() ||
    "";

  if (!text) {
    throw new Error("OpenRouter response parsing failed.");
  }

  return {
    text,
    model,
  };
}

async function callOpenRouter(messages: AIMessage[], profile: AIProfile) {
  const primaryModel = MODEL_BY_PROVIDER.openrouter[profile];

  try {
    return await callOpenRouterModel(messages, primaryModel);
  } catch (error) {
    const reason = sanitizeProviderError(error);
    const shouldTrySecondary =
      reason === "invalid model" ||
      reason === "response parsing failed" ||
      reason === "no content returned" ||
      reason === "request failed with status 404" ||
      reason === "request failed with status 502" ||
      reason === "request failed with status 503" ||
      reason === "request failed with status 504";

    if (primaryModel !== OPENROUTER_SECONDARY_MODEL && shouldTrySecondary) {
      return callOpenRouterModel(messages, OPENROUTER_SECONDARY_MODEL);
    }

    throw error;
  }
}

export async function generateAIText(
  messages: AIMessage[],
  options: {
    profile?: AIProfile;
    preferredProvider?: AIProviderName;
  } = {}
): Promise<AIProviderResult> {
  const profile = options.profile || "balanced";
  const providerErrors: AIProviderResult["provider_errors"] = [];
  const plan = getProviderPlan(profile);
  const providerWarnings = plan.warnings;
  const order = options.preferredProvider
    ? [
        options.preferredProvider,
        ...plan.order.filter(
          (provider) => provider !== options.preferredProvider
        ),
      ].filter((provider, index, providers) => {
        if (provider === "openai" && !isOpenAIEnabled()) {
          if (!providerWarnings.some((warning) => warning.provider === "openai")) {
            providerWarnings.push({
              provider: "openai",
              reason: "openai skipped because AI_ENABLE_OPENAI is not enabled",
            });
          }
          return false;
        }

        return providers.indexOf(provider) === index;
      })
    : plan.order;

  if (order.length === 0) {
    throw new AIProvidersUnavailableError([
      { provider: "gemini", reason: "not configured" },
      ...(providerWarnings.length > 0
        ? providerWarnings
        : [{ provider: "openai" as AIProviderName, reason: "not configured" }]),
      { provider: "openrouter", reason: "not configured" },
    ]);
  }

  for (const provider of order) {
    try {
      const result =
        provider === "gemini"
          ? await callGemini(messages, profile)
          : provider === "openai"
            ? await callOpenAI(messages, profile)
            : await callOpenRouter(messages, profile);

      if (!result.text) {
        throw new Error("Provider returned no content.");
      }

      return {
        text: result.text,
        provider,
        model: result.model,
        fallback_used: providerErrors.length > 0,
        provider_errors: providerErrors,
        provider_warnings: providerWarnings,
      };
    } catch (error) {
      providerErrors.push({
        provider,
        reason: sanitizeProviderError(error),
      });
    }
  }

  throw new AIProvidersUnavailableError([...providerWarnings, ...providerErrors]);
}

export async function generateAIJson<T>(
  messages: AIMessage[],
  fallback: T,
  options: {
    profile?: AIProfile;
    preferredProvider?: AIProviderName;
  } = {}
) {
  const result = await generateAIText(
    [
      ...messages,
      {
        role: "system",
        content:
          "Return valid JSON only. Do not wrap the JSON in markdown fences.",
      },
    ],
    options
  );

  try {
    return {
      data: JSON.parse(result.text) as T,
      meta: result,
    };
  } catch {
    return {
      data: fallback,
      meta: result,
    };
  }
}

export function providerErrorResponse(error: any) {
  if (error instanceof AIProvidersUnavailableError) {
    return {
      success: false,
      error: "AI providers are unavailable or out of quota.",
      provider_errors: error.provider_errors,
    };
  }

  return {
    success: false,
    error: "AI providers are unavailable or out of quota.",
    provider_errors: [
      {
        provider: "openai" as AIProviderName,
        reason: sanitizeProviderError(error),
      },
    ],
  };
}
