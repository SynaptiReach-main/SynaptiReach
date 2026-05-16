import { generateAIJson } from "@/lib/ai/providers";

function getLeadScore(lead: any, communications: any[], activity: any[]) {
  let score = Number(lead.score || 0);

  if (lead.status === "qualified") score += 25;
  if (lead.status === "converted") score += 40;
  if (lead.status === "contacted") score += 10;
  if (lead.email) score += 8;
  if (lead.phone) score += 8;

  const leadComms = communications.filter((item) => item.lead_id === lead.id);
  score += Math.min(leadComms.length * 5, 20);

  const leadEvents = activity.filter((event) =>
    JSON.stringify(event.metadata || {}).includes(lead.email || "__none__")
  );
  score += Math.min(leadEvents.length * 5, 20);

  return Math.max(0, Math.min(100, score));
}

export function runDeterministicAgents(context: any) {
  const leads = context.leads || [];
  const campaigns = context.campaigns || [];
  const communications = context.communications || [];
  const activity = context.activity || [];

  const scoredLeads = leads
    .map((lead: any) => ({
      ...lead,
      recommended_score: getLeadScore(lead, communications, activity),
      temperature:
        getLeadScore(lead, communications, activity) >= 70
          ? "hot"
          : getLeadScore(lead, communications, activity) >= 40
            ? "warm"
            : "cold",
    }))
    .sort((a: any, b: any) => b.recommended_score - a.recommended_score);

  const leadsNeedingFollowUp = leads.filter((lead: any) => {
    if (["converted", "lost"].includes(lead.status)) return false;

    const lastCommunication = communications
      .filter((item: any) => item.lead_id === lead.id)
      .sort(
        (a: any, b: any) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0];

    if (!lastCommunication) return true;

    const daysSince =
      (Date.now() - new Date(lastCommunication.created_at).getTime()) /
      86400000;

    return daysSince >= 3;
  });

  const topCampaigns = campaigns
    .map((campaign: any) => ({
      ...campaign,
      engagement:
        Number(campaign.opened_count || 0) +
        Number(campaign.clicked_count || 0) * 2 +
        Number(campaign.converted_count || 0) * 5,
    }))
    .sort((a: any, b: any) => b.engagement - a.engagement);

  const segments = leads.reduce((acc: Record<string, number>, lead: any) => {
    const key = `${lead.status || "unknown"}:${lead.source || "unknown"}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const recommendations = [
    leadsNeedingFollowUp.length > 0 && {
      type: "follow_up",
      priority: "high",
      title: "Follow up with stale leads",
      description: `${leadsNeedingFollowUp.length} leads have no recent communication.`,
      action: "draft_follow_up",
      confidence: 0.82,
    },
    scoredLeads[0] && {
      type: "lead_scoring",
      priority: "medium",
      title: "Review top scored lead",
      description: `${scoredLeads[0].name || scoredLeads[0].email || "A lead"} is currently ${scoredLeads[0].temperature} with a recommended score of ${scoredLeads[0].recommended_score}.`,
      action: "review_lead",
      confidence: 0.78,
    },
    topCampaigns[0] && {
      type: "campaign_optimization",
      priority: "medium",
      title: "Optimize from best campaign",
      description: `${topCampaigns[0].subject || topCampaigns[0].name || topCampaigns[0].type || "A campaign"} has the strongest engagement signal.`,
      action: "create_variant",
      confidence: 0.74,
    },
  ].filter(Boolean);

  return {
    success: true,
    summary: {
      hot_leads: scoredLeads.filter((lead: any) => lead.temperature === "hot")
        .length,
      warm_leads: scoredLeads.filter((lead: any) => lead.temperature === "warm")
        .length,
      cold_leads: scoredLeads.filter((lead: any) => lead.temperature === "cold")
        .length,
      followups_due: leadsNeedingFollowUp.length,
      campaign_count: campaigns.length,
    },
    recommendations,
    actions: [
      "review_hot_leads",
      "draft_followups",
      "optimize_campaigns",
      "segment_audience",
    ],
    confidence: leads.length || campaigns.length ? 0.76 : 0.35,
    data_used: {
      leads: leads.length,
      campaigns: campaigns.length,
      communications: communications.length,
      activity: activity.length,
      segments,
    },
    scored_leads: scoredLeads.slice(0, 10),
    followups: leadsNeedingFollowUp.slice(0, 10),
    top_campaigns: topCampaigns.slice(0, 5),
  };
}

export async function runExecutiveAgent(context: any) {
  const fallback = runDeterministicAgents(context);

  const result = await generateAIJson(
    [
      {
        role: "system",
        content:
          "You are SynaptiReach's CRM executive agent. Use only the supplied data. Do not invent metrics. Return concise structured JSON with summary, recommendations, actions, confidence, and data_used.",
      },
      {
        role: "user",
        content: JSON.stringify({
          metrics: context.metrics,
          settings: context.settings,
          recent_leads: (context.leads || []).slice(0, 20),
          recent_campaigns: (context.campaigns || []).slice(0, 20),
          recent_activity: (context.activity || []).slice(0, 20),
          recent_communications: (context.communications || []).slice(0, 20),
        }),
      },
    ],
    fallback,
    { profile: "premium" }
  );

  return {
    ...fallback,
    ...result.data,
    provider: result.meta.provider,
    model: result.meta.model,
    fallback_used: result.meta.fallback_used,
    provider_errors: result.meta.provider_errors,
    provider_warnings: result.meta.provider_warnings,
  };
}
