import { NextResponse } from "next/server";

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const prompt =
      body.prompt;

    const response =
      await fetch(
        "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" +
          process.env.GEMINI_API_KEY,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text:
                      `Generate a high-performing marketing creative concept for: ${prompt}`,
                  },
                ],
              },
            ],
          }),
        }
      );

    const data =
      await response.json();

    const text =
      data?.candidates?.[0]
        ?.content?.parts?.[0]
        ?.text || "";

    return NextResponse.json({
      success: true,
      text,
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
