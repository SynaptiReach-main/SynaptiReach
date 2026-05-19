import crypto from "crypto";
import { createSupabaseAdmin, friendlySupabaseError } from "@/lib/crm/supabaseAdmin";
import { getWorkspaceContext } from "@/lib/auth/getWorkspaceContext";

export const SIMULATION_VERSION = "2026-05-19";
const SIMULATION_SOURCE = "synaptireach_test_workspace";
const DEFAULT_TEST_EMAIL = "donovan.mike966@gmail.com";

type SimulationProfile = "quiet" | "normal" | "high_growth";

type SimulationAuth = {
  allowed: boolean;
  setupRequired?: boolean;
  workspaceId?: string | null;
  companyId?: string | null;
  userId?: string | null;
  reason?: string;
};

const mutableTables = [
  "crm_test_simulation_events",
  "crm_test_simulation_snapshots",
  "crm_test_simulation_settings",
  "crm_test_simulation_state",
  "crm_billing_events",
  "crm_credit_pack_purchases",
  "crm_usage_events",
  "crm_billing_accounts",
  "crm_provider_connections",
  "crm_audit_logs",
  "crm_service_orders",
  "crm_service_requests",
  "waitlist_signups",
  "contact_submissions",
  "crm_notifications",
  "crm_agent_runs",
  "crm_ai_recommendations",
  "marketing_ai_recommendations",
  "crm_workflow_runs",
  "crm_workflows",
  "crm_messages",
  "crm_conversations",
  "communications",
  "marketing_events",
  "marketing_interactions",
  "marketing_campaign_logs",
  "marketing_campaign_steps",
  "marketing_campaigns",
  "crm_appointments",
  "crm_tasks",
  "crm_deals",
  "lead_activities",
  "leads",
  "crm_staff_permissions",
  "crm_staff",
  "crm_roles",
  "crm_settings",
];

function envList(name: string) {
  return (process.env[name] || "")
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function testWorkspaceIds() {
  return envList("CRM_TEST_WORKSPACE_IDS");
}

function testAccountEmails() {
  return envList("CRM_TEST_ACCOUNT_EMAILS");
}

function simulationEnabled() {
  return process.env.CRM_ENABLE_TEST_SIMULATION === "true" || testWorkspaceIds().length > 0 || testAccountEmails().length > 0;
}

function hashUuid(input: string) {
  const hex = crypto.createHash("md5").update(input).digest("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-4${hex.slice(13, 16)}-${((parseInt(hex.slice(16, 18), 16) & 0x3f) | 0x80).toString(16)}${hex.slice(18, 20)}-${hex.slice(20, 32)}`;
}

async function findAuthUserByEmail(supabase: ReturnType<typeof createSupabaseAdmin>, email: string) {
  const normalized = email.toLowerCase();
  for (let page = 1; page <= 10; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    const found = data.users.find((user) => user.email?.toLowerCase() === normalized);
    if (found) return found;
    if (data.users.length < 1000) break;
  }
  return null;
}

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return date.toISOString();
}

function daysFromNow(days: number, hour = 10) {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
}

function testMeta(extra: Record<string, any> = {}) {
  return {
    is_test_data: true,
    simulation_source: SIMULATION_SOURCE,
    simulation_version: SIMULATION_VERSION,
    generated_at: new Date().toISOString(),
    ...extra,
  };
}

function pick<T>(items: T[], index: number) {
  return items[index % items.length];
}

async function requireSimulationAccess(request: Request, body?: any): Promise<SimulationAuth> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return {
      allowed: false,
      setupRequired: true,
      reason: "Supabase service credentials are required for test simulation controls.",
    };
  }

  const url = new URL(request.url);
  const requestedWorkspaceId =
    body?.workspace_id ||
    body?.workspaceId ||
    request.headers.get("x-workspace-id") ||
    url.searchParams.get("workspace_id") ||
    url.searchParams.get("workspaceId");
  const requestedCompanyId =
    body?.company_id ||
    body?.companyId ||
    request.headers.get("x-company-id") ||
    url.searchParams.get("company_id") ||
    url.searchParams.get("companyId");
  const providedSecret =
    body?.seed_secret ||
    body?.secret ||
    request.headers.get("x-simulation-secret") ||
    url.searchParams.get("secret");
  const configuredSecret = process.env.CRM_TEST_SIMULATION_SEED_SECRET || "";
  const allowedWorkspaceIds = testWorkspaceIds();
  const allowedEmails = testAccountEmails();

  let context = null;
  try {
    context = await getWorkspaceContext(request);
  } catch {
    context = null;
  }

  const defaultEmailWorkspaceId =
    allowedEmails.length === 1 ? hashUuid(`test-workspace:${allowedEmails[0]}`) : null;
  const workspaceId =
    requestedWorkspaceId ||
    context?.workspaceId ||
    allowedWorkspaceIds[0] ||
    defaultEmailWorkspaceId ||
    null;
  const companyId = requestedCompanyId || context?.companyId || null;
  const secretAllowed = Boolean(configuredSecret && providedSecret && providedSecret === configuredSecret);
  const workspaceAllowed = Boolean(
    context?.isAuthenticated &&
      workspaceId &&
      allowedWorkspaceIds.includes(String(workspaceId).toLowerCase())
  );
  let emailAllowed = false;

  if (!secretAllowed && !workspaceAllowed && context?.userId && allowedEmails.length > 0) {
    try {
      const admin = createSupabaseAdmin();
      const { data } = await admin.auth.admin.getUserById(context.userId);
      const email = data?.user?.email?.toLowerCase();
      emailAllowed = Boolean(email && allowedEmails.includes(email));
    } catch {
      emailAllowed = false;
    }
  }

  if (!simulationEnabled()) {
    return {
      allowed: false,
      setupRequired: true,
      workspaceId,
      companyId,
      userId: context?.userId || null,
      reason: "Set CRM_ENABLE_TEST_SIMULATION=true and CRM_TEST_WORKSPACE_IDS to enable the isolated test workspace.",
    };
  }

  if (!workspaceId) {
    return {
      allowed: false,
      setupRequired: true,
      reason: "Set CRM_TEST_WORKSPACE_IDS or pass a configured workspace_id.",
    };
  }

  if (!secretAllowed && !workspaceAllowed && !emailAllowed) {
    return {
      allowed: false,
      workspaceId,
      companyId,
      userId: context?.userId || null,
      reason: "Simulation controls are restricted to configured CRM_TEST_WORKSPACE_IDS or the seed secret.",
    };
  }

  return {
    allowed: true,
    workspaceId,
    companyId,
    userId: context?.userId || body?.user_id || body?.userId || null,
  };
}

async function upsertRows(supabase: ReturnType<typeof createSupabaseAdmin>, table: string, rows: any[]) {
  if (rows.length === 0) return 0;
  const { error } = await supabase.from(table).upsert(rows, { onConflict: "id" });
  if (error) throw error;
  return rows.length;
}

async function loadMarkedTestWorkspace(supabase: ReturnType<typeof createSupabaseAdmin>, workspaceId: string) {
  const { data, error } = await supabase
    .from("workspaces")
    .select("id, company_id, owner_id, is_test_workspace, simulation_enabled")
    .eq("id", workspaceId)
    .maybeSingle();

  if (error) {
    const friendly = friendlySupabaseError(error);
    return {
      workspace: null,
      response: {
        allowed: false,
        setupRequired: friendly.missingSchema,
        reason: friendly.message,
      },
    };
  }

  if (!data?.is_test_workspace) {
    return {
      workspace: null,
      response: {
        allowed: false,
        setupRequired: true,
        reason:
          "Run POST /api/test/simulation/bootstrap first. Simulation controls only run for workspaces explicitly marked as test/simulation.",
      },
    };
  }

  return { workspace: data, response: null };
}

function makeLeads(workspaceId: string, companyId: string | null, userId: string | null) {
  const first = ["Avery", "Jordan", "Morgan", "Riley", "Taylor", "Casey", "Parker", "Quinn", "Hayden", "Reese", "Cameron", "Drew"];
  const last = ["Stone", "Miller", "Hayes", "Patel", "Brooks", "Rivera", "Kim", "Carter", "Reed", "Coleman", "Nguyen", "Bennett"];
  const industries = ["roofing", "HVAC", "legal", "healthcare", "real estate", "med spa", "dental", "home services", "agency", "ecommerce", "consulting"];
  const sources = ["website", "referral", "Google Business Profile", "Facebook", "Instagram", "LinkedIn", "paid ads", "cold outreach", "CSV import", "webinar/event", "contact form", "waitlist"];
  const statuses = ["new", "contacted", "qualified", "nurture", "converted", "lost", "archived"];
  return Array.from({ length: 84 }, (_, index) => {
    const name = `${pick(first, index)} ${pick(last, index * 3)}`;
    const industry = pick(industries, index);
    const status = pick(statuses, index + Math.floor(index / 7));
    const score = Math.min(99, 18 + ((index * 13) % 82));
    const temperature = score >= 75 ? "hot" : score >= 45 ? "warm" : "cold";
    return {
      id: hashUuid(`${workspaceId}:lead:${index}`),
      workspace_id: workspaceId,
      company_id: companyId,
      user_id: userId,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, ".")}@example.test`,
      phone: `+1555${String(1000000 + index * 7919).slice(0, 7)}`,
      company: `${pick(["Northstar", "Summit", "Clearline", "LaunchLab", "BluePeak", "Vertex", "Cedar"], index)} ${pick(["Group", "Systems", "Partners", "Studio", "Clinic", "Services"], index + 2)}`,
      source: pick(sources, index),
      status,
      score,
      tags: [industry, temperature, pick(["priority", "demo", "retargeting", "needs-review"], index)],
      notes: `Simulated ${temperature} ${industry} lead. ${index % 11 === 0 ? "Looks similar to another lead for duplicate review." : "Ready for normal CRM review."}`,
      last_interaction: daysAgo((index * 2) % 42),
      archived: status === "archived",
      imported: index % 9 === 0,
      created_at: daysAgo((index * 3) % 60),
      updated_at: daysAgo((index * 2) % 25),
      ai_score_explanation: `Rule-based score ${score}: ${temperature} intent, ${pick(sources, index)} source, recent activity weighting.`,
      metadata: testMeta({
        lead_id: `SIM-LEAD-${index + 1}`,
        industry,
        temperature,
        target_need: pick(["more booked consultations", "faster follow-up", "pipeline cleanup", "campaign launch", "review generation"], index),
      }),
    };
  });
}

function makeStaff(workspaceId: string, companyId: string | null, userId: string | null) {
  return ["Owner", "Sales Manager", "Marketing Lead", "Service Coordinator", "AI Reviewer", "Support Rep"].map((title, index) => ({
    id: hashUuid(`${workspaceId}:staff:${index}`),
    workspace_id: workspaceId,
    company_id: companyId,
    user_id: index === 0 ? userId : null,
    name: ["Nina Park", "Marcus Lee", "Elena Brooks", "Theo Martin", "Priya Shah", "Sam Carter"][index],
    email: `demo.staff.${index + 1}@example.test`,
    phone: `+15559876${index}${index}`,
    status: "active",
    title,
    metadata: testMeta({ role: title }),
  }));
}

function makeDeals(workspaceId: string, companyId: string | null, userId: string | null, leads: any[]) {
  const stages = ["new", "discovery", "proposal", "negotiation", "won", "lost"];
  return Array.from({ length: 32 }, (_, index) => {
    const lead = leads[index % leads.length];
    const stage = pick(stages, index);
    const value = 1500 + ((index * 2250) % 48000);
    const probability = stage === "won" ? 100 : stage === "lost" ? 0 : [15, 30, 55, 75][index % 4];
    return {
      id: hashUuid(`${workspaceId}:deal:${index}`),
      workspace_id: workspaceId,
      company_id: companyId,
      user_id: userId,
      lead_id: lead.id,
      title: `${lead.company} ${pick(["Launch System", "Growth Engine", "Automation Setup", "AI CRM Rollout"], index)}`,
      company: lead.company,
      value,
      stage,
      status: stage === "won" ? "won" : stage === "lost" ? "lost" : "open",
      probability,
      expected_close_date: daysFromNow((index % 19) - 6, 14),
      notes: index % 6 === 0 ? "Stale simulated deal that should trigger pipeline risk review." : "Simulated active opportunity.",
      archived: false,
      created_at: daysAgo((index * 4) % 70),
      updated_at: daysAgo(index % 9),
      metadata: testMeta({ weighted_value: Math.round(value * probability / 100), stale: index % 6 === 0 }),
    };
  });
}

function makeTasks(workspaceId: string, companyId: string | null, userId: string | null, leads: any[], deals: any[], staff: any[]) {
  const titles = ["Follow up with hot lead", "Review campaign draft", "Call proposal stakeholder", "Clean duplicate lead", "Prepare service quote", "Approve AI recommendation", "Assign onboarding checklist"];
  return Array.from({ length: 64 }, (_, index) => {
    const status = index % 5 === 0 ? "completed" : "open";
    return {
      id: hashUuid(`${workspaceId}:task:${index}`),
      workspace_id: workspaceId,
      company_id: companyId,
      user_id: userId,
      lead_id: leads[index % leads.length].id,
      deal_id: deals[index % deals.length].id,
      title: `${pick(titles, index)} #${index + 1}`,
      details: "Simulated task for CRM workflow, follow-up, service delivery, or AI review testing.",
      status,
      priority: pick(["low", "medium", "high", "urgent"], index),
      assigned_to: staff[index % staff.length].name,
      assigned_staff_id: staff[index % staff.length].id,
      due_date: status === "completed" ? daysAgo(index % 10) : daysFromNow((index % 18) - 8, 9),
      completed_at: status === "completed" ? daysAgo(index % 8) : null,
      created_at: daysAgo(index % 35),
      updated_at: daysAgo(index % 12),
      metadata: testMeta({ recommendation_source: index % 4 === 0 ? "mini_brain" : "manual" }),
    };
  });
}

function makeCampaigns(workspaceId: string, companyId: string | null, userId: string | null) {
  const types = ["email", "sms", "social", "landing_page", "retargeting", "nurture"];
  const statuses = ["draft", "scheduled", "active", "sent", "cancelled"];
  return Array.from({ length: 22 }, (_, index) => {
    const delivered = 80 + index * 17;
    const opened = Math.round(delivered * (0.18 + (index % 5) * 0.07));
    const clicked = Math.round(opened * (0.07 + (index % 4) * 0.04));
    return {
      id: hashUuid(`${workspaceId}:campaign:${index}`),
      workspace_id: workspaceId,
      company_id: companyId,
      user_id: userId,
      name: `${pick(["Spring", "Launch", "Winback", "Referral", "No-show", "Review"], index)} ${pick(types, index)} campaign`,
      type: pick(types, index),
      status: pick(statuses, index),
      delivered_count: delivered,
      opened_count: opened,
      clicked_count: clicked,
      converted_count: Math.round(clicked * (index % 3 === 0 ? 0.28 : 0.11)),
      ai_generated: index % 3 === 0,
      campaign_mode: "review_gated",
      send_date: daysFromNow((index % 12) - 5, 11),
      send_time: daysFromNow((index % 12) - 5, 11),
      scheduled_for: daysFromNow((index % 12) - 5, 11),
      audience: pick(["Hot leads", "Nurture segment", "Opened not clicked", "Lost deals", "Waitlist"], index),
      stagger: 50,
      stagger_size: 50,
      subject: `${pick(["Ready to grow?", "Quick follow-up", "Your CRM plan", "Still interested?"], index)} [Simulation]`,
      content: "Simulated review-gated campaign body for QA and demo workflows.",
      body: "Simulated review-gated campaign body for QA and demo workflows.",
      platforms: ["linkedin", "facebook"],
      created_at: daysAgo(index * 2),
      metadata: testMeta({ unsubscribed_count: index % 4, failed_count: index % 3 }),
    };
  });
}

function makeAppointments(workspaceId: string, companyId: string | null, userId: string | null, leads: any[], deals: any[]) {
  const statuses = ["scheduled", "completed", "cancelled", "no_show", "proposed"];
  return Array.from({ length: 26 }, (_, index) => ({
    id: hashUuid(`${workspaceId}:appointment:${index}`),
    workspace_id: workspaceId,
    company_id: companyId,
    user_id: userId,
    lead_id: leads[index % leads.length].id,
    deal_id: deals[index % deals.length].id,
    title: `${pick(["Discovery Call", "Proposal Review", "CRM Setup Session", "Campaign Planning"], index)} with ${leads[index % leads.length].company}`,
    starts_at: daysFromNow((index % 18) - 7, 10 + (index % 5)),
    ends_at: daysFromNow((index % 18) - 7, 11 + (index % 5)),
    status: pick(statuses, index),
    location: index % 2 === 0 ? "Video consultation" : "Phone call",
    notes: "Simulated appointment for calendar and intent-detection testing.",
    created_at: daysAgo(index % 30),
    updated_at: daysAgo(index % 11),
    metadata: testMeta({ intent_detected: index % 4 === 0 }),
  }));
}

function makeCommunications(workspaceId: string, companyId: string | null, userId: string | null, leads: any[], campaigns: any[]) {
  const conversations = leads.slice(0, 26).map((lead, index) => ({
    id: hashUuid(`${workspaceId}:conversation:${index}`),
    workspace_id: workspaceId,
    company_id: companyId,
    user_id: userId,
    lead_id: lead.id,
    campaign_id: campaigns[index % campaigns.length].id,
    subject: `${pick(["Consultation", "Proposal", "Follow-up", "Campaign question"], index)} - ${lead.company}`,
    channel: pick(["email", "sms"], index),
    status: index % 7 === 0 ? "needs_response" : "open",
    latest_message_preview: index % 5 === 0 ? "Can we schedule a call this week?" : "Thanks, send more details.",
    latest_message_at: daysAgo(index % 12),
    unread_count: index % 4 === 0 ? 1 : 0,
    created_at: daysAgo(index + 8),
    updated_at: daysAgo(index % 9),
    metadata: testMeta({ appointment_intent: index % 5 === 0 }),
  }));
  const communications = Array.from({ length: 90 }, (_, index) => {
    const lead = leads[index % leads.length];
    const conversation = conversations[index % conversations.length];
    const direction = index % 3 === 0 ? "inbound" : index % 7 === 0 ? "internal" : "outbound";
    const channel = direction === "internal" ? "note" : pick(["email", "sms"], index);
    return {
      id: hashUuid(`${workspaceId}:communication:${index}`),
      workspace_id: workspaceId,
      company_id: companyId,
      user_id: userId,
      lead_id: lead.id,
      campaign_id: campaigns[index % campaigns.length].id,
      conversation_id: conversation.id,
      channel,
      direction,
      recipient: lead.email,
      subject: channel === "email" ? `Re: ${conversation.subject}` : null,
      content: index % 5 === 0 ? "Can we book a time to talk this week?" : "Simulated CRM conversation message for review-gated communication testing.",
      status: index % 13 === 0 ? "failed" : index % 11 === 0 ? "draft" : "sent",
      created_at: daysAgo(index % 26),
      updated_at: daysAgo(index % 13),
      metadata: testMeta({ rule_based_draft: index % 11 === 0, requires_response: direction === "inbound" && index % 4 === 0 }),
    };
  });
  const messages = communications.map((item, index) => ({
    id: hashUuid(`${workspaceId}:message:${index}`),
    workspace_id: workspaceId,
    company_id: companyId,
    user_id: userId,
    conversation_id: item.conversation_id,
    lead_id: item.lead_id,
    campaign_id: item.campaign_id,
    channel: item.channel,
    direction: item.direction,
    subject: item.subject,
    content: item.content,
    status: item.status,
    created_at: item.created_at,
    updated_at: item.updated_at,
    metadata: item.metadata,
  }));
  return { conversations, communications, messages };
}

function makeWorkflows(workspaceId: string, companyId: string | null, userId: string | null) {
  const names = [
    "New lead follow-up workflow",
    "Missed follow-up reminder",
    "Opened-not-clicked campaign follow-up",
    "High-intent lead alert",
    "Appointment confirmation workflow",
    "No-show follow-up workflow",
    "Stale deal recovery workflow",
    "Waitlist invite workflow",
    "Failed payment recovery workflow",
    "AI recommendation review workflow",
    "Conversation unanswered reminder workflow",
    "Duplicate lead review workflow",
  ];
  const workflows = names.map((name, index) => ({
    id: hashUuid(`${workspaceId}:workflow:${index}`),
    workspace_id: workspaceId,
    company_id: companyId,
    user_id: userId,
    name,
    status: pick(["active", "active", "paused", "draft"], index),
    trigger_type: pick(["lead_created", "campaign_opened", "appointment_status", "deal_stale", "ai_recommendation"], index),
    condition: "Simulation rule condition",
    action: "Create review-gated task, notification, or draft.",
    actions: [{ type: "create_task", review_required: true }],
    last_run_at: daysAgo(index % 8),
    success_count: 2 + index,
    failure_count: index % 4 === 0 ? 1 : 0,
    created_at: daysAgo(index + 14),
    updated_at: daysAgo(index % 5),
    metadata: testMeta({ summary: "Simulated workflow template with review-gated actions." }),
  }));
  const runs = Array.from({ length: 34 }, (_, index) => ({
    id: hashUuid(`${workspaceId}:workflow-run:${index}`),
    workspace_id: workspaceId,
    company_id: companyId,
    user_id: userId,
    workflow_id: workflows[index % workflows.length].id,
    status: index % 9 === 0 ? "failed" : "completed",
    started_at: daysAgo(index % 18),
    completed_at: index % 9 === 0 ? null : daysAgo(index % 18),
    logs: [{ message: "Simulation workflow evaluated CRM signal.", review_required: true }],
    error: index % 9 === 0 ? "Simulated failed run for alert testing." : null,
    metadata: testMeta({ signal: pick(["hot_lead", "stale_deal", "overdue_task", "inbound_reply"], index) }),
  }));
  return { workflows, runs };
}

function makeRecommendations(workspaceId: string, companyId: string | null, userId: string | null, leads: any[], campaigns: any[]) {
  const types = ["lead_scoring", "follow_up", "campaign_optimization", "workflow", "task", "appointment", "pipeline_risk", "billing_usage"];
  const statuses = ["pending", "approved", "denied", "dismissed", "converted_to_task", "converted_to_workflow"];
  const crm = Array.from({ length: 18 }, (_, index) => ({
    id: hashUuid(`${workspaceId}:crm-rec:${index}`),
    workspace_id: workspaceId,
    company_id: companyId,
    user_id: userId,
    type: pick(types, index),
    title: `${pick(["Review hot lead", "Recover stale deal", "Approve campaign variant", "Create follow-up task", "Watch cap usage"], index)} #${index + 1}`,
    description: "Rule-based simulation recommendation generated without external AI calls.",
    action: pick(["review_lead", "review_pipeline", "create_variant", "review_tasks", "open_billing"], index),
    status: pick(statuses, index),
    confidence: 0.68 + ((index % 6) / 20),
    created_at: daysAgo(index % 16),
    updated_at: daysAgo(index % 7),
    metadata: testMeta({ provider: "mini_brain", lead_id: leads[index % leads.length].id }),
  }));
  const marketing = Array.from({ length: 14 }, (_, index) => ({
    id: hashUuid(`${workspaceId}:marketing-rec:${index}`),
    workspace_id: workspaceId,
    company_id: companyId,
    user_id: userId,
    campaign_id: campaigns[index % campaigns.length].id,
    recommendation_type: "campaign_optimization",
    priority: pick(["medium", "high", "urgent"], index),
    title: `${pick(["Improve CTA", "Retarget openers", "Pause weak SMS", "Test subject line"], index)} #${index + 1}`,
    description: "Simulated marketing recommendation for approval/deny testing.",
    estimated_impact: `${8 + index}% estimated engagement lift`,
    accepted: index % 5 === 0,
    dismissed: index % 6 === 0,
    status: index % 5 === 0 ? "approved" : index % 6 === 0 ? "dismissed" : "pending_review",
    created_at: daysAgo(index % 12),
    updated_at: daysAgo(index % 6),
    metadata: testMeta({ provider: "mini_brain" }),
  }));
  const agentRuns = Array.from({ length: 18 }, (_, index) => ({
    id: hashUuid(`${workspaceId}:agent-run:${index}`),
    workspace_id: workspaceId,
    company_id: companyId,
    user_id: userId,
    agent: pick(["executive", "workflow", "lead_scoring", "campaign_optimization", "task_recommendation", "pipeline_risk"], index),
    status: index % 11 === 0 ? "failed" : "completed",
    summary: { headline: "Simulation agent reviewed CRM signals", signals_reviewed: 12 + index },
    recommendations: crm.slice(index % 5, (index % 5) + 3),
    actions: [{ type: "review_required", label: "Review recommendation" }],
    confidence: 0.72,
    data_used: { leads: leads.length, campaigns: campaigns.length },
    provider: "mini_brain",
    model: "deterministic-rules",
    fallback_used: true,
    provider_errors: [],
    error: index % 11 === 0 ? "Simulated provider failure, built-in intelligence fallback used." : null,
    created_at: daysAgo(index % 10),
  }));
  return { crm, marketing, agentRuns };
}

function makeOperationalRows(workspaceId: string, companyId: string | null, userId: string | null, leads: any[]) {
  const notifications = Array.from({ length: 24 }, (_, index) => ({
    id: hashUuid(`${workspaceId}:notification:${index}`),
    workspace_id: workspaceId,
    company_id: companyId,
    user_id: userId,
    title: pick(["Hot lead detected", "Overdue task", "New inbound reply", "Campaign ready for review", "Usage cap warning", "Trial ending soon"], index),
    message: "Simulated notification for dropdown, badge, and mark-read testing.",
    type: pick(["lead", "task", "communication", "campaign", "billing", "trial"], index),
    priority: pick(["normal", "high", "urgent"], index),
    status: index % 3 === 0 ? "read" : "unread",
    record_type: pick(["leads", "crm_tasks", "communications", "marketing_campaigns", "crm_usage_events"], index),
    record_id: leads[index % leads.length].id,
    href: pick(["/dashboard/leads", "/dashboard/tasks", "/dashboard/communications", "/dashboard/marketing", "/dashboard/settings"], index),
    read_at: index % 3 === 0 ? daysAgo(index % 7) : null,
    created_at: daysAgo(index % 15),
    updated_at: daysAgo(index % 8),
    metadata: testMeta(),
  }));
  const usage = ["ai_tokens", "emails", "sms", "contacts", "workflow_runs", "agent_runs"].map((type, index) => ({
    id: hashUuid(`${workspaceId}:usage:${type}`),
    workspace_id: workspaceId,
    company_id: companyId,
    user_id: userId,
    usage_type: type,
    quantity: [4200, 1850, 240, 84, 96, 42][index],
    source: "test_simulation",
    metadata: testMeta({ percent_used: [42, 61, 72, 84, 33, 55][index], cap_warning: index === 3 }),
    created_at: daysAgo(index),
  }));
  const services = ["Launch System", "Growth Engine", "Automation System", "Authority Builder", "Conversion Engine", "Full Business System", "Growth Ops", "Scale Ops", "Elite Ops"].map((item, index) => ({
    id: hashUuid(`${workspaceId}:service-request:${index}`),
    workspace_id: workspaceId,
    company_id: companyId,
    user_id: userId,
    service_type: index < 6 ? "bundle" : "retainer",
    item_name: item,
    price_cents: [59900, 99900, 149900, 179900, 249900, 499900, 59900, 99900, 199900][index],
    recurring: index >= 6,
    status: pick(["requested", "consultation_required", "quoted", "approved", "completed", "canceled"], index),
    requested_at: daysAgo(index + 1),
    consultation_required: true,
    metadata: testMeta({ test_only_service_request: true }),
    created_at: daysAgo(index + 1),
    updated_at: daysAgo(index % 4),
  }));
  const waitlist = Array.from({ length: 8 }, (_, index) => ({
    id: hashUuid(`${workspaceId}:waitlist:${index}`),
    workspace_id: workspaceId,
    company_id: companyId,
    user_id: userId,
    full_name: `Waitlist Contact ${index + 1}`,
    business_name: `Cohort Candidate ${index + 1}`,
    work_email: `waitlist.${index + 1}@example.test`,
    phone: `+1555444${index}${index}${index}${index}`,
    industry: pick(["roofing", "legal", "med spa", "dental", "home services"], index),
    website: "https://example.test",
    business_size: pick(["1-5", "6-20", "21-50"], index),
    desired_plan: pick(["BYOK Growth", "Managed Growth", "Managed Scale"], index),
    billing_preference: pick(["byok", "managed"], index),
    main_goal: "Launch cohort simulation.",
    urgency: pick(["this_week", "this_month", "exploring"], index),
    services_interested: ["Growth Engine"],
    consent_to_contact: true,
    waitlist_position: index + 1,
    founding_cohort_eligible: index < 5,
    status: pick(["pending", "invited", "accepted", "deferred"], index),
    metadata: testMeta(),
    created_at: daysAgo(index + 2),
    updated_at: daysAgo(index),
  }));
  const contacts = Array.from({ length: 6 }, (_, index) => ({
    id: hashUuid(`${workspaceId}:contact:${index}`),
    workspace_id: workspaceId,
    company_id: companyId,
    user_id: userId,
    name: `Service Inquiry ${index + 1}`,
    email: `contact.${index + 1}@example.test`,
    phone: `+1555333${index}${index}${index}${index}`,
    company: `Inquiry Co ${index + 1}`,
    message: "Simulated contact form inquiry for admin/contact testing.",
    source: pick(["/services", "/contact", "/pricing"], index),
    status: pick(["new", "reviewed", "followed_up"], index),
    metadata: testMeta({ selected_service: pick(["Growth Engine", "CRM Setup", "AI Funnel Optimization"], index) }),
    created_at: daysAgo(index + 3),
  }));
  return { notifications, usage, services, waitlist, contacts };
}

export async function getTestSimulationStatus(request: Request, body?: any) {
  const auth = await requireSimulationAccess(request, body);
  if (!auth.allowed) return auth;

  const supabase = createSupabaseAdmin();
  const testWorkspace = await loadMarkedTestWorkspace(supabase, auth.workspaceId!);
  if (testWorkspace.response) return { ...auth, ...testWorkspace.response };

  const { data, error } = await supabase
    .from("crm_test_simulation_state")
    .select("*")
    .eq("workspace_id", auth.workspaceId)
    .maybeSingle();

  if (error) {
    const friendly = friendlySupabaseError(error);
    return { ...auth, allowed: false, setupRequired: friendly.missingSchema, reason: friendly.message };
  }

  return {
    ...auth,
    enabled: true,
    seeded: Boolean(data?.seeded_at),
    state: data || null,
    simulationVersion: SIMULATION_VERSION,
  };
}

export async function resetTestWorkspace(request: Request, body?: any) {
  const auth = await requireSimulationAccess(request, body);
  if (!auth.allowed) return auth;

  const supabase = createSupabaseAdmin();
  const testWorkspace = await loadMarkedTestWorkspace(supabase, auth.workspaceId!);
  if (testWorkspace.response) return { ...auth, ...testWorkspace.response };

  for (const table of mutableTables) {
    const { error } = await supabase.from(table).delete().eq("workspace_id", auth.workspaceId);
    if (error) throw error;
  }
  await supabase.from("workspaces").update({
    is_test_workspace: true,
    simulation_enabled: false,
    simulation_profile: null,
  }).eq("id", auth.workspaceId);

  return { ...auth, reset: true };
}

export async function seedTestWorkspace(request: Request, body: any = {}) {
  const auth = await requireSimulationAccess(request, body);
  if (!auth.allowed) return auth;

  const supabase = createSupabaseAdmin();
  const workspaceId = auth.workspaceId!;
  const companyId = auth.companyId || hashUuid(`${workspaceId}:company`);
  const userId = auth.userId || body.user_id || null;
  const profile = (body.profile || process.env.CRM_TEST_SIMULATION_PROFILE || "normal") as SimulationProfile;
  const now = new Date().toISOString();

  const testWorkspace = await loadMarkedTestWorkspace(supabase, workspaceId);
  if (testWorkspace.response) return { ...auth, ...testWorkspace.response };
  const existingWorkspace = testWorkspace.workspace!;

  await supabase.from("workspaces").upsert({
    id: workspaceId,
    company_id: existingWorkspace.company_id || companyId,
    owner_id: existingWorkspace.owner_id || userId,
    name: "LaunchLab Demo Workspace",
    industry: "multi-industry CRM simulation",
    business_type: "SynaptiReach test workspace",
    plan_tier: "managed_growth_test",
    billing_mode: "synaptireach_managed_test",
    trial_started_at: daysAgo(6),
    trial_ends_at: daysFromNow(8, 9),
    usage_caps: { ai: 10000, email: 3000, sms: 500, contacts: 1000, workflows: 250 },
    is_test_workspace: true,
    simulation_enabled: true,
    simulation_profile: profile,
    updated_at: now,
  }, { onConflict: "id" });

  const effectiveCompanyId = existingWorkspace.company_id || companyId;
  const effectiveUserId = existingWorkspace.owner_id || userId;
  const staff = makeStaff(workspaceId, effectiveCompanyId, effectiveUserId);
  const leads = makeLeads(workspaceId, effectiveCompanyId, effectiveUserId);
  const deals = makeDeals(workspaceId, effectiveCompanyId, effectiveUserId, leads);
  const tasks = makeTasks(workspaceId, effectiveCompanyId, effectiveUserId, leads, deals, staff);
  const campaigns = makeCampaigns(workspaceId, effectiveCompanyId, effectiveUserId);
  const appointments = makeAppointments(workspaceId, effectiveCompanyId, effectiveUserId, leads, deals);
  const communicationData = makeCommunications(workspaceId, effectiveCompanyId, effectiveUserId, leads, campaigns);
  const workflowData = makeWorkflows(workspaceId, effectiveCompanyId, effectiveUserId);
  const recData = makeRecommendations(workspaceId, effectiveCompanyId, effectiveUserId, leads, campaigns);
  const operational = makeOperationalRows(workspaceId, effectiveCompanyId, effectiveUserId, leads);

  const roles = [
    {
      id: hashUuid(`${workspaceId}:role:owner`),
      workspace_id: workspaceId,
      company_id: effectiveCompanyId,
      name: "Simulation Owner",
      description: "Full test workspace access.",
      permissions: ["*"],
      metadata: testMeta(),
    },
  ];
  const permissions = staff.flatMap((member) => ["dashboard:view", "leads:view", "tasks:view", "communications:view"].map((permission) => ({
    id: hashUuid(`${workspaceId}:perm:${member.id}:${permission}`),
    workspace_id: workspaceId,
    company_id: effectiveCompanyId,
    staff_id: member.id,
    permission,
    granted: true,
  })));
  const activities = leads.slice(0, 50).map((lead, index) => ({
    id: hashUuid(`${workspaceId}:activity:${index}`),
    workspace_id: workspaceId,
    company_id: effectiveCompanyId,
    user_id: effectiveUserId,
    lead_id: lead.id,
    type: pick(["note", "email", "sms", "stage_change", "score_update"], index),
    title: "Simulation lead activity",
    details: "Generated activity to populate lead detail timelines.",
    metadata: testMeta(),
    created_at: daysAgo(index % 28),
  }));
  const marketingEvents = campaigns.flatMap((campaign, index) => ["open", "click", "conversion", "unsubscribe"].map((eventType, eventIndex) => ({
    id: hashUuid(`${workspaceId}:marketing-event:${index}:${eventType}`),
    workspace_id: workspaceId,
    company_id: effectiveCompanyId,
    user_id: effectiveUserId,
    campaign_id: campaign.id,
    type: eventType,
    event_type: eventType,
    title: `Simulated campaign ${eventType}`,
    message: `${campaign.name} recorded ${eventType}`,
    action: eventType,
    details: "Simulated campaign activity row.",
    metadata: testMeta({ count: 3 + eventIndex + index }),
    created_at: daysAgo((index + eventIndex) % 18),
  })));
  const interactions = leads.slice(0, 40).map((lead, index) => ({
    id: hashUuid(`${workspaceId}:interaction:${index}`),
    workspace_id: workspaceId,
    company_id: effectiveCompanyId,
    user_id: effectiveUserId,
    campaign_id: campaigns[index % campaigns.length].id,
    lead_id: lead.id,
    interaction_type: pick(["open", "click", "reply", "conversion"], index),
    message: "Simulated marketing interaction.",
    metadata: testMeta(),
    created_at: daysAgo(index % 19),
  }));

  const billingAccount = {
    id: hashUuid(`${workspaceId}:billing-account`),
    workspace_id: workspaceId,
    company_id: effectiveCompanyId,
    user_id: effectiveUserId,
    plan_tier: "managed_growth_test",
    billing_mode: "synaptireach_managed_test",
    status: "trial",
    stripe_customer_id: "cus_test_simulated_only",
    stripe_subscription_id: null,
    payment_method_reference: "simulation_only_no_charge",
    trial_started_at: daysAgo(6),
    trial_ends_at: daysFromNow(8, 9),
    metadata: testMeta({ test_account_bypass: true, no_real_charge: true }),
  };
  const settings = {
    id: hashUuid(`${workspaceId}:settings`),
    workspace_id: workspaceId,
    company_id: effectiveCompanyId,
    user_id: effectiveUserId,
    business_name: "LaunchLab Demo Workspace",
    industry: "multi-industry growth operations",
    website: "https://demo.synaptireach.example",
    contact_email: "demo.owner@example.test",
    phone: "+15550101010",
    default_sender_name: "LaunchLab Demo",
    default_sender_email: "demo@example.test",
    timezone: "America/Chicago",
    brand_voice: "Clear, premium, practical, review-gated.",
    tone: "professional",
    cta_style: "consultation",
    audience_description: "Local service, professional services, ecommerce, and agency leads.",
    automation_level: "review_required",
    metadata: testMeta({
      target_customer: "growth-focused SMBs",
      offer: "AI CRM launch and automation system",
      services: ["CRM setup", "campaign execution", "workflow automation"],
      sales_cycle_days: 21,
    }),
  };

  const batches: Array<[string, any[]]> = [
    ["crm_settings", [settings]],
    ["crm_roles", roles],
    ["crm_staff", staff],
    ["crm_staff_permissions", permissions],
    ["leads", leads],
    ["lead_activities", activities],
    ["crm_deals", deals],
    ["crm_tasks", tasks],
    ["crm_appointments", appointments],
    ["marketing_campaigns", campaigns],
    ["marketing_events", marketingEvents],
    ["marketing_interactions", interactions],
    ["communications", communicationData.communications],
    ["crm_conversations", communicationData.conversations],
    ["crm_messages", communicationData.messages],
    ["crm_workflows", workflowData.workflows],
    ["crm_workflow_runs", workflowData.runs],
    ["crm_ai_recommendations", recData.crm],
    ["marketing_ai_recommendations", recData.marketing],
    ["crm_agent_runs", recData.agentRuns],
    ["crm_notifications", operational.notifications],
    ["crm_billing_accounts", [billingAccount]],
    ["crm_usage_events", operational.usage],
    ["crm_service_requests", operational.services],
    ["waitlist_signups", operational.waitlist],
    ["contact_submissions", operational.contacts],
    ["crm_provider_connections", [
      { id: hashUuid(`${workspaceId}:provider:resend`), workspace_id: workspaceId, company_id: effectiveCompanyId, user_id: effectiveUserId, provider: "resend", provider_type: "integration", status: "setup_required", key_label: "simulation masked", metadata: testMeta({ no_secret_stored: true }) },
      { id: hashUuid(`${workspaceId}:provider:twilio`), workspace_id: workspaceId, company_id: effectiveCompanyId, user_id: effectiveUserId, provider: "twilio", provider_type: "integration", status: "setup_required", key_label: "simulation masked", metadata: testMeta({ no_secret_stored: true }) },
      { id: hashUuid(`${workspaceId}:provider:gemini`), workspace_id: workspaceId, company_id: effectiveCompanyId, user_id: effectiveUserId, provider: "gemini", provider_type: "ai", status: "setup_required", key_label: "simulation masked", metadata: testMeta({ no_secret_stored: true }) },
    ]],
    ["crm_audit_logs", [
      { id: hashUuid(`${workspaceId}:audit:seed`), workspace_id: workspaceId, company_id: effectiveCompanyId, user_id: effectiveUserId, action: "test_simulation_seeded", resource_type: "workspace", resource_id: workspaceId, details: "Seeded isolated test workspace data.", metadata: testMeta() },
    ]],
  ];

  const counts: Record<string, number> = {};
  for (const [table, rows] of batches) counts[table] = await upsertRows(supabase, table, rows);

  const state = {
    id: hashUuid(`${workspaceId}:simulation-state`),
    workspace_id: workspaceId,
    company_id: effectiveCompanyId,
    user_id: effectiveUserId,
    enabled: true,
    paused: false,
    simulation_day: Number(body.simulation_day || 1),
    simulation_profile: profile,
    simulation_version: SIMULATION_VERSION,
    seeded_at: now,
    last_tick_at: null,
    next_tick_at: daysFromNow(0, new Date().getHours() + 1),
    metadata: testMeta({ counts }),
  };
  await upsertRows(supabase, "crm_test_simulation_state", [state]);
  await upsertRows(supabase, "crm_test_simulation_settings", [{
    id: hashUuid(`${workspaceId}:simulation-settings`),
    workspace_id: workspaceId,
    company_id: effectiveCompanyId,
    user_id: effectiveUserId,
    auto_tick: process.env.CRM_TEST_SIMULATION_AUTO_TICK === "true",
    tick_minutes: Number(process.env.CRM_TEST_SIMULATION_TICK_MINUTES || 60),
    simulation_profile: profile,
    settings: testMeta({ profile }),
  }]);
  await upsertRows(supabase, "crm_test_simulation_events", [{
    id: hashUuid(`${workspaceId}:simulation-event:seed:${SIMULATION_VERSION}`),
    workspace_id: workspaceId,
    company_id: effectiveCompanyId,
    user_id: effectiveUserId,
    simulation_day: state.simulation_day,
    event_type: "seed",
    title: "Test workspace seeded",
    details: "Seeded rich isolated CRM simulation data.",
    metadata: testMeta({ counts }),
  }]);

  return {
    ...auth,
    seeded: true,
    state,
    counts,
  };
}

export async function tickTestWorkspace(request: Request, body: any = {}) {
  const auth = await requireSimulationAccess(request, body);
  if (!auth.allowed) return auth;

  const supabase = createSupabaseAdmin();
  const workspaceId = auth.workspaceId!;
  const testWorkspace = await loadMarkedTestWorkspace(supabase, workspaceId);
  if (testWorkspace.response) return { ...auth, ...testWorkspace.response };

  const { data: state } = await supabase
    .from("crm_test_simulation_state")
    .select("*")
    .eq("workspace_id", workspaceId)
    .maybeSingle();

  if (!state?.seeded_at) {
    return { ...auth, setupRequired: true, reason: "Seed the test workspace before running a simulation tick." };
  }
  if (state.paused) {
    return { ...auth, paused: true, reason: "Simulation is paused." };
  }

  const nextDay = Number(state.simulation_day || 0) + 1;
  const now = new Date().toISOString();
  const leadId = hashUuid(`${workspaceId}:lead:${nextDay % 84}`);
  const dealId = hashUuid(`${workspaceId}:deal:${nextDay % 32}`);
  const campaignId = hashUuid(`${workspaceId}:campaign:${nextDay % 22}`);
  const taskId = hashUuid(`${workspaceId}:task:${nextDay % 64}`);

  await supabase.from("leads").update({
    score: 75 + (nextDay % 20),
    status: nextDay % 3 === 0 ? "qualified" : "contacted",
    last_interaction: now,
    updated_at: now,
  }).eq("id", leadId).eq("workspace_id", workspaceId);
  await supabase.from("crm_deals").update({
    stage: pick(["discovery", "proposal", "negotiation", "won"], nextDay),
    probability: pick([35, 55, 75, 100], nextDay),
    updated_at: now,
  }).eq("id", dealId).eq("workspace_id", workspaceId);
  await supabase.from("crm_tasks").update({
    status: nextDay % 4 === 0 ? "completed" : "open",
    completed_at: nextDay % 4 === 0 ? now : null,
    updated_at: now,
  }).eq("id", taskId).eq("workspace_id", workspaceId);
  await supabase.from("marketing_campaigns").update({
    opened_count: 100 + nextDay * 7,
    clicked_count: 20 + nextDay * 3,
    converted_count: 4 + nextDay,
  }).eq("id", campaignId).eq("workspace_id", workspaceId);

  const event = {
    id: hashUuid(`${workspaceId}:simulation-event:tick:${nextDay}`),
    workspace_id: workspaceId,
    company_id: auth.companyId || state.company_id || null,
    user_id: auth.userId || state.user_id || null,
    simulation_day: nextDay,
    event_type: "tick",
    title: `Simulation day ${nextDay} advanced`,
    details: "Updated one lead, one deal, one task, one campaign, and added reviewable CRM signals.",
    metadata: testMeta({ lead_id: leadId, deal_id: dealId, campaign_id: campaignId, task_id: taskId }),
  };
  const notification = {
    id: hashUuid(`${workspaceId}:notification:tick:${nextDay}`),
    workspace_id: workspaceId,
    company_id: auth.companyId || state.company_id || null,
    user_id: auth.userId || state.user_id || null,
    title: "Simulation tick created new CRM signals",
    message: `Day ${nextDay}: hot lead, deal movement, campaign activity, and task update generated.`,
    type: "simulation",
    priority: "normal",
    status: "unread",
    href: "/dashboard",
    metadata: testMeta({ simulation_day: nextDay }),
  };
  const recommendation = {
    id: hashUuid(`${workspaceId}:crm-rec:tick:${nextDay}`),
    workspace_id: workspaceId,
    company_id: auth.companyId || state.company_id || null,
    user_id: auth.userId || state.user_id || null,
    type: "simulation_signal",
    title: `Review simulation day ${nextDay} changes`,
    description: "Built-in intelligence generated a reviewable action after deterministic CRM changes.",
    action: "review_dashboard",
    status: "pending",
    confidence: 0.76,
    metadata: testMeta({ simulation_day: nextDay, provider: "mini_brain" }),
  };

  await upsertRows(supabase, "crm_test_simulation_events", [event]);
  await upsertRows(supabase, "crm_notifications", [notification]);
  await upsertRows(supabase, "crm_ai_recommendations", [recommendation]);
  await supabase.from("crm_test_simulation_state").update({
    simulation_day: nextDay,
    last_tick_at: now,
    next_tick_at: daysFromNow(0, new Date().getHours() + 1),
    updated_at: now,
    metadata: { ...(state.metadata || {}), last_tick: event.metadata },
  }).eq("workspace_id", workspaceId);

  return {
    ...auth,
    ticked: true,
    simulation_day: nextDay,
    event,
  };
}

export async function pauseTestWorkspace(request: Request, paused: boolean, body: any = {}) {
  const auth = await requireSimulationAccess(request, body);
  if (!auth.allowed) return auth;
  const supabase = createSupabaseAdmin();
  const testWorkspace = await loadMarkedTestWorkspace(supabase, auth.workspaceId!);
  if (testWorkspace.response) return { ...auth, ...testWorkspace.response };

  await supabase.from("crm_test_simulation_state").update({ paused, updated_at: new Date().toISOString() }).eq("workspace_id", auth.workspaceId);
  await supabase.from("workspaces").update({ simulation_enabled: !paused }).eq("id", auth.workspaceId);
  return { ...auth, paused };
}

export async function bootstrapTestWorkspace(request: Request, body: any = {}) {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return {
      allowed: false,
      setupRequired: true,
      reason: "Supabase service credentials are required to bootstrap the test workspace.",
    };
  }

  if (process.env.CRM_ENABLE_TEST_SIMULATION !== "true") {
    return {
      allowed: false,
      setupRequired: true,
      reason: "Set CRM_ENABLE_TEST_SIMULATION=true before bootstrapping the test workspace.",
    };
  }

  const requestedEmail = String(body.email || DEFAULT_TEST_EMAIL).trim().toLowerCase();
  const allowedEmails = testAccountEmails();

  if (allowedEmails.length === 0) {
    return {
      allowed: false,
      setupRequired: true,
      reason: `Set CRM_TEST_ACCOUNT_EMAILS=${DEFAULT_TEST_EMAIL} before bootstrapping the test workspace.`,
    };
  }

  if (!allowedEmails.includes(requestedEmail)) {
    return {
      allowed: false,
      reason: `Email ${requestedEmail} is not listed in CRM_TEST_ACCOUNT_EMAILS.`,
    };
  }

  const providedSecret =
    body.bootstrap_secret ||
    body.seed_secret ||
    body.secret ||
    request.headers.get("x-bootstrap-secret") ||
    request.headers.get("x-simulation-secret") ||
    new URL(request.url).searchParams.get("secret");
  const configuredSecret =
    process.env.CRM_TEST_BOOTSTRAP_SECRET ||
    process.env.CRM_TEST_SIMULATION_SEED_SECRET ||
    "";

  let authenticatedAllowedEmail = false;
  try {
    const context = await getWorkspaceContext(request);
    if (context.userId) {
      const admin = createSupabaseAdmin();
      const { data } = await admin.auth.admin.getUserById(context.userId);
      authenticatedAllowedEmail = data.user?.email?.toLowerCase() === requestedEmail;
    }
  } catch {
    authenticatedAllowedEmail = false;
  }

  if (!authenticatedAllowedEmail && (!configuredSecret || providedSecret !== configuredSecret)) {
    return {
      allowed: false,
      reason:
        "Bootstrap is protected. Provide CRM_TEST_BOOTSTRAP_SECRET or sign in as the allowed test account.",
    };
  }

  const supabase = createSupabaseAdmin();
  let authUser = await findAuthUserByEmail(supabase, requestedEmail);
  let userCreated = false;
  let passwordSet = false;
  const requestedPassword = String(body.password || body.test_password || "").trim();

  if (!authUser) {
    const password = requestedPassword || crypto.randomBytes(24).toString("base64url");
    const { data, error } = await supabase.auth.admin.createUser({
      email: requestedEmail,
      password,
      email_confirm: true,
      app_metadata: {
        test_account: true,
        simulation_source: SIMULATION_SOURCE,
        simulation_version: SIMULATION_VERSION,
      },
      user_metadata: {
        test_account: true,
        simulation_source: SIMULATION_SOURCE,
        simulation_version: SIMULATION_VERSION,
      },
    });
    if (error) throw error;
    authUser = data.user;
    userCreated = true;
    passwordSet = Boolean(requestedPassword);
  } else if (requestedPassword) {
    const { error } = await supabase.auth.admin.updateUserById(authUser.id, {
      password: requestedPassword,
      app_metadata: {
        ...(authUser.app_metadata || {}),
        test_account: true,
        simulation_source: SIMULATION_SOURCE,
        simulation_version: SIMULATION_VERSION,
      },
      user_metadata: {
        ...(authUser.user_metadata || {}),
        test_account: true,
        simulation_source: SIMULATION_SOURCE,
        simulation_version: SIMULATION_VERSION,
      },
    });
    if (error) throw error;
    passwordSet = true;
  }

  if (!authUser?.id) {
    throw new Error("Unable to create or find the test auth user.");
  }

  const envWorkspaceId = testWorkspaceIds()[0] || null;
  const workspaceId = body.workspace_id || body.workspaceId || envWorkspaceId || hashUuid(`test-workspace:${requestedEmail}`);
  const companyId = body.company_id || body.companyId || hashUuid(`test-company:${requestedEmail}`);
  const now = new Date().toISOString();
  const metadata = testMeta({
    test_account_email: requestedEmail,
    bootstrap_source: "api_test_simulation_bootstrap",
  });

  const { error: workspaceError } = await supabase.from("workspaces").upsert({
    id: workspaceId,
    company_id: companyId,
    owner_id: authUser.id,
    name: "LaunchLab Demo Workspace",
    industry: "multi-industry CRM simulation",
    business_type: "SynaptiReach test workspace",
    plan_tier: "managed_growth_test",
    billing_mode: "synaptireach_managed_test",
    trial_started_at: daysAgo(1),
    trial_ends_at: daysFromNow(13, 9),
    usage_caps: { ai: 10000, email: 3000, sms: 500, contacts: 1000, workflows: 250 },
    is_test_workspace: true,
    simulation_enabled: true,
    simulation_profile: body.profile || process.env.CRM_TEST_SIMULATION_PROFILE || "normal",
    updated_at: now,
  }, { onConflict: "id" });
  if (workspaceError) throw workspaceError;

  await supabase.from("workspace_members").upsert({
    id: hashUuid(`${workspaceId}:member:${authUser.id}`),
    workspace_id: workspaceId,
    user_id: authUser.id,
    role: "owner",
    status: "active",
    metadata,
    updated_at: now,
  }, { onConflict: "workspace_id,user_id" });

  await supabase.from("onboarding_sessions").upsert({
    id: hashUuid(`${workspaceId}:onboarding:${authUser.id}`),
    workspace_id: workspaceId,
    user_id: authUser.id,
    payload: {
      businessName: "LaunchLab Demo Workspace",
      industry: "multi-industry CRM simulation",
      services: ["CRM setup", "campaign execution", "workflow automation"],
      testSimulation: true,
    },
    completed: true,
    metadata,
    updated_at: now,
  }, { onConflict: "id" });

  await supabase.from("crm_settings").upsert({
    id: hashUuid(`${workspaceId}:settings`),
    workspace_id: workspaceId,
    company_id: companyId,
    user_id: authUser.id,
    business_name: "LaunchLab Demo Workspace",
    industry: "multi-industry growth operations",
    website: "https://demo.synaptireach.example",
    contact_email: requestedEmail,
    phone: "+15550101010",
    default_sender_name: "LaunchLab Demo",
    default_sender_email: "demo@example.test",
    timezone: "America/Chicago",
    brand_voice: "Clear, premium, practical, review-gated.",
    tone: "professional",
    cta_style: "consultation",
    audience_description: "Local service, professional services, ecommerce, and agency leads.",
    automation_level: "review_required",
    metadata,
    updated_at: now,
  }, { onConflict: "id" });

  await supabase.from("crm_test_simulation_state").upsert({
    id: hashUuid(`${workspaceId}:simulation-state`),
    workspace_id: workspaceId,
    company_id: companyId,
    user_id: authUser.id,
    enabled: true,
    paused: false,
    simulation_day: 0,
    simulation_profile: body.profile || process.env.CRM_TEST_SIMULATION_PROFILE || "normal",
    simulation_version: SIMULATION_VERSION,
    metadata,
    updated_at: now,
  }, { onConflict: "workspace_id" });

  await supabase.from("crm_test_simulation_events").upsert({
    id: hashUuid(`${workspaceId}:simulation-event:bootstrap:${SIMULATION_VERSION}`),
    workspace_id: workspaceId,
    company_id: companyId,
    user_id: authUser.id,
    simulation_day: 0,
    event_type: "bootstrap",
    title: "Test workspace bootstrapped",
    details: `Created or found test auth user/workspace for ${requestedEmail}.`,
    metadata,
  }, { onConflict: "id" });

  return {
    allowed: true,
    bootstrapped: true,
    user_created: userCreated,
    password_set: passwordSet,
    email: requestedEmail,
    user_id: authUser.id,
    workspace_id: workspaceId,
    company_id: companyId,
    env: {
      CRM_ENABLE_TEST_SIMULATION: "true",
      CRM_TEST_ACCOUNT_EMAILS: requestedEmail,
      CRM_TEST_WORKSPACE_IDS: workspaceId,
    },
    message: `Use CRM_TEST_WORKSPACE_IDS=${workspaceId} for this isolated test workspace.`,
  };
}
