import { createMarketingSupabaseAdmin }
from "@/lib/marketing/supabaseAdmin";

export async function isSuppressed(
  workspaceId: string,
  contact: string
) {
  const supabase =
    createMarketingSupabaseAdmin();

  const {
    data,
  } = await supabase
    .from(
      "marketing_suppression_list"
    )
    .select("*")
    .eq(
      "workspace_id",
      workspaceId
    )
    .eq(
      "contact",
      contact
    )
    .maybeSingle();

  return !!data;
}
