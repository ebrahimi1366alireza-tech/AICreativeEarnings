-- Harden the daily credit RPCs and make the ownership link explicit.
alter function public.reserve_creative_credits(uuid, integer, integer) security invoker;
alter function public.release_creative_credits(uuid, integer) security invoker;
alter function public.get_creative_usage(uuid, integer) security invoker;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'creative_daily_usage_user_id_fkey'
      and conrelid = 'public.creative_daily_usage'::regclass
  ) then
    alter table public.creative_daily_usage
      add constraint creative_daily_usage_user_id_fkey
      foreign key (user_id) references auth.users(id) on delete cascade;
  end if;
end;
$$;

revoke all on function public.reserve_creative_credits(uuid, integer, integer) from public, anon, authenticated;
revoke all on function public.release_creative_credits(uuid, integer) from public, anon, authenticated;
revoke all on function public.get_creative_usage(uuid, integer) from public, anon, authenticated;
grant execute on function public.reserve_creative_credits(uuid, integer, integer) to service_role;
grant execute on function public.release_creative_credits(uuid, integer) to service_role;
grant execute on function public.get_creative_usage(uuid, integer) to service_role;
