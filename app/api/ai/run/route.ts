import { NextResponse } from "next/server";
import { aiClient } from "@/src/ai/aiClient";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = await aiClient.runTask(body.task, {
      input: body.input,
      context: body.context,
      messages: body.messages,
      mode: body.mode,
      metadata: body.metadata,
    });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "AI request failed.",
      },
      { status: 500 }
    );
  }
}
