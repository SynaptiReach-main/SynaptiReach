import { createMarketingSupabaseAdmin } from "@/lib/marketing/supabaseAdmin";

function calculateLeadScore(
  lead: any
) {
  let score = 0;

  if (
    lead.status ===
    "qualified"
  ) {
    score += 40;
  }

  if (
    lead.status ===
    "converted"
  ) {
    score += 60;
  }

  if (
    lead.email
  ) {
    score += 10;
  }

  if (
    lead.phone
  ) {
    score += 10;
  }

  if (
    lead.company
  ) {
    score += 10;
  }

  return Math.min(
    score,
    100
  );
}

function classifyLead(
  score: number
) {
  if (score >= 80) {
    return "hot";
  }

  if (score >= 50) {
    return "warm";
  }

  return "cold";
}

export async function runLeadScoring() {
  const supabase = createMarketingSupabaseAdmin();

  const {
    data: leads,
  } = await supabase
    .from("leads")
    .select("*");

  if (!leads) {
    return [];
  }

  const updated = [];

  for (const lead of leads) {
    const score =
      calculateLeadScore(
        lead
      );

    const segment =
      classifyLead(
        score
      );

    await supabase
      .from("leads")
      .update({
        score,
        metadata: {
          ...(lead.metadata || {}),
          ai_segment:
            segment,
        },
      })
      .eq(
        "id",
        lead.id
      );

    updated.push({
      ...lead,
      score,
      metadata: {
        ...(lead.metadata || {}),
        ai_segment:
          segment,
      },
    });
  }

  await supabase
    .from(
      "marketing_events"
    )
    .insert({
      type: "lead_scoring",
      event_type: "lead_scoring",
      action: "scored",
      title: "AI Lead Scoring Updated",
      message:
        "Autonomous AI recalculated lead conversion probabilities.",
      details:
        "Autonomous AI recalculated lead conversion probabilities.",
    });

  return updated;
}
