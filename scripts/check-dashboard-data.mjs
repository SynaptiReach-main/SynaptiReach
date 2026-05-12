import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY
);

const tables = [
  "pipeline_stages",
  "activities",
  "automation_tasks",
  "customer_health",
  "team_performance",
  "revenue_forecasts"
];

for (const table of tables) {
  const { data, error } = await supabase
    .from(table)
    .select("*");

  console.log("");
  console.log("TABLE:", table);

  if (error) {
    console.log(error);
  } else {
    console.log(JSON.stringify(data, null, 2));
  }
}

process.exit(0);
