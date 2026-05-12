const PROJECT_REF = "qjqyxdayqzismlaxofes";

const SERVICE_ROLE_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;

const sql = `
alter table workspaces add column if not exists name text;
alter table workspaces add column if not exists industry text;
alter table workspaces add column if not exists monthly_revenue numeric default 0;
alter table workspaces add column if not exists yearly_revenue numeric default 0;
alter table workspaces add column if not exists roi_target text;
alter table workspaces add column if not exists integrations jsonb default '[]'::jsonb;

alter table workspaces add column if not exists onboarding_data jsonb default '{}'::jsonb;

alter table workspaces add column if not exists ai_personality text;
alter table workspaces add column if not exists response_time text;
alter table workspaces add column if not exists services jsonb default '[]'::jsonb;
alter table workspaces add column if not exists peak_months jsonb default '[]'::jsonb;
alter table workspaces add column if not exists slow_months jsonb default '[]'::jsonb;
alter table workspaces add column if not exists products jsonb default '[]'::jsonb;
alter table workspaces add column if not exists promoted_products jsonb default '[]'::jsonb;

alter table workspaces add column if not exists lead_count integer default 0;
alter table workspaces add column if not exists open_tasks integer default 0;
alter table workspaces add column if not exists response_rate numeric default 0;

alter table workspaces add column if not exists uploaded_knowledge_count integer default 0;
alter table workspaces add column if not exists csv_imported boolean default false;

alter table workspaces add column if not exists pipeline_state jsonb default '{}'::jsonb;
alter table workspaces add column if not exists automation_state jsonb default '{}'::jsonb;
alter table workspaces add column if not exists ai_ceo_state jsonb default '{}'::jsonb;
`;

async function run() {

  const response = await fetch(
    `https://${PROJECT_REF}.supabase.co/rest/v1/rpc/query`,
    {
      method: "POST",
      headers: {
        apikey: SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: sql
      })
    }
  );

  const text = await response.text();

  console.log("");
  console.log("STATUS:");
  console.log(response.status);

  console.log("");
  console.log(text);
}

run();
