-- Per-user creative generation credits (UTC daily window).
-- Only the server's Supabase service-role credential may execute these RPCs.
create table if not exists public.creative_daily_usage (
  user_id uuid not null,
  usage_date date not null,
  credits_used integer not null default 0 check (credits_used >= 0),
  updated_at timestamptz not null default now(),
  primary key (user_id, usage_date)
);

alter table public.creative_daily_usage enable row level security;
revoke all on table public.creative_daily_usage from anon, authenticated;
grant all on table public.creative_daily_usage to service_role;

create or replace function public.reserve_creative_credits(
  p_user_id uuid,
  p_units integer,
  p_daily_limit integer
) returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_used integer;
  v_today date := (now() at time zone 'utc')::date;
begin
  if p_units < 1 or p_units > 20 or p_daily_limit < 1 or p_daily_limit > 10000 then
    raise exception 'invalid credit request';
  end if;

  insert into public.creative_daily_usage(user_id, usage_date, credits_used)
  values (p_user_id, v_today, 0)
  on conflict (user_id, usage_date) do nothing;

  update public.creative_daily_usage
  set credits_used = credits_used + p_units, updated_at = now()
  where user_id = p_user_id
    and usage_date = v_today
    and credits_used + p_units <= p_daily_limit
  returning credits_used into v_used;

  if not found then
    select credits_used into v_used
    from public.creative_daily_usage
    where user_id = p_user_id and usage_date = v_today;
    return jsonb_build_object('allowed', false, 'used', coalesce(v_used, 0), 'remaining', greatest(0, p_daily_limit - coalesce(v_used, 0)), 'limit', p_daily_limit);
  end if;

  return jsonb_build_object('allowed', true, 'used', v_used, 'remaining', greatest(0, p_daily_limit - v_used), 'limit', p_daily_limit);
end;
$$;

create or replace function public.release_creative_credits(
  p_user_id uuid,
  p_units integer
) returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_used integer;
  v_today date := (now() at time zone 'utc')::date;
begin
  if p_units < 1 or p_units > 20 then
    raise exception 'invalid credit release';
  end if;
  update public.creative_daily_usage
  set credits_used = greatest(0, credits_used - p_units), updated_at = now()
  where user_id = p_user_id and usage_date = v_today
  returning credits_used into v_used;
  return jsonb_build_object('used', coalesce(v_used, 0));
end;
$$;

create or replace function public.get_creative_usage(p_user_id uuid, p_daily_limit integer)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_used integer := 0;
  v_today date := (now() at time zone 'utc')::date;
begin
  select credits_used into v_used
  from public.creative_daily_usage
  where user_id = p_user_id and usage_date = v_today;
  return jsonb_build_object('used', coalesce(v_used, 0), 'remaining', greatest(0, p_daily_limit - coalesce(v_used, 0)), 'limit', p_daily_limit, 'resetsAt', (v_today + 1)::text || 'T00:00:00Z');
end;
$$;

revoke all on function public.reserve_creative_credits(uuid, integer, integer) from public, anon, authenticated;
revoke all on function public.release_creative_credits(uuid, integer) from public, anon, authenticated;
revoke all on function public.get_creative_usage(uuid, integer) from public, anon, authenticated;
grant execute on function public.reserve_creative_credits(uuid, integer, integer) to service_role;
grant execute on function public.release_creative_credits(uuid, integer) to service_role;
grant execute on function public.get_creative_usage(uuid, integer) to service_role;
