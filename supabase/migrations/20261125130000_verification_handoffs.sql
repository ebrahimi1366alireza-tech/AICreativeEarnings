create table if not exists public.verification_devices (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null unique references auth.users(id) on delete cascade,
  token_hash text not null unique check (token_hash ~ '^[0-9a-f]{64}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  revoked_at timestamptz
);

create table if not exists public.verification_handoffs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  device_id uuid not null references public.verification_devices(id) on delete cascade,
  platform text not null default 'وب‌سایت',
  kind text not null check (kind in ('email_code','human_verification','identity_check','unknown')),
  url text not null check (char_length(url) <= 2048 and url ~* '^https://'),
  status text not null default 'pending' check (status in ('pending','completed','expired')),
  created_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '15 minutes'),
  completed_at timestamptz
);

create index if not exists verification_handoffs_owner_pending_idx
  on public.verification_handoffs(owner_id, status, created_at);

alter table public.verification_devices enable row level security;
alter table public.verification_handoffs enable row level security;

drop policy if exists "Users manage their verification device" on public.verification_devices;
create policy "Users manage their verification device"
  on public.verification_devices for all to authenticated
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

drop policy if exists "Users read their verification handoffs" on public.verification_handoffs;
create policy "Users read their verification handoffs"
  on public.verification_handoffs for select to authenticated
  using (auth.uid() = owner_id);

drop policy if exists "Users complete their verification handoffs" on public.verification_handoffs;
create policy "Users complete their verification handoffs"
  on public.verification_handoffs for update to authenticated
  using (auth.uid() = owner_id and status = 'pending')
  with check (auth.uid() = owner_id and status = 'completed');

grant select, insert, update, delete on public.verification_devices to authenticated;
grant select, update on public.verification_handoffs to authenticated;

grant select, insert, update, delete on public.verification_devices to service_role;
grant select, insert, update, delete on public.verification_handoffs to service_role;
