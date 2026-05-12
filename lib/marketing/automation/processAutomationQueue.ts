import { createClient }
from "@supabase/supabase-js";

const supabase = createClient(
  process.env
    .NEXT_PUBLIC_SUPABASE_URL || "",

  process.env
    .SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function processAutomationQueue() {
  const now =
    new Date().toISOString();

  const {
    data: queued,
  } = await supabase
    .from(
      "marketing_automation_queue"
    )
    .select("*")
    .eq(
      "status",
      "pending"
    )
    .lte(
      "execute_at",
      now
    );

  for (const item of queued || []) {
    try {
      await supabase
        .from(
          "marketing_campaigns"
        )
        .insert({
          workspace_id:
            item.workspace_id,

          name:
            item.name,

          type:
            item.type,

          status:
            "scheduled",

          scheduled_for:
            now,

          content:
            item.content,
        });

      await supabase
        .from(
          "marketing_automation_queue"
        )
        .update({
          status:
            "completed",

          completed_at:
            now,
        })
        .eq(
          "id",
          item.id
        );
    } catch (error) {
      await supabase
        .from(
          "marketing_automation_queue"
        )
        .update({
          status:
            "failed",
        })
        .eq(
          "id",
          item.id
        );
    }
  }

  return {
    success: true,
    processed:
      queued?.length || 0,
  };
}
