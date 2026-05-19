import type {
  AIRunRequest,
  AIRunResult,
  CustomerLocalProviderConfig,
  CustomerLocalProviderStatus,
} from "../aiTypes";

function getConfig(request: AIRunRequest): CustomerLocalProviderConfig {
  const raw = request.metadata?.customerLocalProvider;
  if (!raw || typeof raw !== "object") return {};
  return raw as CustomerLocalProviderConfig;
}

function normalizeEndpoint(endpointUrl?: string) {
  return endpointUrl?.trim().replace(/\/$/, "") || "";
}

export function getCustomerLocalStatus(
  config: CustomerLocalProviderConfig
): CustomerLocalProviderStatus {
  if (!config.enabled) return "setup_required";
  if (!normalizeEndpoint(config.endpointUrl) || !config.model) {
    return "setup_required";
  }
  return config.status || "connected";
}

export async function testCustomerLocalConnection(
  config: CustomerLocalProviderConfig
) {
  const endpoint = normalizeEndpoint(config.endpointUrl);
  const status = getCustomerLocalStatus(config);

  if (status !== "connected") {
    return {
      status,
      ok: false,
      error: "Customer-local AI is not configured for this workspace.",
    };
  }

  try {
    const response = await fetch(`${endpoint}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: config.model,
        messages: [{ role: "user", content: "Say ready." }],
        stream: false,
      }),
    });

    return {
      status: response.ok ? "connected" : "unavailable",
      ok: response.ok,
      error: response.ok
        ? undefined
        : `Customer-local endpoint returned status ${response.status}.`,
    };
  } catch (error) {
    return {
      status: "unavailable" as const,
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : "Customer-local endpoint is unavailable.",
    };
  }
}

export const customerLocalProvider = {
  name: "customer-local" as const,
  local: true,
  canRun(request: AIRunRequest) {
    return getCustomerLocalStatus(getConfig(request)) === "connected";
  },
  async run(request: AIRunRequest): Promise<AIRunResult> {
    const config = getConfig(request);
    const endpoint = normalizeEndpoint(config.endpointUrl);

    if (!this.canRun(request)) {
      return {
        text: "",
        providerUsed: "customer-local",
        local: true,
        fallbackUsed: true,
        task: request.task,
        error: "Customer-local AI is not configured for this workspace.",
      };
    }

    try {
      const response = await fetch(`${endpoint}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: config.model,
          messages: request.messages || [
            {
              role: "user",
              content:
                typeof request.input === "string"
                  ? request.input
                  : JSON.stringify(request.input || request.context || {}),
            },
          ],
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Customer-local endpoint returned ${response.status}.`);
      }

      const data = await response.json();
      const text = String(data?.message?.content || data?.text || "").trim();

      if (!text) {
        throw new Error("Customer-local endpoint returned no content.");
      }

      return {
        text,
        providerUsed: "customer-local",
        local: true,
        fallbackUsed: false,
        task: request.task,
      };
    } catch (error) {
      return {
        text: "",
        providerUsed: "customer-local",
        local: true,
        fallbackUsed: true,
        task: request.task,
        error:
          error instanceof Error
            ? error.message
            : "Customer-local AI is unavailable.",
      };
    }
  },
};
