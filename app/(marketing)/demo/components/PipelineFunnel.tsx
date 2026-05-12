"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { fetchWorkspaces } from "@/lib/api/workspace.api";

export default function PipelineFunnel() {
  const [stages, setStages] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const workspaces = await fetchWorkspaces();
      const workspaceId = (workspaces as any[])[0]?.id;
      if (!workspaceId) return;

      const { data } = await supabase
        .from("pipeline_stages")
        .select("*")
        .eq("workspace_id", workspaceId)
        .order("position", { ascending: true });

      setStages(data || []);
    }
    load();
  }, []);

  return (
    <div className="w-full h-full">
      {/* UI shell */}
    </div>
  );
}
