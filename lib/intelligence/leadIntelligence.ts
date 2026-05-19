import { confidenceFromSignals } from "./confidence";
import { scoreLead, leadTemperature } from "./leadScoring";
import { MINI_BRAIN_SCORING } from "./scoringConfig";
import { insight, recordRef } from "./templates";
import type { MiniBrainContext, MiniBrainInsight } from "./types";

function daysSince(value?: string) {
  if (!value) return Number.POSITIVE_INFINITY;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? Number.POSITIVE_INFINITY : (Date.now() - time) / 86400000;
}

function leadKey(lead: any) {
  return String(lead.email || lead.phone || lead.name || "").trim().toLowerCase();
}

export function leadInsights(context: MiniBrainContext): MiniBrainInsight[] {
  const leads = context.leads || [];
  const communications = context.communications || [];
  const activity = context.activity || [];
  const insights: MiniBrainInsight[] = [];
  const scored = leads
    .map((lead) => {
      const score = scoreLead(lead, communications, activity);
      return { ...lead, mini_brain_score: score, mini_brain_temperature: leadTemperature(score) };
    })
    .sort((a, b) => b.mini_brain_score - a.mini_brain_score);
  const hotUnconverted = scored.filter((lead) =>
    lead.mini_brain_temperature === "hot" && !["converted", "lost", "archived"].includes(lead.status)
  );
  const stale = scored.filter((lead) =>
    !["converted", "lost", "archived"].includes(lead.status) &&
    daysSince(lead.last_interaction_at || lead.updated_at || lead.created_at) >= MINI_BRAIN_SCORING.staleLeadDays
  );
  const missingContact = scored.filter((lead) => !lead.email && !lead.phone);
  const duplicateBuckets = leads.reduce((acc: Record<string, any[]>, lead) => {
    const key = leadKey(lead);
    if (!key) return acc;
    acc[key] = [...(acc[key] || []), lead];
    return acc;
  }, {});
  const duplicateGroups = Object.values(duplicateBuckets).filter((group) => group.length > 1);

  if (hotUnconverted.length) {
    insights.push(insight({
      key: "hot-unconverted-leads",
      type: "lead_intelligence",
      priority: "high",
      title: "Hot leads need a next step",
      summary: `${hotUnconverted.length} lead${hotUnconverted.length === 1 ? "" : "s"} score hot but are not converted.`,
      reasoning: [
        "Lead score combines status, contact completeness, communication activity, and campaign activity.",
        "Hot unconverted leads are better handled with a review-gated task or reply draft than an automatic send.",
      ],
      recommendedAction: "Review hot leads, confirm owner, and draft the next follow-up.",
      actionType: "draft_message",
      relatedRecords: hotUnconverted.slice(0, 5).map((lead) => recordRef("lead", lead, "Hot lead")),
      confidence: confidenceFromSignals([hotUnconverted.length >= 3, communications.length > 0], 0.72),
      score: hotUnconverted[0]?.mini_brain_score,
      trend: "up",
      metadata: {
        count: hotUnconverted.length,
        suggested_channel: hotUnconverted[0]?.phone ? "sms_or_call" : "email",
        top_score: hotUnconverted[0]?.mini_brain_score,
      },
    }));
  }

  if (stale.length) {
    insights.push(insight({
      key: "stale-leads",
      type: "lead_intelligence",
      priority: stale.length >= 10 ? "high" : "medium",
      title: "Lead follow-up freshness is slipping",
      summary: `${stale.length} active lead${stale.length === 1 ? "" : "s"} have not been touched in ${MINI_BRAIN_SCORING.staleLeadDays}+ days.`,
      reasoning: [
        "Freshness is calculated from the latest available interaction, update, or creation timestamp.",
        "Stale leads should enter a review queue before any external outreach is sent.",
      ],
      recommendedAction: "Batch stale leads by owner/source and create review tasks.",
      actionType: "create_task",
      relatedRecords: stale.slice(0, 5).map((lead) => recordRef("lead", lead, "Stale lead")),
      confidence: 0.8,
      trend: "down",
      metadata: { count: stale.length },
    }));
  }

  if (missingContact.length) {
    insights.push(insight({
      key: "missing-lead-contact-info",
      type: "safety_compliance",
      priority: "medium",
      title: "Leads missing contact details",
      summary: `${missingContact.length} lead${missingContact.length === 1 ? "" : "s"} cannot be reached by email or SMS.`,
      reasoning: ["Missing contact details block follow-up, automation, and reliable scoring."],
      recommendedAction: "Review incomplete leads before assigning outreach tasks.",
      actionType: "review_record",
      relatedRecords: missingContact.slice(0, 5).map((lead) => recordRef("lead", lead, "Incomplete lead")),
      confidence: 0.88,
      trend: "unknown",
      metadata: { count: missingContact.length },
    }));
  }

  if (duplicateGroups.length) {
    insights.push(insight({
      key: "duplicate-lead-groups",
      type: "lead_intelligence",
      priority: "medium",
      title: "Potential duplicate leads found",
      summary: `${duplicateGroups.length} duplicate lead group${duplicateGroups.length === 1 ? "" : "s"} share the same email or phone.`,
      reasoning: [
        "Duplicate detection uses exact email or phone matches.",
        "Merging should stay review-gated because duplicate-looking records can represent different contacts.",
      ],
      recommendedAction: "Open duplicate review and merge only after human confirmation.",
      actionType: "review_record",
      relatedRecords: duplicateGroups.flat().slice(0, 5).map((lead) => recordRef("lead", lead, "Duplicate lead")),
      confidence: 0.82,
      trend: "unknown",
      metadata: { group_count: duplicateGroups.length },
    }));
  }

  return insights;
}
