import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      success: false,
      setupRequired: true,
      error:
        "Onboarding file storage is not connected yet. Use CSV lead import or complete file storage setup before uploading knowledge files.",
    },
    { status: 501 }
  );
}
