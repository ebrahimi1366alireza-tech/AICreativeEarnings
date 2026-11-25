-- Explicitly deny direct client-role access; server RPCs run with service_role only.
drop policy if exists "No direct client access to creative usage" on public.creative_daily_usage;
create policy "No direct client access to creative usage"
on public.creative_daily_usage
for all
to anon, authenticated
using (false)
with check (false);
