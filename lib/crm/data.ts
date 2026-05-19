import { createSupabaseAdmin, friendlySupabaseError } from "@/lib/crm/supabaseAdmin";
import { applyWorkspaceScope, getWorkspaceContext, type WorkspaceContext } from "@/lib/auth/getWorkspaceContext";

async function safeQuery<T>(query: PromiseLike<{ data: T | null; error: any }>) {
  const { data, error } = await query;

  if (error) {
    const friendly = friendlySupabaseError(error);

    return {
      data: null,
      error: friendly.message,
      missingSchema: friendly.missingSchema,
    };
  }

  return {
    data,
    error: null,
    missingSchema: false,
  };
}

async function optionalWorkspaceContext(request?: Request): Promise<WorkspaceContext | null> {
  if (!request) return null;
  try {
    const context = await getWorkspaceContext(request);
    return context.isScoped ? context : null;
  } catch {
    return null;
  }
}

export async function loadCRMContext(request?: Request) {
  const supabase = createSupabaseAdmin();
  const context = await optionalWorkspaceContext(request);

  const [
    leads,
    campaigns,
    activity,
    communications,
    settings,
    recommendations,
    deals,
    tasks,
    workflows,
    workflowRuns,
    appointments,
    agentRuns,
  ] = await Promise.all([
    safeQuery(applyScope(supabase.from("leads").select("*"), context).order("created_at", { ascending: false }).limit(200)),
    safeQuery(applyScope(supabase.from("marketing_campaigns").select("*"), context).order("created_at", { ascending: false }).limit(100)),
    safeQuery(applyScope(supabase.from("marketing_events").select("*"), context).order("created_at", { ascending: false }).limit(100)),
    safeQuery(applyScope(supabase.from("communications").select("*"), context).order("created_at", { ascending: false }).limit(100)),
    safeQuery(applyScope(supabase.from("crm_settings").select("*"), context).limit(1).maybeSingle()),
    safeQuery(applyScope(supabase.from("marketing_ai_recommendations").select("*"), context).order("created_at", { ascending: false }).limit(50)),
    safeQuery(applyScope(supabase.from("crm_deals").select("*"), context).eq("archived", false).order("created_at", { ascending: false }).limit(200)),
    safeQuery(applyScope(supabase.from("crm_tasks").select("*"), context).neq("status", "archived").order("due_date", { ascending: true, nullsFirst: false }).limit(200)),
    safeQuery(applyScope(supabase.from("crm_workflows").select("*"), context).neq("status", "archived").order("created_at", { ascending: false }).limit(100)),
    safeQuery(applyScope(supabase.from("crm_workflow_runs").select("*"), context).order("started_at", { ascending: false }).limit(100)),
    safeQuery(applyScope(supabase.from("crm_appointments").select("*"), context).order("starts_at", { ascending: true }).limit(100)),
    safeQuery(applyScope(supabase.from("crm_agent_runs").select("*"), context).order("created_at", { ascending: false }).limit(100)),
  ]);

  const schemaWarnings = [
    leads,
    campaigns,
    activity,
    communications,
    settings,
    recommendations,
    deals,
    tasks,
    workflows,
    workflowRuns,
    appointments,
    agentRuns,
  ]
    .filter((result) => result.missingSchema)
    .map((result) => result.error);

  const leadRows = (leads.data || []) as any[];
  const campaignRows = (campaigns.data || []) as any[];
  const activityRows = (activity.data || []) as any[];
  const communicationRows = (communications.data || []) as any[];
  const dealRows = (deals.data || []) as any[];
  const taskRows = (tasks.data || []) as any[];
  const workflowRows = (workflows.data || []) as any[];
  const workflowRunRows = (workflowRuns.data || []) as any[];
  const appointmentRows = (appointments.data || []) as any[];
  const agentRunRows = (agentRuns.data || []) as any[];
  const now = Date.now();

  const metrics = {
    leads: {
      total: leadRows.length,
      new: leadRows.filter((lead) => lead.status === "new").length,
      contacted: leadRows.filter((lead) => lead.status === "contacted").length,
      qualified: leadRows.filter((lead) => lead.status === "qualified").length,
      converted: leadRows.filter((lead) => lead.status === "converted").length,
      lost: leadRows.filter((lead) => lead.status === "lost").length,
      average_score:
        leadRows.length > 0
          ? Math.round(
              leadRows.reduce((sum, lead) => sum + Number(lead.score || 0), 0) /
                leadRows.length
            )
          : 0,
    },
    campaigns: {
      total: campaignRows.length,
      active: campaignRows.filter((campaign) =>
        ["active", "processing"].includes(campaign.status)
      ).length,
      scheduled: campaignRows.filter((campaign) => campaign.status === "scheduled")
        .length,
      sent: campaignRows.filter((campaign) => campaign.status === "sent").length,
      cancelled: campaignRows.filter((campaign) => campaign.status === "cancelled")
        .length,
      delivered: campaignRows.reduce(
        (sum, campaign) => sum + Number(campaign.delivered_count || 0),
        0
      ),
      opened: campaignRows.reduce(
        (sum, campaign) => sum + Number(campaign.opened_count || 0),
        0
      ),
      clicked: campaignRows.reduce(
        (sum, campaign) => sum + Number(campaign.clicked_count || 0),
        0
      ),
      converted: campaignRows.reduce(
        (sum, campaign) => sum + Number(campaign.converted_count || 0),
        0
      ),
    },
    communications: {
      total: communicationRows.length,
      email: communicationRows.filter((item) => item.channel === "email").length,
      sms: communicationRows.filter((item) => item.channel === "sms").length,
      social: communicationRows.filter((item) => item.channel === "social").length,
      sent: communicationRows.filter((item) => item.status === "sent").length,
      failed: communicationRows.filter((item) => item.status === "failed").length,
      scheduled: communicationRows.filter((item) => item.status === "scheduled")
        .length,
    },
    deals: {
      total: dealRows.length,
      open: dealRows.filter((deal) => deal.status === "open").length,
      won: dealRows.filter((deal) => deal.stage === "won" || deal.status === "won").length,
      lost: dealRows.filter((deal) => deal.stage === "lost" || deal.status === "lost").length,
      value: dealRows.reduce((sum, deal) => sum + Number(deal.value || 0), 0),
      open_value: dealRows
        .filter((deal) => deal.status === "open")
        .reduce((sum, deal) => sum + Number(deal.value || 0), 0),
    },
    tasks: {
      total: taskRows.length,
      open: taskRows.filter((task) => task.status === "open").length,
      completed: taskRows.filter((task) => task.status === "completed").length,
      overdue: taskRows.filter(
        (task) =>
          task.status === "open" &&
          task.due_date &&
          new Date(task.due_date).getTime() < now
      ).length,
    },
    workflows: {
      total: workflowRows.length,
      active: workflowRows.filter((workflow) => workflow.status === "active").length,
      paused: workflowRows.filter((workflow) => workflow.status === "paused").length,
      runs: workflowRunRows.length,
      failed_runs: workflowRunRows.filter((run) => run.status === "failed").length,
    },
    appointments: {
      total: appointmentRows.length,
      upcoming: appointmentRows.filter(
        (appointment) =>
          appointment.status === "scheduled" &&
          appointment.starts_at &&
          new Date(appointment.starts_at).getTime() >= now
      ).length,
      cancelled: appointmentRows.filter((appointment) => appointment.status === "cancelled").length,
    },
    agents: {
      runs: agentRunRows.length,
      failed: agentRunRows.filter((run) => run.status === "failed").length,
    },
  };

  return {
    leads: leadRows,
    campaigns: campaignRows,
    activity: activityRows,
    communications: communicationRows,
    deals: dealRows,
    tasks: taskRows,
    workflows: workflowRows,
    workflowRuns: workflowRunRows,
    appointments: appointmentRows,
    agentRuns: agentRunRows,
    settings: settings.data || null,
    recommendations: (recommendations.data || []) as any[],
    metrics,
    schemaWarnings: Array.from(new Set(schemaWarnings)),
    workspaceWarnings: context?.warnings || [],
  };
}

function applyScope<TQuery extends { eq: (column: string, value: string) => TQuery }>(
  query: TQuery,
  context: WorkspaceContext | null
) {
  return context ? applyWorkspaceScope(query, context) : query;
}
