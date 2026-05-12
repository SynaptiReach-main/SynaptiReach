alter table workspaces

add column if not exists owner_id uuid,
add column if not exists name text,
add column if not exists industry text,

add column if not exists onboarding_data jsonb default '{}'::jsonb,

add column if not exists intelligence jsonb default '{}'::jsonb,

add column if not exists gemini_analysis text,

add column if not exists monthly_revenue numeric default 0,

add column if not exists yearly_revenue numeric default 0,

add column if not exists customer_ltv numeric default 0,

add column if not exists roi_target text default '0',

add column if not exists uploaded_knowledge_count integer default 0,

add column if not exists csv_imported boolean default false,

add column if not exists integrations jsonb default '[]'::jsonb;
