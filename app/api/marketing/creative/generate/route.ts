import { NextResponse } from "next/server";
import { providerErrorResponse } from "@/lib/ai/providers";
import { aiClient } from "@/src/ai/aiClient";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const prompt =
      body.prompt;

    if (!prompt) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing creative prompt.",
        },
        {
          status: 400,
        }
      );
    }

    const result =
      await aiClient.runTask("campaign_ideas", {
        messages: [
        {
          role: "system",
          content:
            "You are SynaptiReach's marketing creative agent. Generate concise, practical campaign creative concepts using only the user's request.",
        },
        {
          role: "user",
          content:
            `Generate a high-performing marketing creative concept for: ${prompt}`,
        },
      ],
        metadata: { profile: body.profile || "balanced" },
      });

    return NextResponse.json({
      success: true,
      text: result.text,
      provider: result.providerUsed,
      model: result.providerUsed,
      fallback_used: result.fallbackUsed,
      provider_errors: result.error ? [{ provider: result.providerUsed, reason: result.error }] : [],
      provider_warnings: [],
      ai_result: result,
    });
  } catch (error: any) {
    const response = providerErrorResponse(error);
    return NextResponse.json(
      response,
      {
        status: 500,
      }
    );
  }
}
