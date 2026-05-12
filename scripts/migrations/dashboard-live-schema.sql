create extension if not exists "pgcrypto";

create table if not exists public.pipeline_stages (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  name text not null,
  count integer not null default 0,
  position integer not null,
  color text,
  created_at timestamptz default now()
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  message text not null,
  type text,
  created_at timestamptz default now()
);

create table if not exists public.automation_tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  task text not null,
  status text not null,
  created_at timestamptz default now()
);

create table if not exists public.customer_health (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  name text not null,
  health text not null,
  usage integer not null,
  created_at timestamptz default now()
);

create table if not exists public.team_performance (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  name text not null,
  deals integer not null,
  close_rate integer not null,
  created_at timestamptz default now()
);

create table if not exists public.revenue_forecasts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null,
  month text not null,
  value integer not null,
  created_at timestamptz default now()
);

create index if not exists idx_pipeline_workspace
on public.pipeline_stages(workspace_id);

create index if not exists idx_activities_workspace
on public.activities(workspace_id);

create index if not exists idx_automation_workspace
on public.automation_tasks(workspace_id);

create index if not exists idx_customer_health_workspace
on public.customer_health(workspace_id);

create index if not exists idx_team_workspace
on public.team_performance(workspace_id);

create index if not exists idx_revenue_workspace
on public.revenue_forecasts(workspace_id);
