create extension if not exists "pgcrypto";

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid,
  name text,
  email text,
  phone text,
  status text default 'new',
  score integer default 0,
  source text,
  notes text,
  created_at timestamptz default now()
);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid,
  title text,
  status text default 'open',
  assigned_to text,
  due_date timestamptz,
  created_at timestamptz default now()
);

create table if not exists pipelines (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid,
  stage text,
  probability numeric default 0,
  value numeric default 0,
  lead_id uuid,
  created_at timestamptz default now()
);

create table if not exists automations (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid,
  name text,
  trigger_event text,
  action_type text,
  enabled boolean default true,
  created_at timestamptz default now()
);

create table if not exists ai_decisions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid,
  decision_type text,
  reasoning text,
  confidence numeric,
  created_at timestamptz default now()
);

create table if not exists communications (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid,
  lead_id uuid,
  channel text,
  direction text,
  content text,
  created_at timestamptz default now()
);
