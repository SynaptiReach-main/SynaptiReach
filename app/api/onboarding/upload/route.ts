export {};
import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    success: true,
    url: "/uploads/mock-file.pdf",
  });
}
