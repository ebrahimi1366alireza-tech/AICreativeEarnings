insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'portfolio-assets',
  'portfolio-assets',
  false,
  1572864,
  array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Portfolio owners read their assets" on storage.objects;
create policy "Portfolio owners read their assets"
on storage.objects for select to authenticated
using (
  bucket_id = 'portfolio-assets'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Portfolio owners upload their assets" on storage.objects;
create policy "Portfolio owners upload their assets"
on storage.objects for insert to authenticated
with check (
  bucket_id = 'portfolio-assets'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);

drop policy if exists "Portfolio owners delete their assets" on storage.objects;
create policy "Portfolio owners delete their assets"
on storage.objects for delete to authenticated
using (
  bucket_id = 'portfolio-assets'
  and (storage.foldername(name))[1] = (select auth.uid())::text
);
