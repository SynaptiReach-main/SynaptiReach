import { createMarketingSupabaseAdmin }
from "@/lib/marketing/supabaseAdmin";

export async function processRetryQueue() {
  const supabase =
    createMarketingSupabaseAdmin();

  const {
    data: failed,
  } = await supabase
    .from(
      "marketing_retry_queue"
    )
    .select("*")
    .eq(
      "status",
      "pending"
    )
    .lt(
      "attempts",
      5
    );

  for (const item of failed || []) {
    try {
      await supabase
        .from(
          "marketing_retry_queue"
        )
        .update({
          status:
            "completed",

          completed_at:
            new Date()
              .toISOString(),
        })
        .eq(
          "id",
          item.id
        );
    } catch {
      await supabase
        .from(
          "marketing_retry_queue"
        )
        .update({
          attempts:
            item.attempts + 1,
        })
        .eq(
          "id",
          item.id
        );
    }
  }

  return {
    processed:
      failed?.length || 0,
  };
}
