create index if not exists verification_handoffs_device_id_idx
  on public.verification_handoffs(device_id);

drop policy if exists "Users manage their verification device" on public.verification_devices;
create policy "Users manage their verification device"
  on public.verification_devices for all to authenticated
  using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

drop policy if exists "Users read their verification handoffs" on public.verification_handoffs;
create policy "Users read their verification handoffs"
  on public.verification_handoffs for select to authenticated
  using ((select auth.uid()) = owner_id);

drop policy if exists "Users complete their verification handoffs" on public.verification_handoffs;
create policy "Users complete their verification handoffs"
  on public.verification_handoffs for update to authenticated
  using ((select auth.uid()) = owner_id and status = 'pending')
  with check ((select auth.uid()) = owner_id and status = 'completed');