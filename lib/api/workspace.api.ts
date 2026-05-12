import { supabase } from "@/lib/supabase/client";

export async function fetchWorkspaces() {
  const { data, error } = await supabase
    .from("workspaces")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }
  return data ?? [];
}
