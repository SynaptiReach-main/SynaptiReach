-- CORE WORKSPACE FIELDS
alter table workspaces add column if not exists name text;
alter table workspaces add column if not exists industry text;
alter table workspaces add column if not exists monthly_revenue numeric default 0;
alter table workspaces add column if not exists yearly_revenue numeric default 0;
alter table workspaces add column if not exists roi_target text;
alter table workspaces add column if not exists integrations jsonb default '[]'::jsonb;

-- ONBOARDING JSON FIELDS (source of truth)
alter table workspaces add column if not exists onboarding_data jsonb default '{}'::jsonb;

-- AI PERSONA + BEHAVIOR
alter table workspaces add column if not exists ai_personality text;
alter table workspaces add column if not exists response_time text;
alter table workspaces add column if not exists services jsonb default '[]'::jsonb;
alter table workspaces add column if not exists peak_months jsonb default '[]'::jsonb;
alter table workspaces add column if not exists slow_months jsonb default '[]'::jsonb;
alter table workspaces add column if not exists products jsonb default '[]'::jsonb;
alter table workspaces add column if not exists promoted_products jsonb default '[]'::jsonb;

-- CRM OPERATIONS
alter table workspaces add column if not exists lead_count integer default 0;
alter table workspaces add column if not exists open_tasks integer default 0;
alter table workspaces add column if not exists response_rate numeric default 0;

-- PIPELINE + DATA INGESTION
alter table workspaces add column if not exists uploaded_knowledge_count integer default 0;
alter table workspaces add column if not exists csv_imported boolean default false;

-- FUTURE AI SYSTEM SUPPORT
alter table workspaces add column if not exists pipeline_state jsonb default '{}'::jsonb;
alter table workspaces add column if not exists automation_state jsonb default '{}'::jsonb;
alter table workspaces add column if not exists ai_ceo_state jsonb default '{}'::jsonb;
