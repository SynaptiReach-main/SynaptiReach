import { NextResponse } from "next/server";
import { testCustomerLocalConnection } from "@/src/ai/providers/customerLocalProvider";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const result = await testCustomerLocalConnection({
      enabled: body.enabled === true,
      status: body.status,
      endpointUrl: body.endpointUrl,
      model: body.model,
      workspaceId: body.workspaceId,
    });

    return NextResponse.json({
      success: result.ok,
      ...result,
    }, {
      status: result.ok ? 200 : 503,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        status: "unavailable",
        error:
          error instanceof Error
            ? error.message
            : "Customer-local test failed.",
      },
      { status: 500 }
    );
  }
}
