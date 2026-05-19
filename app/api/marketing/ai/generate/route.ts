import { NextResponse } from "next/server";
import { providerErrorResponse } from "@/lib/ai/providers";
import { aiClient } from "@/src/ai/aiClient";

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

    const result = await aiClient.runTask(body.task || "campaign_ideas", {
      messages: [
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
      ],
      metadata: { profile },
    });

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
