import { insight } from "./templates";
import type { MiniBrainContext, MiniBrainInsight } from "./types";

export function crmHygieneInsights(context: MiniBrainContext): MiniBrainInsight[] {
  const leads = context.leads || [];
  const missingContact = leads.filter((lead) => !lead.email && !lead.phone);
  const duplicateEmails = new Set<string>();
  const seen = new Set<string>();
  for (const lead of leads) {
    const email = String(lead.email || "").toLowerCase();
    if (!email) continue;
    if (seen.has(email)) duplicateEmails.add(email);
    seen.add(email);
  }

  const insights: MiniBrainInsight[] = [];
  if (missingContact.length) {
    insights.push(insight({
      key: "missing-contact",
      type: "lead_intelligence",
      priority: "medium",
      title: "Leads missing contact details",
      summary: `${missingContact.length} lead${missingContact.length === 1 ? "" : "s"} have no email or phone.`,
      reasoning: ["Leads without contact details cannot receive review-gated follow-up."],
      recommendedAction: "Review lead records and enrich missing contact details before assigning follow-up.",
      actionType: "review_record",
      relatedRecords: missingContact.slice(0, 5).map((lead) => ({ type: "lead", id: String(lead.id), label: lead.name || "Lead" })),
      confidence: 0.82,
      trend: "unknown",
      metadata: { count: missingContact.length },
    }));
  }

  if (duplicateEmails.size) {
    insights.push(insight({
      key: "duplicate-leads",
      type: "lead_intelligence",
      priority: "medium",
      title: "Possible duplicate leads",
      summary: `${duplicateEmails.size} email address${duplicateEmails.size === 1 ? "" : "es"} appear on multiple leads.`,
      reasoning: ["Duplicate contacts can inflate metrics and split communication history."],
      recommendedAction: "Review possible duplicates before launching campaigns.",
      actionType: "review_record",
      relatedRecords: [],
      confidence: 0.72,
      trend: "unknown",
      metadata: { duplicateEmails: Array.from(duplicateEmails).slice(0, 10) },
    }));
  }

  return insights;
}
