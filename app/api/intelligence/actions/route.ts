import { NextResponse } from "next/server";
import { getWorkspaceContext } from "@/lib/auth/getWorkspaceContext";
import { createSupabaseAdmin, friendlySupabaseError } from "@/lib/crm/supabaseAdmin";
import { routeForInsight } from "@/lib/intelligence/actionMapper";
import type { MiniBrainInsight } from "@/lib/intelligence/types";

function normalizePriority(priority: MiniBrainInsight["priority"] | string | undefined) {
  if (priority === "urgent" || priority === "high" || priority === "medium" || priority === "low") {
    return priority;
  }
  return "medium";
}

function notificationPriority(priority: MiniBrainInsight["priority"] | string | undefined) {
  return priority === "urgent" ? "high" : normalizePriority(priority);
}

function firstRelatedRecord(insight: MiniBrainInsight) {
  return Array.isArray(insight.relatedRecords) && insight.relatedRecords.length > 0
    ? insight.relatedRecords[0]
    : null;
}

function draftTaskFromInsight(insight: MiniBrainInsight, context: Awaited<ReturnType<typeof getWorkspaceContext>>) {
  const related = firstRelatedRecord(insight);
  return {
    workspace_id: context.workspaceId,
    company_id: context.companyId,
    user_id: context.userId,
    lead_id: related?.type === "lead" ? related.id : null,
    deal_id: related?.type === "deal" ? related.id : null,
    campaign_id: related?.type === "campaign" ? related.id : null,
    title: insight.recommendedAction || insight.title,
    details: [insight.summary, ...(insight.reasoning || [])].filter(Boolean).join("\n\n"),
    status: "open",
    priority: normalizePriority(insight.priority),
    due_date: new Date(Date.now() + (insight.priority === "urgent" ? 2 : 24) * 60 * 60 * 1000).toISOString(),
    metadata: {
      source: "mini_brain",
      review_required: true,
      draft: true,
      insight_id: insight.id,
      action_type: insight.actionType,
      confidence: insight.confidence,
      related_records: insight.relatedRecords || [],
      reasoning: insight.reasoning || [],
      destination_page: routeForInsight(insight),
    },
  };
}

function draftMessageFromInsight(insight: MiniBrainInsight, context: Awaited<ReturnType<typeof getWorkspaceContext>>) {
  const related = firstRelatedRecord(insight);
  return {
    workspace_id: context.workspaceId,
    company_id: context.companyId,
    user_id: context.userId,
    lead_id: related?.type === "lead" ? related.id : null,
    campaign_id: related?.type === "campaign" ? related.id : null,
    channel: "email",
    direction: "outbound",
    subject: insight.title,
    content: `${insight.summary}\n\nRecommended next step: ${insight.recommendedAction}`,
    status: "draft",
    metadata: {
      source: "mini_brain",
      review_required: true,
      insight_id: insight.id,
      action_type: insight.actionType,
      confidence: insight.confidence,
      related_records: insight.relatedRecords || [],
      external_send_allowed: false,
    },
  };
}

function draftWorkflowFromInsight(insight: MiniBrainInsight, context: Awaited<ReturnType<typeof getWorkspaceContext>>) {
  return {
    workspace_id: context.workspaceId,
    company_id: context.companyId,
    user_id: context.userId,
    name: insight.title,
    status: "draft",
    trigger_type: "manual_review",
    condition: insight.summary,
    action: insight.recommendedAction,
    actions: [
      {
        type: insight.actionType,
        label: insight.recommendedAction,
        review_required: true,
      },
    ],
    metadata: {
      source: "mini_brain",
      review_required: true,
      insight_id: insight.id,
      confidence: insight.confidence,
      related_records: insight.relatedRecords || [],
    },
  };
}

async function insertAuditLog(
  supabase: ReturnType<typeof createSupabaseAdmin>,
  context: Awaited<ReturnType<typeof getWorkspaceContext>>,
  action: string,
  insight: MiniBrainInsight,
  result?: Record<string, unknown>
) {
  await supabase.from("crm_audit_logs").insert({
    workspace_id: context.workspaceId,
    company_id: context.companyId,
    user_id: context.userId,
    action,
    resource_type: "mini_brain_insight",
    details: insight.title,
    metadata: {
      source: "mini_brain",
      review_required: true,
      insight_id: insight.id,
      action_type: insight.actionType,
      confidence: insight.confidence,
      result: result || null,
    },
  } as any);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const insight = body.insight as MiniBrainInsight | undefined;
    const decision = body.decision === "dismiss" || body.decision === "deny" ? body.decision : "approve";

    if (!insight?.id || insight.source !== "mini_brain") {
      return NextResponse.json(
        { success: false, error: "A built-in intelligence insight payload is required." },
        { status: 400 }
      );
    }

    const context = await getWorkspaceContext(request);
    const supabase = createSupabaseAdmin();
    const href = routeForInsight(insight);

    if (decision !== "approve") {
      await insertAuditLog(supabase, context, `mini_brain_${decision}`, insight);
      return NextResponse.json({
        success: true,
        decision,
        review_required: true,
        source: "mini_brain",
        message: "Intelligence insight decision was recorded without taking external action.",
      });
    }

    let table = "crm_notifications";
    let created: any = null;

    if (insight.actionType === "create_task" || insight.actionType === "assign_staff" || insight.actionType === "schedule_appointment") {
      const { data, error } = await supabase.from("crm_tasks").insert(draftTaskFromInsight(insight, context) as any).select().single();
      if (error) throw error;
      table = "crm_tasks";
      created = data;
    } else if (insight.actionType === "draft_message") {
      const { data, error } = await supabase.from("communications").insert(draftMessageFromInsight(insight, context) as any).select().single();
      if (error) throw error;
      table = "communications";
      created = data;
    } else if (insight.actionType === "create_workflow") {
      const { data, error } = await supabase.from("crm_workflows").insert(draftWorkflowFromInsight(insight, context) as any).select().single();
      if (error) throw error;
      table = "crm_workflows";
      created = data;
    } else {
      const { data, error } = await supabase
        .from("crm_notifications")
        .insert({
          workspace_id: context.workspaceId,
          company_id: context.companyId,
          user_id: context.userId,
          title: insight.title,
          message: insight.summary,
          type: "mini_brain",
          priority: notificationPriority(insight.priority),
          status: "unread",
          href,
          metadata: {
            source: "mini_brain",
            review_required: true,
            insight_id: insight.id,
            action_type: insight.actionType,
            confidence: insight.confidence,
            recommended_action: insight.recommendedAction,
            related_records: insight.relatedRecords || [],
          },
        } as any)
        .select()
        .single();
      if (error) throw error;
      created = data;
    }

    await insertAuditLog(supabase, context, "mini_brain_approved_review_gated_action", insight, {
      table,
      id: created?.id || null,
    });

    return NextResponse.json({
      success: true,
      decision: "approve",
      review_required: true,
      source: "mini_brain",
      actionType: insight.actionType,
      createdTable: table,
      created,
      href,
      message: "Review-gated intelligence action was created. No external message, charge, or post was sent.",
    });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      {
        success: false,
        error: friendly.message || "Failed to apply intelligence action.",
        setup_required: friendly.setupRequired || false,
        missingSchema: friendly.missingSchema || false,
      },
      { status: friendly.setupRequired ? 503 : friendly.missingSchema ? 501 : 500 }
    );
  }
}
