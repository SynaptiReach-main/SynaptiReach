import { NextResponse } from "next/server";
import { AYRSHARE_API_KEY } from "@/lib/marketing/env";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await fetch(
      "https://app.ayrshare.com/api/post",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${AYRSHARE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}
