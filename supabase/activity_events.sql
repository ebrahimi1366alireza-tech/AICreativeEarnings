-- AI Creative Earnings: private activity log
-- Run this once in Supabase SQL Editor.
create table if not exists public.activity_events (
  id uuid primary key default gen_random_uuid(),
  actor text not null check (actor in ('assistant', 'user', 'system')),
  category text not null default 'general',
  title text not null,
  detail text,
  status text not null default 'completed' check (status in ('running', 'completed', 'needs_action', 'failed')),
  requires_user_action boolean not null default false,
  action_label text,
  action_url text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists activity_events_created_at_idx
  on public.activity_events (created_at desc);

alter table public.activity_events enable row level security;

-- No anon/authenticated policies are intentionally created.
-- Only the server-side service-role key can access this table.
