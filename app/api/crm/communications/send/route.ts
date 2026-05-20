import { NextResponse } from "next/server";
import { createSupabaseAdmin, friendlySupabaseError } from "@/lib/crm/supabaseAdmin";
import { applyWorkspaceScope, getWorkspaceContext } from "@/lib/auth/getWorkspaceContext";

function providerSetupError(channel: string) {
  if (channel === "email") {
    return "Email sending requires RESEND_API_KEY and RESEND_FROM_EMAIL to be configured server-side.";
  }
  if (channel === "sms") {
    return "SMS sending requires TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_FROM_NUMBER to be configured server-side.";
  }
  return "This channel is not configured for external sending.";
}

async function sendEmail(message: any) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) {
    return { success: false, setupRequired: true, error: providerSetupError("email") };
  }

  const { Resend } = await import("resend");
  const resend = new Resend(apiKey);
  const result = await resend.emails.send({
    from,
    to: message.recipient,
    subject: message.subject || "SynaptiReach follow-up",
    text: message.content,
  });

  if ((result as any).error) {
    return { success: false, error: (result as any).error?.message || "Resend email failed." };
  }

  return { success: true, provider: "resend", externalId: (result as any).data?.id || null };
}

async function sendSms(message: any) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  if (!accountSid || !authToken || !from) {
    return { success: false, setupRequired: true, error: providerSetupError("sms") };
  }

  const twilio = (await import("twilio")).default;
  const client = twilio(accountSid, authToken);
  const result = await client.messages.create({
    from,
    to: message.recipient,
    body: message.content,
  });

  return { success: true, provider: "twilio", externalId: result.sid || null };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const context = await getWorkspaceContext(req);

    if (!body.communication_id && !body.communicationId) {
      return NextResponse.json({ success: false, error: "communication_id is required." }, { status: 400 });
    }
    if (body.confirm !== true) {
      return NextResponse.json(
        { success: false, error: "Explicit confirm=true is required before external sending." },
        { status: 400 }
      );
    }

    const communicationId = body.communication_id || body.communicationId;
    const supabase = createSupabaseAdmin();
    let query = applyWorkspaceScope(supabase.from("communications").select("*"), context).eq("id", communicationId);
    const { data: communication, error } = await query.maybeSingle();
    if (error) throw error;

    if (!communication) {
      return NextResponse.json({ success: false, error: "Communication not found for this workspace." }, { status: 404 });
    }
    if (!["email", "sms"].includes(communication.channel)) {
      return NextResponse.json(
        { success: false, error: "Only email and SMS can be sent from this review-gated route." },
        { status: 400 }
      );
    }
    if (communication.direction && communication.direction !== "outbound") {
      return NextResponse.json({ success: false, error: "Only outbound communication drafts can be sent." }, { status: 400 });
    }
    if (!["draft", "scheduled", "failed"].includes(communication.status || "draft")) {
      return NextResponse.json(
        { success: false, error: "Only draft, scheduled, or failed messages can be confirmed for sending." },
        { status: 400 }
      );
    }
    if (!communication.recipient || !communication.content) {
      return NextResponse.json({ success: false, error: "Recipient and message content are required." }, { status: 400 });
    }

    const sendResult = communication.channel === "email"
      ? await sendEmail(communication)
      : await sendSms(communication);

    const sentAt = new Date().toISOString();
    const metadata = {
      ...(communication.metadata || {}),
      review_gated: true,
      confirmed_send_at: sentAt,
      provider: sendResult.provider || communication.channel,
      external_message_id: sendResult.externalId || null,
      setup_required: sendResult.setupRequired || false,
      send_error: sendResult.success ? null : sendResult.error || "Provider send failed.",
    };

    const { data: updated, error: updateError } = await supabase
      .from("communications")
      .update({
        status: sendResult.success ? "sent" : "failed",
        metadata,
      })
      .eq("id", communication.id)
      .select()
      .single();
    if (updateError) throw updateError;

    await supabase.from("crm_notifications").insert({
      workspace_id: communication.workspace_id || context.workspaceId || null,
      company_id: context.companyId || null,
      user_id: context.userId || null,
      title: sendResult.success ? "Communication sent" : "Communication send failed",
      message: sendResult.success
        ? `${communication.channel.toUpperCase()} message sent after user confirmation.`
        : sendResult.error || "Provider setup or delivery failed.",
      type: "communication",
      priority: sendResult.success ? "normal" : "high",
      record_type: "communication",
      record_id: communication.id,
      href: `/dashboard/communications?communicationId=${encodeURIComponent(communication.id)}`,
      metadata: {
        review_gated: true,
        setup_required: sendResult.setupRequired || false,
      },
    }).then(() => undefined).catch(() => undefined);

    return NextResponse.json({
      success: sendResult.success,
      setupRequired: sendResult.setupRequired || false,
      error: sendResult.success ? null : sendResult.error,
      communication: updated,
    }, { status: sendResult.success ? 200 : sendResult.setupRequired ? 503 : 502 });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      { success: false, error: friendly.message, missingSchema: friendly.missingSchema },
      { status: friendly.missingSchema ? 501 : 500 }
    );
  }
}
