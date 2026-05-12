-- MARKETING MEDIA BUCKET
insert into storage.buckets (id, name, public)
values ('marketing-media', 'marketing-media', true)
on conflict (id) do nothing;

-- PUBLIC READ ACCESS
create policy "Public marketing media access"
on storage.objects
for select
using (bucket_id = 'marketing-media');

-- AUTH UPLOADS
create policy "Authenticated marketing uploads"
on storage.objects
for insert
to authenticated
with check (bucket_id = 'marketing-media');

-- AUTH UPDATES
create policy "Authenticated marketing updates"
on storage.objects
for update
to authenticated
using (bucket_id = 'marketing-media');

-- AUTH DELETES
create policy "Authenticated marketing deletes"
on storage.objects
for delete
to authenticated
using (bucket_id = 'marketing-media');
