import { NextResponse } from "next/server";
import { generateAIText, providerErrorResponse } from "@/lib/ai/providers";

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

    const text =
      await generateAIText([
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
      ], { profile: body.profile || "balanced" });

    return NextResponse.json({
      success: true,
      text: text.text,
      provider: text.provider,
      model: text.model,
      fallback_used: text.fallback_used,
      provider_errors: text.provider_errors,
      provider_warnings: text.provider_warnings,
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
