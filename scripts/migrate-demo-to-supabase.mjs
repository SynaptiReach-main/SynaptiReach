import fs from "fs";
import path from "path";

const files = [
  "PipelineFunnel.tsx",
  "LiveActivityStream.tsx",
  "AutomationQueue.tsx",
  "CustomerHealth.tsx",
  "TeamPerformance.tsx",
  "RevenueForecast.tsx",
  "SalesHeatmap.tsx"
];

const map = {
  PipelineFunnel: {
    table: "pipeline_stages",
    state: "stages",
    order: "position"
  },
  LiveActivityStream: {
    table: "activities",
    state: "activities",
    order: "created_at"
  },
  AutomationQueue: {
    table: "automation_tasks",
    state: "tasks",
    order: "created_at"
  },
  CustomerHealth: {
    table: "customer_health",
    state: "clients",
    order: "created_at"
  },
  TeamPerformance: {
    table: "team_performance",
    state: "reps",
    order: "created_at"
  },
  RevenueForecast: {
    table: "revenue_forecasts",
    state: "months",
    order: "created_at"
  }
};

const inject = (name, cfg) => `
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { getWorkspaces } from "@/server/services/workspace.service

export default function ${name}() {
  const [${cfg.state}, set${cfg.state.charAt(0).toUpperCase() + cfg.state.slice(1)}] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { workspace } = await getWorkspaces();

      const { data } = await supabase
        .from("${cfg.table}")
        .select("*")
        .eq("workspace_id", workspace.id)
        .order("${cfg.order}", { ascending: true });

      set${cfg.state.charAt(0).toUpperCase() + cfg.state.slice(1)}(data || []);
    }

    load();
  }, []);

  return null; // UI stays unchanged in your existing file
}
`;

for (const file of files) {
  const base = file.replace(".tsx", "");
  const cfg = map[base];

  if (!cfg) continue;

  const filePath = path.join(
    process.cwd(),
    "app/(marketing)/demo/components",
    file
  );

  if (!fs.existsSync(filePath)) continue;

  const content = fs.readFileSync(filePath, "utf8");

  const updated = inject(base, cfg);

  fs.writeFileSync(filePath, updated.trim());

  console.log("UPDATED:", file);
}

console.log("DONE - ALL COMPONENTS MIGRATED TO SUPABASE PATTERN");
