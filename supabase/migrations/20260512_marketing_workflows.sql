create table if not exists marketing_workflows (
  id uuid primary key default gen_random_uuid(),

  name text not null,

  trigger_type text,

  actions jsonb default '[]'::jsonb,

  created_at timestamptz default now()
);
