import { NextResponse } from "next/server";

import { getDashboardAnalytics } from "@/lib/marketing/analytics/dashboardAnalytics";

export async function GET() {
  try {
    const analytics =
      await getDashboardAnalytics();

    return NextResponse.json({
      success: true,
      data: analytics,
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
