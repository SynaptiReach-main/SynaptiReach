import { NextResponse } from "next/server";

import { defaultTemplates } from "@/lib/marketing/templates/defaultTemplates";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: defaultTemplates,
  });
}
