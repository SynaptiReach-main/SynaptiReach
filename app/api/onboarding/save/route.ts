export {};
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  console.log("ONBOARDING SAVE:", body);

  return NextResponse.json({
    success: true,
  });
}
