import { createClient }
from "@supabase/supabase-js";

const supabase = createClient(
  process.env
    .NEXT_PUBLIC_SUPABASE_URL || "",

  process.env
    .SUPABASE_SERVICE_ROLE_KEY || ""
);

export async function isSuppressed(
  workspaceId: string,
  contact: string
) {
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
