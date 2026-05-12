"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { fetchWorkspaces } from "@/lib/api/workspace.api";

export default function AutomationQueue() {
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      const workspaces = await fetchWorkspaces();
      const workspaceId = (workspaces as any[])[0]?.id;
      if (!workspaceId) return;

      const { data } = await supabase
        .from("automation_tasks")
        .select("*")
        .eq("workspace_id", workspaceId)
        .order("created_at", { ascending: true });

      setTasks(data || []);
    }
    load();
  }, []);

  return (
    <div className="w-full h-full">
      {/* UI shell */}
    </div>
  );
}
