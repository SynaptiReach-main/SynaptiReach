import { NextResponse }
from "next/server";

import {
  processAutomationQueue,
} from "@/lib/marketing/automation/processAutomationQueue";

import {
  processRetryQueue,
} from "@/lib/marketing/infrastructure/processRetryQueue";

export async function GET() {
  try {
    const automation =
      await processAutomationQueue();

    const retries =
      await processRetryQueue();

    return NextResponse.json({
      success: true,

      automation,

      retries,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,

        error:
          error.message,
      },
      {
        status: 500,
      }
    );
  }
}
