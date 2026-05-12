import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

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
        ai_score: score,
        ai_segment:
          segment,
      })
      .eq(
        "id",
        lead.id
      );

    updated.push({
      ...lead,
      ai_score: score,
      ai_segment:
        segment,
    });
  }

  await supabase
    .from(
      "marketing_activity"
    )
    .insert({
      title:
        "AI Lead Scoring Updated",
      description:
        "Autonomous AI recalculated lead conversion probabilities.",
    });

  return updated;
}
