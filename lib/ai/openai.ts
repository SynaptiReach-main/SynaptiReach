import {
  AIMessage,
  AIProfile,
  generateAIJson,
  generateAIText,
} from "@/lib/ai/providers";

export async function generateOpenAIText(
  messages: AIMessage[],
  profile: AIProfile = "balanced"
) {
  const result = await generateAIText(messages, { profile });
  return result.text;
}

export async function generateOpenAIJson<T>(
  messages: AIMessage[],
  fallback: T,
  profile: AIProfile = "balanced"
): Promise<T> {
  const result = await generateAIJson(messages, fallback, { profile });
  return result.data;
}
