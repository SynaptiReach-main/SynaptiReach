import { createSupabaseAdmin } from "@/lib/crm/supabaseAdmin";
import type { MiniBrainInsight } from "./types";

type PersistOptions = {
  workspaceId?: string | null;
  companyId?: string | null;
  userId?: string | null;
  limit?: number;
};

export async function persistMiniBrainInsights(insights: MiniBrainInsight[], options: PersistOptions = {}) {
  const limited = insights.slice(0, options.limit || 10);
  if (!limited.length) {
    return { persisted: 0, skipped: 0, errors: [] as string[] };
  }

  const supabase = createSupabaseAdmin();
  const errors: string[] = [];
  let persisted = 0;
  let skipped = 0;

  for (const item of limited) {
    const idempotencyKey = item.id;
    let existingQuery = supabase
      .from("marketing_ai_recommendations")
      .select("id")
      .contains("metadata", { idempotency_key: idempotencyKey })
      .limit(1);
    if (options.workspaceId) {
      existingQuery = existingQuery.eq("workspace_id", options.workspaceId);
    }
    const existing = await existingQuery;

    if (!existing.error && existing.data && existing.data.length > 0) {
      skipped += 1;
      continue;
    }

    const payload = {
      workspace_id: options.workspaceId || null,
      company_id: options.companyId || null,
      user_id: options.userId || null,
      recommendation_type: item.type,
      title: item.title,
      description: item.summary,
      status: "pending_review",
      priority: item.priority,
      estimated_impact: item.recommendedAction,
      metadata: {
        idempotency_key: idempotencyKey,
        confidence: item.confidence,
        action_type: item.actionType,
        source: "mini_brain",
        generated_at: item.createdAt,
        review_required: true,
        reasoning: item.reasoning,
        related_records: item.relatedRecords,
        score: item.score,
        trend: item.trend,
        ...(item.metadata || {}),
      },
    };

    const { error } = await supabase.from("marketing_ai_recommendations").insert(payload as any);
    if (error) {
      errors.push(error.message || "Failed to persist insight.");
    } else {
      persisted += 1;
    }
  }

  return { persisted, skipped: skipped + (limited.length - skipped - persisted), errors };
}
