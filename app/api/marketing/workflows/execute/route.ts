import { NextResponse } from "next/server";

import { executeWorkflow } from "@/lib/marketing/workflows/engine";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    await executeWorkflow(
      body.workflowId,
      body.lead
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        error:
          error.message,
      },
      {
        status: 500,
      }
    );
  }
}
