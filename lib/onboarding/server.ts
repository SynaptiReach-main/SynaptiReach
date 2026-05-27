import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { createServerSupabase } from "@/lib/supabase/server";
import { createSupabaseAdmin } from "@/lib/crm/supabaseAdmin";
import { getAIProviderStatus } from "@/lib/ai/providers";
import { getStripeBillingStatus } from "@/lib/billing/stripe";
import { getSubscriptionPlan } from "@/lib/billing/plans";
import { importLeadRows } from "@/lib/crm/importLeadsCsv";

type SaveInput = {
  payload?: Record<string, any>;
  completedSteps?: string[];
  currentStep?: string;
  skippedSteps?: Record<string, boolean>;
  leadRows?: Record<string, any>[];
  importFileName?: string | null;
  complete?: boolean;
};

const SECRET_FIELDS = new Set([
  "openaiKey",
  "geminiKey",
  "openrouterKey",
  "anthropicKey",
  "resendApiKey",
  "twilioAuthToken",
  "twilioAccountSid",
  "ayrshareApiKey",
]);

function isValidHttpUrl(value?: string) {
  if (!value) return false;
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function sanitize(value: any): any {
  if (Array.isArray(value)) return value.map(sanitize);
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => {
      if (SECRET_FIELDS.has(key)) {
        return [key, item ? "__saved_server_side__" : ""];
      }
      return [key, sanitize(item)];
    })
  );
}

function encryptSecret(secret: string) {
  const source =
    process.env.CRM_SECRET_ENCRYPTION_KEY ||
    process.env.NEXTAUTH_SECRET ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "";

  if (!secret || !source) return null;
  const key = crypto.createHash("sha256").update(source).digest();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `v1:${iv.toString("base64")}:${tag.toString("base64")}:${encrypted.toString("base64")}`;
}

function keyLabel(secret: string) {
  return secret ? `.... ${secret.slice(-4)}` : null;
}

export async function getOnboardingUser(request: Request) {
  try {
    const server = await createServerSupabase();
    const {
      data: { user },
    } = await server.auth.getUser();
    if (user) return user;
  } catch {
    // Fall through to bearer-token auth for client-side onboarding saves.
  }

  const authHeader = request.headers.get("authorization") || "";
  const token = authHeader.toLowerCase().startsWith("bearer ")
    ? authHeader.slice(7)
    : "";

  if (
    !token ||
    !isValidHttpUrl(process.env.NEXT_PUBLIC_SUPABASE_URL) ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null;
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user || null;
}

async function ensureWorkspace(supabase: any, user: any, payload: Record<string, any>) {
  const profile = payload.businessProfile || {};
  const businessType = payload.businessType || null;
  const selectedPlan = getSubscriptionPlan(payload.plan?.planSlug);
  const workspaceName =
    profile.businessName?.trim() ||
    user.email?.split("@")[0] ||
    "SynaptiReach Workspace";

  const { data: existing, error: existingError } = await supabase
    .from("workspaces")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (existingError) throw existingError;

  if (existing?.id) {
    const updateValues: Record<string, any> = {
      name: workspaceName,
      industry: profile.industry || existing.industry || null,
      business_type: businessType || existing.business_type || null,
      plan_tier: selectedPlan?.tier || existing.plan_tier || null,
      billing_mode: selectedPlan?.billingMode || existing.billing_mode || null,
    };
    const { data, error } = await supabase
      .from("workspaces")
      .update(updateValues)
      .eq("id", existing.id)
      .select("*")
      .single();
    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from("workspaces")
    .insert({
      owner_id: user.id,
      name: workspaceName,
      industry: profile.industry || null,
      business_type: businessType || null,
      plan_tier: selectedPlan?.tier || null,
      billing_mode: selectedPlan?.billingMode || null,
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

async function ensureMembership(supabase: any, workspaceId: string, userId: string) {
  const { data } = await supabase
    .from("workspace_members")
    .select("id")
    .eq("workspace_id", workspaceId)
    .eq("user_id", userId)
    .limit(1)
    .maybeSingle();
  if (data?.id) return;

  await supabase
    .from("workspace_members")
    .insert({
      workspace_id: workspaceId,
      user_id: userId,
      role: "owner",
      status: "active",
      metadata: { source: "onboarding" },
    })
    .then(() => undefined)
    .catch(() => undefined);
}

async function upsertSession(supabase: any, input: any) {
  const { data: existing, error: existingError } = await supabase
    .from("onboarding_sessions")
    .select("*")
    .eq("workspace_id", input.workspace_id)
    .eq("user_id", input.user_id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (existingError) throw existingError;

  const values = {
    workspace_id: input.workspace_id,
    user_id: input.user_id,
    payload: input.payload,
    completed: Boolean(input.completed),
    metadata: input.metadata,
    updated_at: new Date().toISOString(),
  };

  if (existing?.id) {
    const { data, error } = await supabase
      .from("onboarding_sessions")
      .update(values)
      .eq("id", existing.id)
      .select("*")
      .single();
    if (error) throw error;
    return data;
  }

  const { data, error } = await supabase
    .from("onboarding_sessions")
    .insert(values)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

async function upsertSettings(supabase: any, workspace: any, user: any, payload: Record<string, any>) {
  const profile = payload.businessProfile || {};
  const automation = payload.automation || {};
  const ai = payload.ai || {};
  const integrations = payload.integrations || {};

  const values = {
    workspace_id: workspace.id,
    company_id: workspace.company_id || null,
    user_id: user.id,
    business_name: profile.businessName || workspace.name || null,
    industry: profile.industry || workspace.industry || null,
    website: profile.website || null,
    contact_email: profile.contactEmail || user.email || null,
    phone: profile.phone || null,
    timezone: profile.timezone || "America/Chicago",
    brand_voice: ai.brandVoice || null,
    tone: ai.tone || "professional",
    audience_description: profile.audience || null,
    automation_level: automation.requireApproval === false ? "assisted" : "review_required",
    metadata: {
      source: "onboarding",
      business_type: payload.businessType || null,
      address: profile.address || null,
      team_size: profile.teamSize || null,
      products_services: profile.productsServices || null,
      automation_policy: {
        approval_required: automation.requireApproval !== false,
        allow_auto_assign: Boolean(automation.allowAutoAssign),
        quiet_hours_enabled: Boolean(automation.quietHoursEnabled),
        quiet_hours_start: automation.quietHoursStart || null,
        quiet_hours_end: automation.quietHoursEnd || null,
        sms_compliance_acknowledged: Boolean(automation.smsComplianceAck),
        no_auto_send_acknowledged: Boolean(automation.noAutoSendAck),
      },
      integration_preferences: {
        email: integrations.emailMode || "later",
        sms: integrations.smsMode || "later",
        social: integrations.socialMode || "later",
      },
    },
  };

  const { data: existing, error: existingError } = await supabase
    .from("crm_settings")
    .select("id,metadata")
    .eq("workspace_id", workspace.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (existingError) throw existingError;

  values.metadata = { ...(existing?.metadata || {}), ...values.metadata };

  const result = existing?.id
    ? await supabase.from("crm_settings").update(values).eq("id", existing.id).select("*").single()
    : await supabase.from("crm_settings").insert(values).select("*").single();
  if (result.error) throw result.error;
  return result.data;
}

async function upsertBilling(supabase: any, workspace: any, user: any, payload: Record<string, any>) {
  const plan = getSubscriptionPlan(payload.plan?.planSlug);
  if (!plan) return null;

  const billingIntent = payload.plan?.billingIntent || "continue_later";
  const status =
    billingIntent === "checkout_started"
      ? "checkout_created"
      : billingIntent === "checkout_now" || billingIntent === "start_trial"
        ? "checkout_required"
        : "setup_required";

  const now = new Date();
  const trialEndsAt = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString();

  const { data: existing, error: existingError } = await supabase
    .from("crm_billing_accounts")
    .select("*")
    .eq("workspace_id", workspace.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (existingError) throw existingError;

  const values = {
    workspace_id: workspace.id,
    company_id: workspace.company_id || null,
    user_id: user.id,
    plan_tier: plan.name,
    billing_mode: plan.billingMode,
    status,
    trial_started_at: existing?.trial_started_at || null,
    trial_ends_at: existing?.trial_ends_at || (billingIntent === "start_trial" ? trialEndsAt : null),
    metadata: {
      ...(existing?.metadata || {}),
      selected_plan: plan.name,
      plan_slug: plan.slug,
      billing_intent: billingIntent,
      source: "onboarding",
      stripe_configured: getStripeBillingStatus().configured,
      payment_state_note:
        "Onboarding records plan intent only. Paid or active subscription state must come from Stripe Checkout/webhook confirmation.",
    },
  };

  const result = existing?.id
    ? await supabase.from("crm_billing_accounts").update(values).eq("id", existing.id).select("*").single()
    : await supabase.from("crm_billing_accounts").insert(values).select("*").single();
  if (result.error) throw result.error;
  return result.data;
}

async function upsertConnection(supabase: any, workspace: any, user: any, input: any) {
  if (!input.provider) return null;
  const secret = input.secret || "";
  const encrypted = secret ? encryptSecret(secret) : null;
  if (secret && !encrypted) throw new Error("Server-side secret encryption is not configured.");

  const providerType = input.provider_type || "integration";
  const status = input.status || (secret ? "configured" : "pending");
  const values = {
    workspace_id: workspace.id,
    company_id: workspace.company_id || null,
    user_id: user.id,
    provider: input.provider,
    provider_type: providerType,
    status,
    key_label: secret ? keyLabel(secret) : input.key_label || null,
    encrypted_secret: encrypted || undefined,
    last_verified_at: secret ? new Date().toISOString() : null,
    metadata: {
      ...(input.metadata || {}),
      source: "onboarding",
      encrypted_at_rest: Boolean(encrypted),
      setup_state: status,
    },
  };

  const { data: existing, error: existingError } = await supabase
    .from("crm_provider_connections")
    .select("id")
    .eq("workspace_id", workspace.id)
    .eq("provider", input.provider)
    .eq("provider_type", providerType)
    .limit(1)
    .maybeSingle();
  if (existingError) throw existingError;

  const result = existing?.id
    ? await supabase.from("crm_provider_connections").update(values).eq("id", existing.id).select("*").single()
    : await supabase.from("crm_provider_connections").insert(values).select("*").single();
  if (result.error) throw result.error;
  return result.data;
}

async function saveProviderSetup(supabase: any, workspace: any, user: any, payload: Record<string, any>) {
  const ai = payload.ai || {};
  const integrations = payload.integrations || {};
  const saves = [];

  if (ai.mode) {
    const aiSecret = ai.openaiKey || ai.geminiKey || ai.openrouterKey || ai.anthropicKey || "";
    saves.push(upsertConnection(supabase, workspace, user, {
      provider: ai.mode === "managed" ? "synaptireach_managed_ai" : ai.provider || ai.mode,
      provider_type: "ai",
      status: ai.mode === "managed" ? "configured" : aiSecret ? "configured" : "pending",
      secret: aiSecret,
      metadata: { mode: ai.mode, provider: ai.provider || null, model: ai.model || null },
    }));
  }

  if (integrations.emailMode) {
    saves.push(upsertConnection(supabase, workspace, user, {
      provider: integrations.emailMode === "byok" ? "resend" : "managed_email",
      provider_type: "email",
      status: integrations.emailMode === "skip" ? "skipped" : integrations.resendApiKey ? "configured" : "pending",
      secret: integrations.resendApiKey || "",
      metadata: {
        sender_email: integrations.senderEmail || null,
        domain_status: integrations.emailMode === "managed" ? "domain_verification_required" : null,
      },
    }));
  }

  if (integrations.smsMode) {
    saves.push(upsertConnection(supabase, workspace, user, {
      provider: integrations.smsMode === "byok" ? "twilio" : "managed_sms",
      provider_type: "sms",
      status:
        integrations.smsMode === "skip"
          ? "skipped"
          : integrations.twilioAccountSid && integrations.twilioAuthToken
            ? "configured"
            : "pending",
      secret: integrations.twilioAuthToken || "",
      metadata: {
        from_number_present: Boolean(integrations.twilioFromNumber),
        a2p_acknowledged: Boolean(payload.automation?.smsComplianceAck),
      },
    }));
  }

  if (integrations.socialMode) {
    saves.push(upsertConnection(supabase, workspace, user, {
      provider: "ayrshare",
      provider_type: "social",
      status: integrations.socialMode === "skip" ? "skipped" : integrations.ayrshareApiKey ? "configured" : "pending",
      secret: integrations.ayrshareApiKey || "",
      metadata: { requested_channels: integrations.socialChannels || [] },
    }));
  }

  if (integrations.calendarMode) {
    saves.push(upsertConnection(supabase, workspace, user, {
      provider: "google_calendar",
      provider_type: "calendar",
      status: integrations.calendarMode === "skip" ? "skipped" : "pending",
      metadata: { setup_note: "OAuth connection must be completed from provider settings." },
    }));
  }

  return Promise.all(saves);
}

async function saveStarterLead(supabase: any, workspace: any, user: any, payload: Record<string, any>) {
  const leads = payload.leads || {};
  const starter = leads.starterLead || {};
  if (leads.setupMode !== "manual") return null;
  if (!starter.name && !starter.email && !starter.phone) return null;

  let query = supabase.from("leads").select("id").eq("workspace_id", workspace.id).limit(1);
  if (starter.email) query = query.eq("email", String(starter.email).toLowerCase());
  else if (starter.phone) query = query.eq("phone", starter.phone);
  else query = query.eq("name", starter.name);
  const { data: existing, error: existingError } = await query.maybeSingle();
  if (existingError) throw existingError;
  if (existing?.id) return existing;

  const { data, error } = await supabase
    .from("leads")
    .insert({
      workspace_id: workspace.id,
      company_id: workspace.company_id || null,
      user_id: user.id,
      name: starter.name || null,
      email: starter.email ? String(starter.email).toLowerCase() : null,
      phone: starter.phone || null,
      company: starter.company || null,
      source: "Onboarding",
      status: "new",
      notes: starter.notes || null,
      metadata: { source: "onboarding_manual_starter" },
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

async function saveStaff(supabase: any, workspace: any, user: any, payload: Record<string, any>) {
  const members = Array.isArray(payload.staff?.members) ? payload.staff.members : [];
  const saved = [];

  for (const member of members) {
    if (!member?.name && !member?.email) continue;
    let query = supabase.from("crm_staff").select("id").eq("workspace_id", workspace.id).limit(1);
    if (member.email) query = query.eq("email", String(member.email).toLowerCase());
    else query = query.eq("name", member.name);
    const { data: existing, error: existingError } = await query.maybeSingle();
    if (existingError) throw existingError;
    if (existing?.id) continue;

    const { data, error } = await supabase
      .from("crm_staff")
      .insert({
        workspace_id: workspace.id,
        company_id: workspace.company_id || null,
        user_id: user.id,
        name: member.name || null,
        email: member.email ? String(member.email).toLowerCase() : null,
        phone: member.phone || null,
        title: member.title || null,
        status: "invited",
        metadata: { source: "onboarding", invite_pending: true, email_sent: false },
      })
      .select("*")
      .single();
    if (error) throw error;
    saved.push(data);
  }

  return saved;
}

async function loadWorkspaceSnapshot(supabase: any, workspaceId: string) {
  const [settings, billing, connections, csvImports, staff, leads] = await Promise.all([
    supabase.from("crm_settings").select("*").eq("workspace_id", workspaceId).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("crm_billing_accounts").select("*").eq("workspace_id", workspaceId).order("created_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("crm_provider_connections").select("id,provider,provider_type,status,key_label,last_verified_at,metadata").eq("workspace_id", workspaceId).limit(100),
    supabase.from("crm_csv_imports").select("*").eq("workspace_id", workspaceId).order("created_at", { ascending: false }).limit(10),
    supabase.from("crm_staff").select("id,name,email,title,status,metadata").eq("workspace_id", workspaceId).neq("status", "archived").limit(50),
    supabase.from("leads").select("id,source,imported,metadata").eq("workspace_id", workspaceId).eq("archived", false).limit(500),
  ]);

  return {
    settings: settings.data || null,
    billing: billing.data || null,
    providerConnections: connections.data || [],
    csvImports: csvImports.data || [],
    staff: staff.data || [],
    leads: leads.data || [],
  };
}

function connectionReady(connections: any[], type: string) {
  const relevant = connections.filter((item) => item.provider_type === type);
  if (relevant.some((item) => item.status === "configured")) return "complete";
  if (relevant.some((item) => item.status === "skipped")) return "skipped";
  if (relevant.length > 0) return "pending";
  return "missing";
}

export function calculateOnboardingReadiness(payload: Record<string, any>, snapshot: any) {
  const profile = snapshot.settings || {};
  const billing = snapshot.billing || {};
  const connections = snapshot.providerConnections || [];
  const leadCount = snapshot.leads?.length || 0;
  const importedCount = (snapshot.csvImports || []).reduce((sum: number, item: any) => sum + Number(item.imported_rows || 0), 0);
  const staffCount = snapshot.staff?.length || 0;
  const automation = profile.metadata?.automation_policy || payload.automation || {};

  const checks = [
    {
      id: "business_type",
      label: "Business type selected",
      status: payload.businessType ? "complete" : "missing",
      href: "/onboarding",
    },
    {
      id: "business_profile",
      label: "Business profile saved",
      status: profile.business_name && profile.industry ? "complete" : "missing",
      href: "/dashboard/settings#business",
    },
    {
      id: "plan",
      label: "Plan or trial preference saved",
      status: billing.plan_tier ? "complete" : "missing",
      href: "/dashboard/settings#billing",
    },
    {
      id: "billing",
      label: "Billing setup state is explicit",
      status:
        billing.status === "checkout_created" || billing.status === "active"
          ? "complete"
          : billing.status
            ? "pending"
            : "missing",
      href: "/dashboard/settings#billing",
      detail: billing.status || "No billing setup state saved yet.",
    },
    {
      id: "ai",
      label: "AI processing mode selected",
      status: connectionReady(connections, "ai"),
      href: "/dashboard/settings#providers",
    },
    {
      id: "email",
      label: "Email integration reviewed",
      status: connectionReady(connections, "email"),
      href: "/dashboard/settings#integrations",
    },
    {
      id: "sms",
      label: "SMS integration reviewed",
      status: connectionReady(connections, "sms"),
      href: "/dashboard/settings#integrations",
    },
    {
      id: "lead_setup",
      label: "Lead import or starter contact prepared",
      status: leadCount > 0 || importedCount > 0 || payload.leads?.setupMode === "skip" ? (payload.leads?.setupMode === "skip" ? "skipped" : "complete") : "missing",
      href: "/dashboard/leads",
      detail: leadCount > 0 ? `${leadCount} lead record(s)` : "No lead records saved yet.",
    },
    {
      id: "staff",
      label: "Staff setup reviewed",
      status: staffCount > 0 || payload.staff?.setupMode === "solo" ? (staffCount > 0 ? "complete" : "skipped") : "missing",
      href: "/dashboard/settings#staff",
    },
    {
      id: "automation_safety",
      label: "Automation safety preferences saved",
      status: automation.no_auto_send_acknowledged || automation.noAutoSendAck ? "complete" : "missing",
      href: "/dashboard/settings#automation",
    },
  ];

  const completeWeight = checks.reduce((sum, check) => {
    if (check.status === "complete") return sum + 1;
    if (check.status === "skipped" || check.status === "pending") return sum + 0.5;
    return sum;
  }, 0);

  return {
    score: Math.round((completeWeight / checks.length) * 100),
    checks,
    providerRuntime: {
      aiProviders: getAIProviderStatus(),
      stripe: getStripeBillingStatus(),
      resendReady: Boolean(process.env.RESEND_API_KEY && process.env.RESEND_FROM_EMAIL),
      twilioReady: Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN),
      ayrshareReady: Boolean(process.env.AYRSHARE_API_KEY),
    },
  };
}

export async function loadOnboardingState(request: Request) {
  const user = await getOnboardingUser(request);
  if (!user) {
    return { success: false, status: 401, error: "Unauthorized" };
  }

  const supabase = createSupabaseAdmin();
  const { data: workspace, error: workspaceError } = await supabase
    .from("workspaces")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();
  if (workspaceError) throw workspaceError;

  if (!workspace?.id) {
    return {
      success: true,
      user: { id: user.id, email: user.email },
      workspace: null,
      session: null,
      payload: null,
      readiness: calculateOnboardingReadiness({}, {}),
      snapshot: {},
    };
  }

  const { data: session, error: sessionError } = await supabase
    .from("onboarding_sessions")
    .select("*")
    .eq("workspace_id", workspace.id)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (sessionError) throw sessionError;

  const snapshot = await loadWorkspaceSnapshot(supabase, workspace.id);
  const payload = session?.payload || {};

  return {
    success: true,
    user: { id: user.id, email: user.email },
    workspace,
    session,
    payload,
    readiness: calculateOnboardingReadiness(payload, snapshot),
    snapshot,
  };
}

export async function saveOnboardingState(request: Request, input: SaveInput) {
  const user = await getOnboardingUser(request);
  if (!user) {
    return { success: false, status: 401, error: "Unauthorized" };
  }

  const rawPayload = input.payload || {};
  const payload = sanitize(rawPayload);
  const supabase = createSupabaseAdmin();
  const workspace = await ensureWorkspace(supabase, user, payload);
  await ensureMembership(supabase, workspace.id, user.id);
  const settings = await upsertSettings(supabase, workspace, user, payload);
  const billing = await upsertBilling(supabase, workspace, user, payload);
  await saveProviderSetup(supabase, workspace, user, rawPayload);
  const starterLead = await saveStarterLead(supabase, workspace, user, payload);
  const savedStaff = await saveStaff(supabase, workspace, user, payload);

  let importResult = null;
  if (Array.isArray(input.leadRows) && input.leadRows.length > 0) {
    importResult = await importLeadRows(input.leadRows, workspace.id, {
      companyId: workspace.company_id || null,
      userId: user.id,
      fileName: input.importFileName || null,
      source: "onboarding_csv",
    });
  }

  const snapshot = await loadWorkspaceSnapshot(supabase, workspace.id);
  const readiness = calculateOnboardingReadiness(payload, snapshot);
  const session = await upsertSession(supabase, {
    workspace_id: workspace.id,
    user_id: user.id,
    payload,
    completed: Boolean(input.complete),
    metadata: {
      source: "onboarding_wizard",
      current_step: input.currentStep || null,
      completed_steps: input.completedSteps || [],
      skipped_steps: input.skippedSteps || {},
      readiness_score: readiness.score,
      completed_at: input.complete ? new Date().toISOString() : null,
    },
  });

  return {
    success: true,
    user: { id: user.id, email: user.email },
    workspace,
    session,
    settings,
    billing,
    readiness,
    snapshot,
    starterLead,
    savedStaff,
    importResult,
    redirect: "/dashboard",
  };
}
