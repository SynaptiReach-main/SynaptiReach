import { NextResponse } from "next/server";
import { createSupabaseAdmin, friendlySupabaseError } from "@/lib/crm/supabaseAdmin";
import { getOnboardingUser } from "@/lib/onboarding/server";

const providerMap: Record<string, { provider: string; providerType: string; label: string }> = {
  gemini: { provider: "gemini", providerType: "ai", label: "Gemini" },
  openrouter: { provider: "openrouter", providerType: "ai", label: "OpenRouter" },
  openai: { provider: "openai", providerType: "ai", label: "OpenAI" },
  resend: { provider: "resend", providerType: "email", label: "Resend" },
  twilio: { provider: "twilio", providerType: "sms", label: "Twilio" },
  ayrshare: { provider: "ayrshare", providerType: "social", label: "Ayrshare" },
};

export async function POST(request: Request) {
  try {
    const user = await getOnboardingUser(request);
    if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const body = await request.json().catch(() => ({}));
    const key = String(body.provider || "").toLowerCase();
    const provider = providerMap[key];
    if (!provider) {
      return NextResponse.json({ success: false, error: "Choose a valid provider to test." }, { status: 400 });
    }
    if (key === "openai" && process.env.AI_ENABLE_OPENAI !== "true") {
      return NextResponse.json({
        success: true,
        setupRequired: true,
        status: "disabled",
        message: "OpenAI is optional and is disabled unless AI_ENABLE_OPENAI=true.",
      });
    }

    const supabase = createSupabaseAdmin();
    const { data: workspace, error: workspaceError } = await supabase
      .from("workspaces")
      .select("id,company_id")
      .eq("owner_id", user.id)
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();
    if (workspaceError) throw workspaceError;
    if (!workspace?.id) {
      return NextResponse.json({ success: true, setupRequired: true, status: "missing", message: "Create the workspace first by saving onboarding." });
    }

    const { data: connection, error: connectionError } = await supabase
      .from("crm_provider_connections")
      .select("id,status,key_label,metadata")
      .eq("workspace_id", workspace.id)
      .eq("provider", provider.provider)
      .eq("provider_type", provider.providerType)
      .limit(1)
      .maybeSingle();
    if (connectionError) throw connectionError;

    if (!connection?.id || !connection.key_label) {
      return NextResponse.json({
        success: true,
        setupRequired: true,
        status: "missing",
        message: `${provider.label} setup is required. Save the provider key first. This test does not send campaigns, email, SMS, or social posts.`,
      });
    }

    const metadata = {
      ...(connection.metadata || {}),
      provider_test: {
        checked_at: new Date().toISOString(),
        status: "ready_for_live_test",
        message: "Encrypted key is saved. Live provider reachability testing requires provider-specific validation and does not send customer-facing actions.",
      },
    };

    await supabase
      .from("crm_provider_connections")
      .update({ metadata, status: connection.status === "configured" ? "configured" : "pending" })
      .eq("id", connection.id);

    return NextResponse.json({
      success: true,
      setupRequired: false,
      status: "ready_for_live_test",
      keyLabel: connection.key_label,
      message: `${provider.label} setup is saved server-side. No real campaign, email, SMS, or social post was sent.`,
    });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      { success: false, error: friendly.message, missingSchema: friendly.missingSchema, setupRequired: friendly.setupRequired },
      { status: friendly.missingSchema ? 501 : friendly.setupRequired ? 503 : 500 }
    );
  }
}
