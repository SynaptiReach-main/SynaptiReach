create extension if not exists "pgcrypto";

create table if not exists workspaces (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  industry text,
  business_type text,
  owner_id uuid references auth.users(id) on delete cascade,
  created_at timestamptz default now()
);

create table if not exists workspace_members (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  role text default 'member',
  created_at timestamptz default now()
);

create table if not exists onboarding_sessions (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  payload jsonb,
  completed boolean default false,
  created_at timestamptz default now()
);

create table if not exists pipelines (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  name text not null,
  created_at timestamptz default now()
);

create table if not exists deals (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  contact_id text,
  pipeline_id uuid references pipelines(id) on delete set null,
  title text,
  value numeric default 0,
  status text default 'open',
  created_at timestamptz default now()
);

create table if not exists ai_agents (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  name text not null,
  provider text,
  mode text,
  configuration jsonb,
  created_at timestamptz default now()
);

create table if not exists workflows (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid references workspaces(id) on delete cascade,
  name text not null,
  trigger_type text,
  enabled boolean default true,
  configuration jsonb,
  created_at timestamptz default now()
);
