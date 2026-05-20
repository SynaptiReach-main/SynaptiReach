import { NextResponse } from "next/server";
import { createSupabaseAdmin, friendlySupabaseError } from "@/lib/crm/supabaseAdmin";
import { sendSynaptiReachEmail } from "@/lib/notifications/resend";

const FOUNDING_COHORT_SIZE = 5;
const WAITLIST_STATUSES = new Set(["new", "reviewed", "invited", "onboarded", "declined"]);

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    if (body.website || body.company_website_confirm) {
      return NextResponse.json({ success: true, spamFiltered: true });
    }
    if (!body.full_name || !body.work_email || !body.consent_to_contact) {
      return NextResponse.json({ success: false, error: "Name, work email, and contact consent are required." }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();
    const email = String(body.work_email).trim().toLowerCase();
    const { data: existing } = await supabase.from("waitlist_signups").select("*").eq("work_email", email).maybeSingle();
    if (existing) {
      return NextResponse.json({ success: true, signup: existing, duplicate: true });
    }

    const { count } = await supabase.from("waitlist_signups").select("id", { count: "exact", head: true });
    const position = Number(count || 0) + 1;
    const founding = position <= FOUNDING_COHORT_SIZE;
    const submittedAt = new Date().toISOString();
    const { data, error } = await supabase
      .from("waitlist_signups")
      .insert({
        full_name: String(body.full_name).slice(0, 160),
        business_name: body.business_name ? String(body.business_name).slice(0, 160) : null,
        work_email: email,
        phone: body.phone ? String(body.phone).slice(0, 80) : null,
        industry: body.industry || null,
        website: body.website_url || null,
        business_size: body.business_size || body.team_size || null,
        desired_plan: body.desired_plan || body.interested_tier || null,
        billing_preference: body.billing_preference || body.byok_managed_interest || null,
        main_goal: body.main_goal || body.needs || null,
        urgency: body.urgency || null,
        services_interested: Array.isArray(body.services_interested) ? body.services_interested : [],
        consent_to_contact: true,
        waitlist_position: position,
        founding_cohort_eligible: founding,
        status: WAITLIST_STATUSES.has(body.status) ? body.status : "new",
        metadata: {
          source: body.source || "public_waitlist_widget",
          launch_date: process.env.NEXT_PUBLIC_LAUNCH_DATE || "2026-06-01",
          submitted_at: submittedAt,
        },
      })
      .select()
      .single();
    if (error) throw error;

    const internalEmail = await sendSynaptiReachEmail({
      subject: `New SynaptiReach waitlist signup: ${body.business_name || body.full_name}`,
      replyTo: email,
      text: [
        `Name: ${body.full_name}`,
        `Business: ${body.business_name || "Not provided"}`,
        `Email: ${email}`,
        `Phone: ${body.phone || "Not provided"}`,
        `Industry: ${body.industry || "Not provided"}`,
        `Desired plan: ${body.desired_plan || "Not provided"}`,
        `Billing preference: ${body.billing_preference || "Not provided"}`,
        `Urgency: ${body.urgency || "Not provided"}`,
        `Position: ${position}`,
        `Founding cohort eligible: ${founding ? "yes" : "no"}`,
        `Submitted: ${submittedAt}`,
        "",
        String(body.main_goal || ""),
      ].join("\n"),
    });

    await supabase.from("crm_notifications").insert({
      title: "New waitlist signup",
      message: `${body.business_name || body.full_name} joined the launch cohort waitlist.`,
      type: "waitlist",
      priority: founding ? "high" : "normal",
      status: "unread",
      record_type: "waitlist_signups",
      record_id: data.id,
      href: "/admin/dashboard/waitlist",
      metadata: { source: "waitlist_signup", email_sent: internalEmail.success, founding_cohort_eligible: founding },
    }).then(() => undefined).catch(() => undefined);

    return NextResponse.json({ success: true, signup: data, emailSent: internalEmail.success, emailSetupRequired: internalEmail.setupRequired });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      { success: false, error: friendly.message, missingSchema: friendly.missingSchema, setupRequired: friendly.setupRequired },
      { status: friendly.missingSchema ? 501 : friendly.setupRequired ? 503 : 500 }
    );
  }
}
