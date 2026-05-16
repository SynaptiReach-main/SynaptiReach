import { NextResponse } from "next/server";
import { generateAIText, providerErrorResponse } from "@/lib/ai/providers";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      prompt,
      system,
    } = body;

    if (!prompt) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing AI prompt.",
        },
        {
          status: 400,
        }
      );
    }

    const taskType = `${body.type || body.channel || ""} ${system || ""}`.toLowerCase();
    const profile =
      body.profile ||
      (taskType.includes("sms") || taskType.includes("social")
        ? "cheap"
        : taskType.includes("email") && String(prompt).length > 400
          ? "premium"
          : "balanced");

    const result = await generateAIText([
      {
        role: "system",
        content:
          system ||
          "You are SynaptiReach's CRM marketing assistant. Generate concise, conversion-oriented campaign content.",
      },
      {
        role: "user",
        content: prompt,
      },
    ], { profile });

    if (!result.text) {
      return NextResponse.json(
        {
          success: false,
          error: "AI generation returned no content.",
        },
        {
          status: 502,
        }
      );
    }

    return NextResponse.json({
      success: true,
      text: result.text,
      provider: result.provider,
      model: result.model,
      fallback_used: result.fallback_used,
      provider_errors: result.provider_errors,
      provider_warnings: result.provider_warnings,
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
