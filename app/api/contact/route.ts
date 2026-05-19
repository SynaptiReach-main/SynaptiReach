import { NextResponse } from "next/server";
import { createSupabaseAdmin, friendlySupabaseError } from "@/lib/crm/supabaseAdmin";
import { sendSynaptiReachEmail } from "@/lib/notifications/resend";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    if (body.website || body.company_website_confirm) {
      return NextResponse.json({ success: true, spamFiltered: true });
    }
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json({ success: false, error: "Name, email, and message are required." }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();
    const submittedAt = new Date().toISOString();
    const { data, error } = await supabase
      .from("contact_submissions")
      .insert({
        name: String(body.name).slice(0, 160),
        email: String(body.email).slice(0, 200),
        phone: body.phone ? String(body.phone).slice(0, 80) : null,
        company: body.company ? String(body.company).slice(0, 160) : null,
        message: String(body.message).slice(0, 4000),
        source: body.source || "contact_page",
        status: "new",
        metadata: {
          inquiry_type: body.inquiry_type || body.inquiryType || "general",
          service: body.service || null,
          support_topic: body.support_topic || body.supportTopic || null,
          submitted_at: submittedAt,
          user_agent: request.headers.get("user-agent") || null,
        },
      })
      .select()
      .single();
    if (error) throw error;

    const email = await sendSynaptiReachEmail({
      subject: `New SynaptiReach contact: ${body.inquiry_type || "General inquiry"}`,
      replyTo: body.email,
      text: [
        `Name: ${body.name}`,
        `Company: ${body.company || "Not provided"}`,
        `Email: ${body.email}`,
        `Phone: ${body.phone || "Not provided"}`,
        `Inquiry: ${body.inquiry_type || "general"}`,
        `Service: ${body.service || "Not provided"}`,
        `Source: ${body.source || "contact_page"}`,
        `Submitted: ${submittedAt}`,
        "",
        String(body.message),
      ].join("\n"),
    });

    await supabase.from("crm_notifications").insert({
      title: "New contact submission",
      message: `${body.name} submitted a ${body.inquiry_type || "general"} inquiry.`,
      type: "contact",
      priority: "normal",
      status: "unread",
      record_type: "contact_submissions",
      record_id: data.id,
      href: "/admin/dashboard/contact-submissions",
      metadata: { source: "contact_form", email_sent: email.success, email_setup_required: email.setupRequired },
    }).then(() => undefined).catch(() => undefined);

    return NextResponse.json({ success: true, submission: data, emailSent: email.success, emailSetupRequired: email.setupRequired });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      { success: false, error: friendly.message, missingSchema: friendly.missingSchema, setupRequired: friendly.setupRequired },
      { status: friendly.missingSchema ? 501 : friendly.setupRequired ? 503 : 500 }
    );
  }
}
