import { NextResponse } from "next/server";
import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from "@/lib/marketing/env";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      from,
      to,
      body: smsBody,
    } = body;

    const auth = Buffer.from(
      `${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`
    ).toString("base64");

    const params = new URLSearchParams();

    params.append("From", from);
    params.append("To", to);
    params.append("Body", smsBody);

    const response = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type":
            "application/x-www-form-urlencoded",
        },
        body: params,
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
