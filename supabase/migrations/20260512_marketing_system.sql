-- =====================================================
-- SYNAPTIREACH MARKETING SYSTEM
-- =====================================================

-- CAMPAIGNS
create table if not exists marketing_campaigns (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null,
  created_by uuid,

  name text not null,
  campaign_type text not null, -- email, sms, social
  campaign_mode text not null default 'single', -- single, sequence

  status text not null default 'draft',
  objective text,

  target_segment text default 'all',

  stagger_count integer default 50,
  stagger_interval_minutes integer default 5,

  scheduled_at timestamptz,
  launched_at timestamptz,
  completed_at timestamptz,

  ai_generated boolean default false,
  ai_provider text,
  ai_credits_used integer default 0,

  total_recipients integer default 0,
  delivered_count integer default 0,
  opened_count integer default 0,
  clicked_count integer default 0,
  replied_count integer default 0,
  converted_count integer default 0,

  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- CAMPAIGN STEPS
create table if not exists marketing_campaign_steps (
  id uuid primary key default gen_random_uuid(),

  campaign_id uuid references marketing_campaigns(id) on delete cascade,

  step_order integer not null default 1,

  channel text not null, -- email, sms, social

  subject text,
  body text,

  media_urls text[] default '{}',

  scheduled_at timestamptz,

  stagger_count integer default 50,
  stagger_interval_minutes integer default 5,

  status text default 'draft',

  ai_generated boolean default false,

  created_at timestamptz default now()
);

-- CAMPAIGN RECIPIENTS
create table if not exists marketing_campaign_recipients (
  id uuid primary key default gen_random_uuid(),

  campaign_id uuid references marketing_campaigns(id) on delete cascade,
  lead_id uuid,

  email text,
  phone text,

  delivery_status text default 'pending',
  opened boolean default false,
  clicked boolean default false,
  replied boolean default false,
  converted boolean default false,

  created_at timestamptz default now()
);

-- MARKETING EVENTS
create table if not exists marketing_events (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null,

  event_type text not null,
  source text,

  title text not null,
  description text,

  metadata jsonb default '{}',

  created_at timestamptz default now()
);

-- AI RECOMMENDATIONS
create table if not exists marketing_ai_recommendations (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null,

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

-- SOCIAL POSTS
create table if not exists social_posts (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null,

  campaign_id uuid references marketing_campaigns(id) on delete set null,

  platform text not null, -- facebook, instagram, both

  post_type text not null, -- post, ad

  content text,

  media_urls text[] default '{}',

  status text default 'draft',

  scheduled_at timestamptz,
  published_at timestamptz,

  ayrshare_post_id text,

  created_at timestamptz default now()
);

-- EMAIL ACCOUNTS
create table if not exists marketing_email_accounts (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null,

  provider text default 'resend',

  sender_name text,
  sender_email text,

  api_key_encrypted text,

  shared_account boolean default true,

  created_at timestamptz default now()
);

-- SMS ACCOUNTS
create table if not exists marketing_sms_accounts (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null,

  provider text default 'twilio',

  account_sid text,
  auth_token_encrypted text,
  phone_number text,

  shared_account boolean default true,

  created_at timestamptz default now()
);

-- SOCIAL ACCOUNTS
create table if not exists marketing_social_accounts (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null,

  provider text default 'ayrshare',

  api_key_encrypted text,

  facebook_connected boolean default false,
  instagram_connected boolean default false,

  created_at timestamptz default now()
);

-- AI SETTINGS
create table if not exists marketing_ai_settings (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid not null,

  provider text default 'gemini',

  api_key_encrypted text,

  use_shared_key boolean default true,

  monthly_credit_limit integer default 10000,
  monthly_credits_used integer default 0,

  created_at timestamptz default now()
);

-- FILE STORAGE
insert into storage.buckets (id, name, public)
values ('marketing-media', 'marketing-media', true)
on conflict do nothing;

-- INDEXES
create index if not exists idx_campaigns_workspace
on marketing_campaigns(workspace_id);

create index if not exists idx_campaign_status
on marketing_campaigns(status);

create index if not exists idx_events_workspace
on marketing_events(workspace_id);

create index if not exists idx_ai_workspace
on marketing_ai_recommendations(workspace_id);

-- UPDATED AT
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_campaigns_updated
on marketing_campaigns;

create trigger trg_campaigns_updated
before update on marketing_campaigns
for each row
execute function update_updated_at_column();


create table if not exists marketing_campaigns (
  id uuid primary key default gen_random_uuid(),

  workspace_id uuid,

  name text,

  channel text,

  status text default 'scheduled',

  audience text,

  subject text,

  content text,

  scheduled_for timestamptz,

  stagger_size integer default 50,

  metadata jsonb default '{}'::jsonb,

  created_at timestamptz default now()
);

create index if not exists marketing_campaigns_workspace_idx
on marketing_campaigns(workspace_id);

create index if not exists marketing_campaigns_status_idx
on marketing_campaigns(status);


create table if not exists marketing_campaign_logs (
  id uuid primary key default gen_random_uuid(),

  campaign_id uuid,

  lead_id uuid,

  status text,

  error text,

  retry_count integer default 0,

  created_at timestamptz default now(),

  updated_at timestamptz default now()
);

create index if not exists marketing_logs_campaign_idx
on marketing_campaign_logs(campaign_id);

create index if not exists marketing_logs_status_idx
on marketing_campaign_logs(status);


create table if not exists marketing_tracking_events (
  id uuid primary key default gen_random_uuid(),

  campaign_id uuid,

  lead_id uuid,

  event_type text,

  metadata jsonb default '{}'::jsonb,

  created_at timestamptz default now()
);

create index if not exists marketing_tracking_campaign_idx
on marketing_tracking_events(campaign_id);

create index if not exists marketing_tracking_event_idx
on marketing_tracking_events(event_type);

