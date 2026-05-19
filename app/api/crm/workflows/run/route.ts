import { NextResponse } from "next/server";
import { createSupabaseAdmin, friendlySupabaseError } from "@/lib/crm/supabaseAdmin";
import { getWorkspaceContext } from "@/lib/auth/getWorkspaceContext";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const workflowId = body.workflow_id || body.workflowId;
    const context = await getWorkspaceContext(req);

    if (!workflowId) {
      return NextResponse.json({ success: false, error: "Missing workflow id." }, { status: 400 });
    }

    const supabase = createSupabaseAdmin();

    const { data: workflow, error: workflowError } = await supabase
      .from("crm_workflows")
      .select("*")
      .eq("id", workflowId)
      .match(context.workspaceId ? { workspace_id: context.workspaceId } : {})
      .single();

    if (workflowError) throw workflowError;

    const { data: run, error: runError } = await supabase
      .from("crm_workflow_runs")
      .insert({
        workspace_id: workflow.workspace_id || null,
        workflow_id: workflowId,
        status: "completed",
        completed_at: new Date().toISOString(),
        logs: [
          {
            type: "manual_review_test",
            message: "Workflow test run logged. No external messages were sent.",
            created_at: new Date().toISOString(),
          },
        ],
        metadata: {
          safe_mode: true,
          source: "workflow_page",
        },
      })
      .select()
      .single();

    if (runError) throw runError;

    await supabase
      .from("crm_workflows")
      .update({
        last_run_at: new Date().toISOString(),
        success_count: Number(workflow.success_count || 0) + 1,
      })
      .eq("id", workflowId);

    return NextResponse.json({ success: true, run });
  } catch (error: any) {
    const friendly = friendlySupabaseError(error);
    return NextResponse.json(
      { success: false, error: friendly.message, missingSchema: friendly.missingSchema },
      { status: friendly.missingSchema ? 501 : 500 }
    );
  }
}
