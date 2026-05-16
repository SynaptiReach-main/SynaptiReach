-- SynaptiReach autonomous CRM feature-completion schema.
-- Safe to run more than once. These tables are intended for server-side API
-- access with the Supabase service role until workspace/auth RLS is finalized.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create table if not exists public.crm_deals (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  lead_id uuid null,
  deal_id uuid null,
  title text not null,
  company text null,
  value numeric(12,2) not null default 0,
  stage text not null default 'new',
  status text not null default 'open',
  probability integer not null default 0,
  expected_close_date timestamptz null,
  notes text null,
  archived boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.crm_deals add column if not exists workspace_id uuid null;
alter table public.crm_deals add column if not exists lead_id uuid null;
alter table public.crm_deals add column if not exists title text;
alter table public.crm_deals add column if not exists company text null;
alter table public.crm_deals add column if not exists value numeric(12,2) not null default 0;
alter table public.crm_deals add column if not exists stage text not null default 'new';
alter table public.crm_deals add column if not exists status text not null default 'open';
alter table public.crm_deals add column if not exists probability integer not null default 0;
alter table public.crm_deals add column if not exists expected_close_date timestamptz null;
alter table public.crm_deals add column if not exists notes text null;
alter table public.crm_deals add column if not exists archived boolean not null default false;
alter table public.crm_deals add column if not exists metadata jsonb not null default '{}'::jsonb;
alter table public.crm_deals add column if not exists created_at timestamptz not null default now();
alter table public.crm_deals add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_crm_deals_workspace_created on public.crm_deals(workspace_id, created_at desc);
create index if not exists idx_crm_deals_stage on public.crm_deals(stage);
create index if not exists idx_crm_deals_status on public.crm_deals(status);
create index if not exists idx_crm_deals_lead on public.crm_deals(lead_id);

drop trigger if exists set_crm_deals_updated_at on public.crm_deals;
create trigger set_crm_deals_updated_at
before update on public.crm_deals
for each row execute function public.set_updated_at();

create table if not exists public.crm_workflows (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  name text not null,
  status text not null default 'draft',
  trigger_type text null,
  condition text null,
  action text null,
  actions jsonb not null default '[]'::jsonb,
  last_run_at timestamptz null,
  success_count integer not null default 0,
  failure_count integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.crm_workflows add column if not exists workspace_id uuid null;
alter table public.crm_workflows add column if not exists name text;
alter table public.crm_workflows add column if not exists status text not null default 'draft';
alter table public.crm_workflows add column if not exists trigger_type text null;
alter table public.crm_workflows add column if not exists condition text null;
alter table public.crm_workflows add column if not exists action text null;
alter table public.crm_workflows add column if not exists actions jsonb not null default '[]'::jsonb;
alter table public.crm_workflows add column if not exists last_run_at timestamptz null;
alter table public.crm_workflows add column if not exists success_count integer not null default 0;
alter table public.crm_workflows add column if not exists failure_count integer not null default 0;
alter table public.crm_workflows add column if not exists metadata jsonb not null default '{}'::jsonb;
alter table public.crm_workflows add column if not exists created_at timestamptz not null default now();
alter table public.crm_workflows add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_crm_workflows_workspace_created on public.crm_workflows(workspace_id, created_at desc);
create index if not exists idx_crm_workflows_status on public.crm_workflows(status);

drop trigger if exists set_crm_workflows_updated_at on public.crm_workflows;
create trigger set_crm_workflows_updated_at
before update on public.crm_workflows
for each row execute function public.set_updated_at();

create table if not exists public.crm_workflow_runs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  workflow_id uuid null,
  status text not null default 'completed',
  started_at timestamptz not null default now(),
  completed_at timestamptz null,
  logs jsonb not null default '[]'::jsonb,
  error text null,
  metadata jsonb not null default '{}'::jsonb
);

alter table public.crm_workflow_runs add column if not exists workspace_id uuid null;
alter table public.crm_workflow_runs add column if not exists workflow_id uuid null;
alter table public.crm_workflow_runs add column if not exists status text not null default 'completed';
alter table public.crm_workflow_runs add column if not exists started_at timestamptz not null default now();
alter table public.crm_workflow_runs add column if not exists completed_at timestamptz null;
alter table public.crm_workflow_runs add column if not exists logs jsonb not null default '[]'::jsonb;
alter table public.crm_workflow_runs add column if not exists error text null;
alter table public.crm_workflow_runs add column if not exists metadata jsonb not null default '{}'::jsonb;

create index if not exists idx_crm_workflow_runs_workspace_started on public.crm_workflow_runs(workspace_id, started_at desc);
create index if not exists idx_crm_workflow_runs_workflow on public.crm_workflow_runs(workflow_id);

create table if not exists public.crm_appointments (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  lead_id uuid null,
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz null,
  status text not null default 'scheduled',
  location text null,
  notes text null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.crm_appointments add column if not exists workspace_id uuid null;
alter table public.crm_appointments add column if not exists lead_id uuid null;
alter table public.crm_appointments add column if not exists deal_id uuid null;
alter table public.crm_appointments add column if not exists title text;
alter table public.crm_appointments add column if not exists starts_at timestamptz;
alter table public.crm_appointments add column if not exists ends_at timestamptz null;
alter table public.crm_appointments add column if not exists status text not null default 'scheduled';
alter table public.crm_appointments add column if not exists location text null;
alter table public.crm_appointments add column if not exists notes text null;
alter table public.crm_appointments add column if not exists metadata jsonb not null default '{}'::jsonb;
alter table public.crm_appointments add column if not exists created_at timestamptz not null default now();
alter table public.crm_appointments add column if not exists updated_at timestamptz not null default now();

create index if not exists idx_crm_appointments_workspace_starts on public.crm_appointments(workspace_id, starts_at);
create index if not exists idx_crm_appointments_lead on public.crm_appointments(lead_id);
create index if not exists idx_crm_appointments_deal on public.crm_appointments(deal_id);
create index if not exists idx_crm_appointments_status on public.crm_appointments(status);

drop trigger if exists set_crm_appointments_updated_at on public.crm_appointments;
create trigger set_crm_appointments_updated_at
before update on public.crm_appointments
for each row execute function public.set_updated_at();

create table if not exists public.crm_usage (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  plan text null,
  trial_started_at timestamptz null,
  trial_ends_at timestamptz null,
  ai_actions_used integer not null default 0,
  emails_used integer not null default 0,
  sms_used integer not null default 0,
  contacts_used integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_crm_usage_workspace on public.crm_usage(workspace_id);

drop trigger if exists set_crm_usage_updated_at on public.crm_usage;
create trigger set_crm_usage_updated_at
before update on public.crm_usage
for each row execute function public.set_updated_at();

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  name text null,
  email text null,
  phone text null,
  company text null,
  message text null,
  source text null,
  status text not null default 'new',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_contact_submissions_created on public.contact_submissions(created_at desc);
create index if not exists idx_contact_submissions_email on public.contact_submissions(email);

create table if not exists public.crm_tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  lead_id uuid null,
  deal_id uuid null,
  campaign_id uuid null,
  title text not null,
  details text null,
  status text not null default 'open',
  priority text not null default 'medium',
  assigned_to text null,
  due_date timestamptz null,
  completed_at timestamptz null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.crm_tasks add column if not exists workspace_id uuid null;
alter table public.crm_tasks add column if not exists lead_id uuid null;
alter table public.crm_tasks add column if not exists deal_id uuid null;
alter table public.crm_tasks add column if not exists campaign_id uuid null;
alter table public.crm_tasks add column if not exists title text;
alter table public.crm_tasks add column if not exists details text null;
alter table public.crm_tasks add column if not exists status text not null default 'open';
alter table public.crm_tasks add column if not exists priority text not null default 'medium';
alter table public.crm_tasks add column if not exists assigned_to text null;
alter table public.crm_tasks add column if not exists due_date timestamptz null;
alter table public.crm_tasks add column if not exists completed_at timestamptz null;
alter table public.crm_tasks add column if not exists metadata jsonb not null default '{}'::jsonb;
alter table public.crm_tasks add column if not exists created_at timestamptz not null default now();
alter table public.crm_tasks add column if not exists updated_at timestamptz not null default now();
create index if not exists idx_crm_tasks_workspace_created on public.crm_tasks(workspace_id, created_at desc);
create index if not exists idx_crm_tasks_status on public.crm_tasks(status);
create index if not exists idx_crm_tasks_lead on public.crm_tasks(lead_id);
create index if not exists idx_crm_tasks_deal on public.crm_tasks(deal_id);
create index if not exists idx_crm_tasks_campaign on public.crm_tasks(campaign_id);
create index if not exists idx_crm_tasks_due on public.crm_tasks(due_date);

drop trigger if exists set_crm_tasks_updated_at on public.crm_tasks;
create trigger set_crm_tasks_updated_at
before update on public.crm_tasks
for each row execute function public.set_updated_at();

-- RLS/auth note:
-- These tables are consumed by server-side Next.js API routes using the service
-- role key. Before exposing direct client access, enable RLS and add policies
-- that enforce the final workspace membership model.
