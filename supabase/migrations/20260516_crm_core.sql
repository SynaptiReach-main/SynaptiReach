create extension if not exists "pgcrypto";

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
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

alter table leads add column if not exists company text;
alter table leads add column if not exists last_interaction timestamptz;
alter table leads add column if not exists archived boolean default false;
alter table leads add column if not exists metadata jsonb default '{}'::jsonb;
alter table leads add column if not exists updated_at timestamptz default now();

create index if not exists leads_workspace_idx on leads(workspace_id);
create index if not exists leads_status_idx on leads(status);
create index if not exists leads_email_idx on leads(email);
create index if not exists leads_created_idx on leads(created_at);

create table if not exists lead_activities (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  lead_id uuid references leads(id) on delete cascade,
  type text default 'note',
  title text,
  details text,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists lead_activities_lead_idx on lead_activities(lead_id);
create index if not exists lead_activities_workspace_idx on lead_activities(workspace_id);

create table if not exists communications (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  lead_id uuid references leads(id) on delete set null,
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

alter table communications add column if not exists campaign_id uuid;
alter table communications add column if not exists recipient text;
alter table communications add column if not exists subject text;
alter table communications add column if not exists status text default 'draft';
alter table communications add column if not exists metadata jsonb default '{}'::jsonb;
alter table communications add column if not exists updated_at timestamptz default now();

create index if not exists communications_workspace_idx on communications(workspace_id);
create index if not exists communications_lead_idx on communications(lead_id);
create index if not exists communications_channel_idx on communications(channel);
create index if not exists communications_status_idx on communications(status);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  lead_id uuid references leads(id) on delete set null,
  title text not null,
  status text default 'open',
  assigned_to text,
  due_date timestamptz,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists tasks_workspace_idx on tasks(workspace_id);
create index if not exists tasks_status_idx on tasks(status);

create table if not exists ai_decisions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  decision_type text,
  reasoning text,
  confidence numeric,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz default now()
);

create index if not exists ai_decisions_workspace_idx on ai_decisions(workspace_id);

create table if not exists crm_settings (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
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

create table if not exists crm_recommendations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
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

create index if not exists crm_recommendations_workspace_idx on crm_recommendations(workspace_id);
create index if not exists crm_recommendations_status_idx on crm_recommendations(status);

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

alter table marketing_events add column if not exists action text;
alter table marketing_events add column if not exists details text;
alter table marketing_events add column if not exists campaign_id uuid;
alter table marketing_events add column if not exists type text;
alter table marketing_events add column if not exists message text;

alter table marketing_events alter column workspace_id drop not null;

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

alter table marketing_campaigns add column if not exists type text;
alter table marketing_campaigns add column if not exists audience text;
alter table marketing_campaigns add column if not exists subject text;
alter table marketing_campaigns add column if not exists content text;
alter table marketing_campaigns add column if not exists attachments jsonb default '[]'::jsonb;
alter table marketing_campaigns add column if not exists send_date timestamptz;
alter table marketing_campaigns add column if not exists send_time timestamptz;
alter table marketing_campaigns add column if not exists stagger integer default 50;

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

create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists leads_updated_at on leads;
create trigger leads_updated_at
before update on leads
for each row execute function update_updated_at_column();

drop trigger if exists communications_updated_at on communications;
create trigger communications_updated_at
before update on communications
for each row execute function update_updated_at_column();

drop trigger if exists crm_settings_updated_at on crm_settings;
create trigger crm_settings_updated_at
before update on crm_settings
for each row execute function update_updated_at_column();
