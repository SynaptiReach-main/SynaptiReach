-- SynaptiReach User CRM full-completion schema verification.
-- Safe to run multiple times.
--
-- Preferred migration order for existing projects:
-- 1. supabase/user_crm_complete_schema.sql
-- 2. supabase/autonomous_crm_full_features.sql
-- 3. supabase/user_crm_full_completion_schema.sql
--
-- This file is also safe to run independently on a fresh Supabase database:
-- it creates every table it later alters or indexes with CREATE TABLE IF NOT
-- EXISTS before applying additive columns, indexes, and triggers.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Fresh-database bootstrap: create every core table that this migration later
-- alters or indexes. Existing tables and data are preserved.
create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'SynaptiReach Workspace',
  industry text null,
  business_type text null,
  owner_id uuid null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  name text null,
  email text null,
  phone text null,
  company text null,
  source text null,
  status text not null default 'new',
  score integer not null default 0,
  notes text null,
  last_interaction timestamptz null,
  archived boolean not null default false,
  imported boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.lead_activities (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  lead_id uuid null,
  type text not null default 'note',
  title text null,
  details text null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.communications (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  lead_id uuid null,
  campaign_id uuid null,
  channel text not null default 'email',
  direction text not null default 'outbound',
  recipient text null,
  subject text null,
  content text null,
  status text not null default 'draft',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_deals (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  lead_id uuid null,
  deal_id uuid null,
  title text,
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

create table if not exists public.crm_tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  lead_id uuid null,
  deal_id uuid null,
  campaign_id uuid null,
  title text,
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

create table if not exists public.crm_appointments (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  lead_id uuid null,
  deal_id uuid null,
  title text,
  starts_at timestamptz,
  ends_at timestamptz null,
  status text not null default 'scheduled',
  location text null,
  notes text null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_workflows (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  name text,
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

create table if not exists public.crm_ai_recommendations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  type text null,
  title text,
  description text null,
  action text null,
  status text not null default 'open',
  confidence numeric null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_agent_runs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  agent text,
  status text not null default 'completed',
  summary jsonb not null default '{}'::jsonb,
  recommendations jsonb not null default '[]'::jsonb,
  actions jsonb not null default '[]'::jsonb,
  confidence numeric null,
  data_used jsonb not null default '{}'::jsonb,
  provider text null,
  model text null,
  fallback_used boolean not null default false,
  provider_errors jsonb not null default '[]'::jsonb,
  error text null,
  created_at timestamptz not null default now()
);

create table if not exists public.crm_settings (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  business_name text null,
  industry text null,
  website text null,
  contact_email text null,
  phone text null,
  default_sender_name text null,
  default_sender_email text null,
  timezone text not null default 'America/Chicago',
  brand_voice text null,
  tone text not null default 'professional',
  cta_style text null,
  audience_description text null,
  automation_level text not null default 'review_required',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.marketing_campaigns (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  name text null,
  type text null,
  status text not null default 'scheduled',
  created_at timestamptz not null default now(),
  delivered_count integer not null default 0,
  opened_count integer not null default 0,
  clicked_count integer not null default 0,
  converted_count integer not null default 0,
  ai_generated boolean not null default false,
  campaign_mode text null,
  attachments jsonb not null default '[]'::jsonb,
  send_date timestamptz null,
  send_time timestamptz null,
  audience text null,
  stagger integer not null default 50,
  subject text null,
  content text null
);

create table if not exists public.marketing_events (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  type text null,
  message text null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  action text null,
  details text null,
  campaign_id uuid null
);

create table if not exists public.marketing_interactions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  campaign_id uuid null,
  lead_id uuid null,
  interaction_type text null,
  message text null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

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

-- Workspace/company/user scoping columns for existing CRM tables.
alter table if exists public.workspaces add column if not exists company_id uuid null;
alter table if exists public.workspaces add column if not exists owner_id uuid null;
alter table if exists public.workspaces add column if not exists plan_tier text null;
alter table if exists public.workspaces add column if not exists billing_mode text null;
alter table if exists public.workspaces add column if not exists trial_started_at timestamptz null;
alter table if exists public.workspaces add column if not exists trial_ends_at timestamptz null;
alter table if exists public.workspaces add column if not exists usage_caps jsonb not null default '{}'::jsonb;

alter table if exists public.leads add column if not exists user_id uuid null;
alter table if exists public.leads add column if not exists company_id uuid null;
alter table if exists public.leads add column if not exists tags text[] not null default '{}'::text[];
alter table if exists public.leads add column if not exists address text null;
alter table if exists public.leads add column if not exists city text null;
alter table if exists public.leads add column if not exists state text null;
alter table if exists public.leads add column if not exists zip text null;
alter table if exists public.leads add column if not exists website text null;
alter table if exists public.leads add column if not exists ai_score_explanation text null;

alter table if exists public.lead_activities add column if not exists user_id uuid null;
alter table if exists public.lead_activities add column if not exists company_id uuid null;
alter table if exists public.communications add column if not exists user_id uuid null;
alter table if exists public.communications add column if not exists company_id uuid null;
alter table if exists public.communications add column if not exists conversation_id uuid null;
alter table if exists public.crm_deals add column if not exists user_id uuid null;
alter table if exists public.crm_deals add column if not exists company_id uuid null;
alter table if exists public.crm_tasks add column if not exists user_id uuid null;
alter table if exists public.crm_tasks add column if not exists company_id uuid null;
alter table if exists public.crm_tasks add column if not exists assigned_staff_id uuid null;
alter table if exists public.crm_appointments add column if not exists user_id uuid null;
alter table if exists public.crm_appointments add column if not exists company_id uuid null;
alter table if exists public.crm_workflows add column if not exists user_id uuid null;
alter table if exists public.crm_workflows add column if not exists company_id uuid null;
alter table if exists public.crm_workflow_runs add column if not exists user_id uuid null;
alter table if exists public.crm_workflow_runs add column if not exists company_id uuid null;
alter table if exists public.crm_ai_recommendations add column if not exists user_id uuid null;
alter table if exists public.crm_ai_recommendations add column if not exists company_id uuid null;
alter table if exists public.crm_agent_runs add column if not exists user_id uuid null;
alter table if exists public.crm_agent_runs add column if not exists company_id uuid null;
alter table if exists public.crm_settings add column if not exists user_id uuid null;
alter table if exists public.crm_settings add column if not exists company_id uuid null;
alter table if exists public.marketing_campaigns add column if not exists user_id uuid null;
alter table if exists public.marketing_campaigns add column if not exists company_id uuid null;
alter table if exists public.marketing_events add column if not exists user_id uuid null;
alter table if exists public.marketing_events add column if not exists company_id uuid null;
alter table if exists public.marketing_interactions add column if not exists user_id uuid null;
alter table if exists public.marketing_interactions add column if not exists company_id uuid null;
alter table if exists public.contact_submissions add column if not exists user_id uuid null;
alter table if exists public.contact_submissions add column if not exists company_id uuid null;

create table if not exists public.crm_roles (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  company_id uuid null,
  name text not null,
  description text null,
  permissions text[] not null default '{}'::text[],
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_staff (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  company_id uuid null,
  user_id uuid null,
  role_id uuid null,
  name text,
  email text,
  phone text,
  status text not null default 'invited',
  title text null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_staff_permissions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  company_id uuid null,
  staff_id uuid not null,
  permission text not null,
  granted boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.crm_notifications (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  company_id uuid null,
  user_id uuid null,
  title text not null,
  message text,
  type text not null default 'info',
  priority text not null default 'normal',
  status text not null default 'unread',
  record_type text null,
  record_id uuid null,
  href text null,
  metadata jsonb not null default '{}'::jsonb,
  read_at timestamptz null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_conversations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  company_id uuid null,
  user_id uuid null,
  lead_id uuid null,
  campaign_id uuid null,
  subject text,
  channel text not null default 'email',
  status text not null default 'open',
  latest_message_preview text null,
  latest_message_at timestamptz null,
  unread_count integer not null default 0,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_messages (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  company_id uuid null,
  user_id uuid null,
  conversation_id uuid null,
  lead_id uuid null,
  campaign_id uuid null,
  channel text not null default 'email',
  direction text not null default 'outbound',
  subject text null,
  content text not null default '',
  status text not null default 'draft',
  provider_message_id text null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_audit_logs (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  company_id uuid null,
  user_id uuid null,
  actor_staff_id uuid null,
  action text not null,
  resource_type text null,
  resource_id uuid null,
  details text null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.crm_provider_connections (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  company_id uuid null,
  user_id uuid null,
  provider text not null,
  provider_type text not null default 'integration',
  status text not null default 'missing',
  key_label text null,
  encrypted_secret text null,
  last_verified_at timestamptz null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_billing_accounts (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  company_id uuid null,
  user_id uuid null,
  plan_tier text null,
  billing_mode text null,
  status text not null default 'trial',
  stripe_customer_id text null,
  stripe_subscription_id text null,
  payment_method_reference text null,
  trial_started_at timestamptz null,
  trial_ends_at timestamptz null,
  commitment_months integer null,
  commitment_discount_percent integer null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_usage_events (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  company_id uuid null,
  user_id uuid null,
  usage_type text not null,
  quantity integer not null default 1,
  source text null,
  resource_type text null,
  resource_id uuid null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.crm_credit_pack_purchases (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  company_id uuid null,
  user_id uuid null,
  pack_type text not null,
  quantity integer not null default 1,
  price_cents integer null,
  status text not null default 'review_required',
  checkout_reference text null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.crm_billing_events (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  company_id uuid null,
  user_id uuid null,
  stripe_event_id text not null,
  event_type text not null,
  status text not null default 'received',
  resource_type text null,
  resource_id text null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.crm_csv_imports (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid null,
  company_id uuid null,
  user_id uuid null,
  source text not null default 'leads_csv',
  file_name text null,
  total_rows integer not null default 0,
  valid_rows integer not null default 0,
  imported_rows integer not null default 0,
  skipped_rows integer not null default 0,
  duplicate_rows integer not null default 0,
  errors jsonb not null default '[]'::jsonb,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Helpful indexes for dashboard and module queries.
create index if not exists idx_workspaces_owner on public.workspaces(owner_id);
create index if not exists idx_workspaces_company on public.workspaces(company_id);
create index if not exists idx_leads_workspace_status_created on public.leads(workspace_id, status, created_at desc);
create index if not exists idx_leads_company_created on public.leads(company_id, created_at desc);
create index if not exists idx_leads_user_created on public.leads(user_id, created_at desc);
create index if not exists idx_leads_tags on public.leads using gin(tags);
create index if not exists idx_lead_activities_workspace_lead_created on public.lead_activities(workspace_id, lead_id, created_at desc);
create index if not exists idx_communications_conversation on public.communications(conversation_id);
create index if not exists idx_communications_workspace_lead_created on public.communications(workspace_id, lead_id, created_at desc);
create index if not exists idx_crm_deals_workspace_stage on public.crm_deals(workspace_id, stage);
create index if not exists idx_crm_tasks_assigned_staff on public.crm_tasks(assigned_staff_id);
create index if not exists idx_crm_tasks_workspace_due_status on public.crm_tasks(workspace_id, due_date, status);
create index if not exists idx_crm_appointments_workspace_status_starts on public.crm_appointments(workspace_id, status, starts_at);
create index if not exists idx_crm_workflows_workspace_status on public.crm_workflows(workspace_id, status);
create index if not exists idx_crm_workflow_runs_workspace_status_started on public.crm_workflow_runs(workspace_id, status, started_at desc);
create index if not exists idx_crm_notifications_workspace_status_created on public.crm_notifications(workspace_id, status, created_at desc);
create index if not exists idx_crm_notifications_user_status_created on public.crm_notifications(user_id, status, created_at desc);
create index if not exists idx_crm_conversations_workspace_latest on public.crm_conversations(workspace_id, latest_message_at desc);
create index if not exists idx_crm_conversations_lead on public.crm_conversations(lead_id);
create index if not exists idx_crm_messages_conversation_created on public.crm_messages(conversation_id, created_at);
create index if not exists idx_crm_messages_workspace_created on public.crm_messages(workspace_id, created_at desc);
create index if not exists idx_crm_staff_workspace_status on public.crm_staff(workspace_id, status);
create index if not exists idx_crm_staff_permissions_staff on public.crm_staff_permissions(staff_id);
create index if not exists idx_crm_roles_workspace on public.crm_roles(workspace_id);
create index if not exists idx_crm_audit_logs_workspace_created on public.crm_audit_logs(workspace_id, created_at desc);
create index if not exists idx_crm_provider_connections_workspace_provider on public.crm_provider_connections(workspace_id, provider);
create index if not exists idx_crm_billing_accounts_workspace on public.crm_billing_accounts(workspace_id);
create index if not exists idx_crm_usage_events_workspace_type_created on public.crm_usage_events(workspace_id, usage_type, created_at desc);
create index if not exists idx_crm_credit_pack_purchases_workspace_status on public.crm_credit_pack_purchases(workspace_id, status);
create unique index if not exists idx_crm_billing_events_stripe_event_id on public.crm_billing_events(stripe_event_id);
create index if not exists idx_crm_billing_events_workspace_created on public.crm_billing_events(workspace_id, created_at desc);
create index if not exists idx_crm_csv_imports_workspace_created on public.crm_csv_imports(workspace_id, created_at desc);
create index if not exists idx_marketing_campaigns_workspace_status_created on public.marketing_campaigns(workspace_id, status, created_at desc);
create index if not exists idx_marketing_events_workspace_created on public.marketing_events(workspace_id, created_at desc);
create index if not exists idx_marketing_interactions_workspace_created on public.marketing_interactions(workspace_id, created_at desc);
create index if not exists idx_contact_submissions_workspace_created on public.contact_submissions(workspace_id, created_at desc);

-- Updated-at triggers for new mutable tables.
drop trigger if exists set_crm_roles_updated_at on public.crm_roles;
create trigger set_crm_roles_updated_at before update on public.crm_roles
for each row execute function public.set_updated_at();

drop trigger if exists set_crm_staff_updated_at on public.crm_staff;
create trigger set_crm_staff_updated_at before update on public.crm_staff
for each row execute function public.set_updated_at();

drop trigger if exists set_crm_notifications_updated_at on public.crm_notifications;
create trigger set_crm_notifications_updated_at before update on public.crm_notifications
for each row execute function public.set_updated_at();

drop trigger if exists set_crm_conversations_updated_at on public.crm_conversations;
create trigger set_crm_conversations_updated_at before update on public.crm_conversations
for each row execute function public.set_updated_at();

drop trigger if exists set_crm_messages_updated_at on public.crm_messages;
create trigger set_crm_messages_updated_at before update on public.crm_messages
for each row execute function public.set_updated_at();

drop trigger if exists set_crm_provider_connections_updated_at on public.crm_provider_connections;
create trigger set_crm_provider_connections_updated_at before update on public.crm_provider_connections
for each row execute function public.set_updated_at();

drop trigger if exists set_crm_billing_accounts_updated_at on public.crm_billing_accounts;
create trigger set_crm_billing_accounts_updated_at before update on public.crm_billing_accounts
for each row execute function public.set_updated_at();

drop trigger if exists set_crm_credit_pack_purchases_updated_at on public.crm_credit_pack_purchases;
create trigger set_crm_credit_pack_purchases_updated_at before update on public.crm_credit_pack_purchases
for each row execute function public.set_updated_at();

-- RLS/auth note:
-- The current application uses server-side Next.js API routes with service role
-- credentials for privileged CRM operations. Before direct client table access,
-- enable RLS and add policies that check final workspace membership, staff role,
-- and permission records. Do not authorize from user-editable metadata claims.
