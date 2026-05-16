import { NextResponse } from "next/server";
import { createSupabaseAdmin, friendlySupabaseError } from "@/lib/crm/supabaseAdmin";
import { getAIProviderStatus } from "@/lib/ai/providers";

const SETTING_FIELDS = [
  "workspace_id",
  "business_name",
  "industry",
  "website",
  "contact_email",
  "phone",
  "default_sender_name",
  "default_sender_email",
  "timezone",
  "brand_voice",
  "tone",
  "cta_style",
  "audience_description",
  "automation_level",
  "metadata",
];

function pickSettings(body: any) {
  return SETTING_FIELDS.reduce((acc: Record<string, any>, key) => {
    if (body[key] !== undefined) acc[key] = body[key];
    return acc;
  }, {});
}

export async function GET() {
  try {
    const supabase = createSupabaseAdmin();
    const aiProviders = getAIProviderStatus();
    const { data, error } = await supabase
      .from("crm_settings")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      settings: data || null,
      aiProviders,
      integrations: {
        supabase: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
        openai: {
          configured: Boolean(process.env.OPENAI_API_KEY),
          enabled: process.env.AI_ENABLE_OPENAI === "true",
          status:
            process.env.AI_ENABLE_OPENAI === "true"
              ? process.env.OPENAI_API_KEY
                ? "configured"
                : "missing"
              : "disabled",
        },
        gemini: {
          configured: Boolean(process.env.GEMINI_API_KEY),
          status: process.env.GEMINI_API_KEY ? "configured" : "missing",
        },
        openrouter: {
          configured: Boolean(process.env.OPENROUTER_API_KEY),
          status: process.env.OPENROUTER_API_KEY ? "configured" : "missing",
          model: aiProviders.openrouter_model,
        },
        resend: Boolean(process.env.RESEND_API_KEY),
        twilio: Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
        ayrshare: Boolean(process.env.AYRSHARE_API_KEY),
        vercelCron: Boolean(process.env.CRON_SECRET || process.env.VERCEL),
      },
    });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      { success: false, error: friendly.message, missingSchema: friendly.missingSchema },
      { status: friendly.missingSchema ? 501 : 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const supabase = createSupabaseAdmin();
    const values = pickSettings(body);

    if (body.id) {
      const { data, error } = await supabase
        .from("crm_settings")
        .update(values)
        .eq("id", body.id)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({ success: true, settings: data });
    }

    const { data, error } = await supabase
      .from("crm_settings")
      .insert(values)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, settings: data });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      { success: false, error: friendly.message, missingSchema: friendly.missingSchema },
      { status: friendly.missingSchema ? 501 : 500 }
    );
  }
}
