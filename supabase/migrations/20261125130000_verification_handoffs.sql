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

create or replace function public.submit_verification_handoff(
  p_token_hash text,
  p_url text,
  p_kind text,
  p_platform text default 'وب‌سایت'
) returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  v_device public.verification_devices%rowtype;
  v_host text;
  v_id uuid;
  v_pending integer;
begin
  if p_token_hash is null or p_token_hash !~ '^[0-9a-f]{64}$' then raise exception 'invalid pairing token'; end if;
  if p_url is null or char_length(p_url) > 2048 or p_url !~* '^https://' then raise exception 'only HTTPS URLs are accepted'; end if;
  v_host := lower(split_part(split_part(p_url, '/', 3), ':', 1));
  if v_host = '' or v_host = 'localhost' or v_host like '%.local' or v_host like '%.internal'
     or v_host ~ '^[0-9.]+$' or v_host ~ '^[0-9a-f:]+$'
     or v_host like '127.%' or v_host like '10.%' or v_host like '192.168.%'
     or v_host like '169.254.%' or v_host like '172.1%' or v_host like '172.2%' or v_host like '172.3%' then
    raise exception 'unsafe verification host';
  end if;
  if p_kind not in ('email_code','human_verification','identity_check','unknown') then raise exception 'invalid verification kind'; end if;
  select * into v_device from public.verification_devices
    where token_hash = p_token_hash and revoked_at is null and updated_at > now() - interval '180 days';
  if not found then raise exception 'pairing token not found or revoked'; end if;
  select count(*) into v_pending from public.verification_handoffs
    where owner_id = v_device.owner_id and status = 'pending' and expires_at > now();
  if v_pending >= 3 then raise exception 'too many pending verification requests'; end if;
  insert into public.verification_handoffs(owner_id, device_id, platform, kind, url)
    values (v_device.owner_id, v_device.id, left(coalesce(nullif(trim(p_platform),''),'وب‌سایت'),80), p_kind, p_url)
    returning id into v_id;
  return jsonb_build_object('accepted', true, 'request_id', v_id, 'expires_in_seconds', 900);
end;
$$;

revoke all on function public.submit_verification_handoff(text,text,text,text) from public;
grant execute on function public.submit_verification_handoff(text,text,text,text) to anon, authenticated;
