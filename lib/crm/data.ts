import { createSupabaseAdmin, friendlySupabaseError } from "@/lib/crm/supabaseAdmin";

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

export async function loadCRMContext() {
  const supabase = createSupabaseAdmin();

  const [
    leads,
    campaigns,
    activity,
    communications,
    settings,
    recommendations,
  ] = await Promise.all([
    safeQuery(supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(200)),
    safeQuery(supabase.from("marketing_campaigns").select("*").order("created_at", { ascending: false }).limit(100)),
    safeQuery(supabase.from("marketing_events").select("*").order("created_at", { ascending: false }).limit(100)),
    safeQuery(supabase.from("communications").select("*").order("created_at", { ascending: false }).limit(100)),
    safeQuery(supabase.from("crm_settings").select("*").limit(1).maybeSingle()),
    safeQuery(supabase.from("marketing_ai_recommendations").select("*").order("created_at", { ascending: false }).limit(50)),
  ]);

  const schemaWarnings = [
    leads,
    campaigns,
    activity,
    communications,
    settings,
    recommendations,
  ]
    .filter((result) => result.missingSchema)
    .map((result) => result.error);

  const leadRows = (leads.data || []) as any[];
  const campaignRows = (campaigns.data || []) as any[];
  const activityRows = (activity.data || []) as any[];
  const communicationRows = (communications.data || []) as any[];

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
  };

  return {
    leads: leadRows,
    campaigns: campaignRows,
    activity: activityRows,
    communications: communicationRows,
    settings: settings.data || null,
    recommendations: (recommendations.data || []) as any[],
    metrics,
    schemaWarnings: Array.from(new Set(schemaWarnings)),
  };
}
