"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { fetchWorkspaces } from "@/lib/api/workspace.api";

export default function () {
  const [, set] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const workspaces = await fetchWorkspaces();
      const workspaceId = workspaces[0]?.id;
      if (!workspaceId) return;

      const { data } = await supabase
        .from("")
        .select("*")
        .eq("workspace_id", workspaceId)
        .order("", { ascending: true });

      set(data || []);
    }
    load();
  }, []);

  return (
    <div className="w-full h-full">
      {/* UI shell */}
    </div>
  );
}
