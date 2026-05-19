import { createMarketingSupabaseAdmin } from "@/lib/marketing/supabaseAdmin";

async function executeAction(
  action: any,
  lead: any
) {
  const supabase = createMarketingSupabaseAdmin();

  if (
    action.type ===
    "email"
  ) {
    await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/marketing/email/send`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          leads: [lead],
          subject:
            action.subject,
          body:
            action.body,
        }),
      }
    );
  }

  if (
    action.type ===
    "sms"
  ) {
    await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL}/api/marketing/sms/send`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          leads: [lead],
          message:
            action.body,
        }),
      }
    );
  }

  if (
    action.type ===
    "wait"
  ) {
    return;
  }
}

export async function executeWorkflow(
  workflowId: string,
  lead: any
) {
  const {
    data: workflow,
  } = await supabase
    .from(
      "marketing_workflows"
    )
    .select("*")
    .eq(
      "id",
      workflowId
    )
    .single();

  if (!workflow) {
    return;
  }

  const actions =
    workflow.actions || [];

  for (const action of actions) {
    await executeAction(
      action,
      lead
    );
  }

  await supabase
    .from(
      "marketing_events"
    )
    .insert({
      type: "workflow",
      event_type: "workflow",
      action: "executed",
      title: "Workflow Executed",
      message:
        `${workflow.name} executed for ${lead.email}`,
      details:
        `${workflow.name} executed for ${lead.email}`,
    });
}
