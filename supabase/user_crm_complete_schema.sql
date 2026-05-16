-- SynaptiReach User CRM complete schema
-- Safe to run more than once.

create extension if not exists "pgcrypto";

create table if not exists workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text,
  business_type text,
  owner_id uuid,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table workspaces add column if not exists logo_url text;
alter table workspaces add column if not exists integrations jsonb default '[]'::jsonb;
alter table workspaces add column if not exists onboarding_data jsonb default '{}'::jsonb;
alter table workspaces add column if not exists intelligence jsonb default '{}'::jsonb;
alter table workspaces add column if not exists ai_ceo_state jsonb default '{}'::jsonb;
alter table workspaces add column if not exists monthly_revenue numeric default 0;
alter table workspaces add column if not exists yearly_revenue numeric default 0;
alter table workspaces add column if not exists lead_count integer default 0;
alter table workspaces add column if not exists open_tasks integer default 0;
alter table workspaces add column if not exists response_rate numeric default 0;
alter table workspaces add column if not exists updated_at timestamptz default now();

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid,
  name text,
  email text,
  phone text,
  company text,
  source text,
  status text default 'new',
  score integer default 0,
  notes text,
  last_interaction timestamptz,
  archived boolean default false,
  imported boolean default false,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table leads add column if not exists workspace_id uuid;
alter table leads add column if not exists company text;
alter table leads add column if not exists source text;
alter table leads add column if not exists status text default 'new';
alter table leads add column if not exists score integer default 0;
alter table leads add column if not exists notes text;
alter table leads add column if not exists last_interaction timestamptz;
alter table leads add column if not exists archived boolean default false;
alter table leads add column if not exists imported boolean default false;
alter table leads add column if not exists metadata jsonb default '{}'::jsonb;
alter table leads add column if not exists updated_at timestamptz default now();

create index if not exists leads_workspace_idx on leads(workspace_id);
create index if not exists leads_status_idx on leads(status);
create index if not exists leads_source_idx on leads(source);
create index if not exists leads_email_idx on leads(email);
create index if not exists leads_created_idx on leads(created_at desc);
create index if not exists leads_archived_idx on leads(archived);

create table if not exists lead_activities (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid,
  lead_id uuid,
  type text default 'note',
  title text,
  details text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists lead_activities_lead_idx on lead_activities(lead_id);
create index if not exists lead_activities_workspace_idx on lead_activities(workspace_id);
create index if not exists lead_activities_created_idx on lead_activities(created_at desc);

create table if not exists communications (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid,
  lead_id uuid,
  campaign_id uuid,
  channel text not null default 'email',
  direction text default 'outbound',
  recipient text,
  subject text,
  content text,
  status text default 'draft',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table communications add column if not exists workspace_id uuid;
alter table communications add column if not exists lead_id uuid;
alter table communications add column if not exists campaign_id uuid;
alter table communications add column if not exists recipient text;
alter table communications add column if not exists subject text;
alter table communications add column if not exists content text;
alter table communications add column if not exists status text default 'draft';
alter table communications add column if not exists metadata jsonb default '{}'::jsonb;
alter table communications add column if not exists updated_at timestamptz default now();

create index if not exists communications_workspace_idx on communications(workspace_id);
create index if not exists communications_lead_idx on communications(lead_id);
create index if not exists communications_campaign_idx on communications(campaign_id);
create index if not exists communications_channel_idx on communications(channel);
create index if not exists communications_status_idx on communications(status);
create index if not exists communications_created_idx on communications(created_at desc);

create table if not exists crm_tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid,
  lead_id uuid,
  title text not null,
  details text,
  status text default 'open',
  assigned_to text,
  due_date timestamptz,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid,
  lead_id uuid,
  title text not null,
  status text default 'open',
  assigned_to text,
  due_date timestamptz,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists crm_tasks_workspace_idx on crm_tasks(workspace_id);
create index if not exists crm_tasks_status_idx on crm_tasks(status);
create index if not exists tasks_workspace_idx on tasks(workspace_id);
create index if not exists tasks_status_idx on tasks(status);

create table if not exists crm_settings (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid,
  business_name text,
  industry text,
  website text,
  contact_email text,
  phone text,
  default_sender_name text,
  default_sender_email text,
  timezone text default 'America/Chicago',
  brand_voice text,
  tone text default 'professional',
  cta_style text,
  audience_description text,
  automation_level text default 'review_required',
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists crm_settings_workspace_idx on crm_settings(workspace_id);

create table if not exists crm_ai_recommendations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid,
  type text,
  title text not null,
  description text,
  action text,
  status text default 'open',
  confidence numeric,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists crm_ai_recommendations_workspace_idx on crm_ai_recommendations(workspace_id);
create index if not exists crm_ai_recommendations_status_idx on crm_ai_recommendations(status);

create table if not exists crm_agent_runs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid,
  agent text not null,
  status text default 'completed',
  summary jsonb default '{}'::jsonb,
  recommendations jsonb default '[]'::jsonb,
  actions jsonb default '[]'::jsonb,
  confidence numeric,
  data_used jsonb default '{}'::jsonb,
  provider text,
  model text,
  fallback_used boolean default false,
  provider_errors jsonb default '[]'::jsonb,
  error text,
  created_at timestamptz default now()
);

alter table crm_agent_runs add column if not exists provider text;
alter table crm_agent_runs add column if not exists model text;
alter table crm_agent_runs add column if not exists fallback_used boolean default false;
alter table crm_agent_runs add column if not exists provider_errors jsonb default '[]'::jsonb;

create index if not exists crm_agent_runs_workspace_idx on crm_agent_runs(workspace_id);
create index if not exists crm_agent_runs_agent_idx on crm_agent_runs(agent);
create index if not exists crm_agent_runs_created_idx on crm_agent_runs(created_at desc);

create table if not exists ai_decisions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid,
  decision_type text,
  reasoning text,
  confidence numeric,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists ai_decisions_workspace_idx on ai_decisions(workspace_id);

create table if not exists marketing_events (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid,
  type text,
  message text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  action text,
  details text,
  campaign_id uuid
);

alter table marketing_events add column if not exists workspace_id uuid;
alter table marketing_events add column if not exists type text;
alter table marketing_events add column if not exists event_type text;
alter table marketing_events add column if not exists source text;
alter table marketing_events add column if not exists title text;
alter table marketing_events add column if not exists description text;
alter table marketing_events add column if not exists message text;
alter table marketing_events add column if not exists metadata jsonb default '{}'::jsonb;
alter table marketing_events add column if not exists action text;
alter table marketing_events add column if not exists details text;
alter table marketing_events add column if not exists campaign_id uuid;

alter table marketing_events alter column workspace_id drop not null;

create index if not exists marketing_events_workspace_idx on marketing_events(workspace_id);
create index if not exists marketing_events_campaign_idx on marketing_events(campaign_id);
create index if not exists marketing_events_created_idx on marketing_events(created_at desc);
create index if not exists marketing_events_action_idx on marketing_events(action);

create table if not exists marketing_campaigns (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid,
  name text,
  type text,
  status text default 'scheduled',
  created_at timestamptz default now(),
  delivered_count integer default 0,
  opened_count integer default 0,
  clicked_count integer default 0,
  converted_count integer default 0,
  ai_generated boolean default false,
  campaign_mode text,
  attachments jsonb default '[]'::jsonb,
  send_date timestamptz,
  send_time timestamptz,
  audience text,
  stagger integer default 50,
  subject text,
  content text
);

alter table marketing_campaigns add column if not exists workspace_id uuid;
alter table marketing_campaigns add column if not exists name text;
alter table marketing_campaigns add column if not exists type text;
alter table marketing_campaigns add column if not exists status text default 'scheduled';
alter table marketing_campaigns add column if not exists delivered_count integer default 0;
alter table marketing_campaigns add column if not exists opened_count integer default 0;
alter table marketing_campaigns add column if not exists clicked_count integer default 0;
alter table marketing_campaigns add column if not exists converted_count integer default 0;
alter table marketing_campaigns add column if not exists ai_generated boolean default false;
alter table marketing_campaigns add column if not exists campaign_mode text;
alter table marketing_campaigns add column if not exists attachments jsonb default '[]'::jsonb;
alter table marketing_campaigns add column if not exists send_date timestamptz;
alter table marketing_campaigns add column if not exists send_time timestamptz;
alter table marketing_campaigns add column if not exists audience text;
alter table marketing_campaigns add column if not exists stagger integer default 50;
alter table marketing_campaigns add column if not exists subject text;
alter table marketing_campaigns add column if not exists content text;
alter table marketing_campaigns add column if not exists ai_recommendations jsonb default '[]'::jsonb;

alter table marketing_campaigns alter column workspace_id drop not null;
alter table marketing_campaigns alter column name drop not null;

do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_name = 'marketing_campaigns'
      and column_name = 'campaign_type'
  ) then
    execute 'alter table marketing_campaigns alter column campaign_type drop not null';
  end if;
end $$;

create index if not exists marketing_campaigns_workspace_idx on marketing_campaigns(workspace_id);
create index if not exists marketing_campaigns_status_idx on marketing_campaigns(status);
create index if not exists marketing_campaigns_created_idx on marketing_campaigns(created_at desc);

create table if not exists marketing_ai_recommendations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid,
  recommendation_type text,
  priority text default 'medium',
  title text not null,
  description text not null,
  accepted boolean default false,
  dismissed boolean default false,
  ai_provider text,
  estimated_impact text,
  created_at timestamptz default now()
);

create index if not exists marketing_ai_recommendations_workspace_idx on marketing_ai_recommendations(workspace_id);
create index if not exists marketing_ai_recommendations_created_idx on marketing_ai_recommendations(created_at desc);

create table if not exists marketing_media (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid,
  name text,
  type text,
  url text,
  size bigint default 0,
  created_at timestamptz default now()
);

create index if not exists marketing_media_workspace_idx on marketing_media(workspace_id);

create table if not exists marketing_tracking_events (
  id uuid primary key default gen_random_uuid(),
  campaign_id uuid,
  lead_id uuid,
  event_type text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists marketing_tracking_campaign_idx on marketing_tracking_events(campaign_id);
create index if not exists marketing_tracking_lead_idx on marketing_tracking_events(lead_id);
create index if not exists marketing_tracking_event_idx on marketing_tracking_events(event_type);
create index if not exists marketing_tracking_created_idx on marketing_tracking_events(created_at desc);

create table if not exists marketing_interactions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid,
  campaign_id uuid,
  lead_id uuid,
  interaction_type text,
  message text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists marketing_interactions_campaign_idx on marketing_interactions(campaign_id);
create index if not exists marketing_interactions_lead_idx on marketing_interactions(lead_id);

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists leads_updated_at on leads;
create trigger leads_updated_at before update on leads
for each row execute function update_updated_at_column();

drop trigger if exists communications_updated_at on communications;
create trigger communications_updated_at before update on communications
for each row execute function update_updated_at_column();

drop trigger if exists crm_settings_updated_at on crm_settings;
create trigger crm_settings_updated_at before update on crm_settings
for each row execute function update_updated_at_column();

drop trigger if exists crm_tasks_updated_at on crm_tasks;
create trigger crm_tasks_updated_at before update on crm_tasks
for each row execute function update_updated_at_column();

-- Storage setup:
-- Run this if the project has Supabase Storage enabled and the bucket does not exist:
-- insert into storage.buckets (id, name, public)
-- values ('marketing-media', 'marketing-media', true)
-- on conflict do nothing;

-- RLS note:
-- This app currently performs privileged CRM writes through server-side API routes
-- using SUPABASE_SERVICE_ROLE_KEY. Add authenticated RLS policies once workspace
-- membership enforcement is centralized across all CRM API routes.
