-- شغّل هذا الملف في Supabase > SQL Editor
create table profiles (
  id uuid primary key references auth.users on delete cascade,
  username text unique not null,
  avatar_url text,
  created_at timestamptz default now()
);
create table videos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  video_url text not null,
  caption text,
  created_at timestamptz default now()
);
create table likes (
  user_id uuid references profiles(id) on delete cascade,
  video_id uuid references videos(id) on delete cascade,
  primary key (user_id, video_id)
);
create table follows (
  follower_id uuid references profiles(id) on delete cascade,
  following_id uuid references profiles(id) on delete cascade,
  primary key (follower_id, following_id)
);
create table saved_links (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  url text not null,
  created_at timestamptz default now()
);

-- إنشاء ملف المستخدم تلقائيًا عند التسجيل
create function handle_new_user() returns trigger language plpgsql security definer as $$
begin
  insert into profiles (id, username)
  values (new.id, coalesce(new.raw_user_meta_data->>'username', split_part(new.email,'@',1)));
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users
  for each row execute function handle_new_user();

-- الصلاحيات
alter table profiles enable row level security;
alter table videos enable row level security;
alter table likes enable row level security;
alter table follows enable row level security;
alter table saved_links enable row level security;

create policy "قراءة الملفات للجميع" on profiles for select using (true);
create policy "تعديل ملفي" on profiles for update using (auth.uid() = id);
create policy "قراءة الفيديوهات للجميع" on videos for select using (true);
create policy "نشر فيديو باسمي" on videos for insert with check (auth.uid() = user_id);
create policy "حذف فيديوهاتي" on videos for delete using (auth.uid() = user_id);
create policy "قراءة الإعجابات" on likes for select using (true);
create policy "إعجاب باسمي" on likes for insert with check (auth.uid() = user_id);
create policy "إلغاء إعجابي" on likes for delete using (auth.uid() = user_id);
create policy "قراءة المتابعات" on follows for select using (true);
create policy "متابعة باسمي" on follows for insert with check (auth.uid() = follower_id);
create policy "إلغاء متابعتي" on follows for delete using (auth.uid() = follower_id);
create policy "روابطي فقط" on saved_links for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- مخزن الفيديوهات
insert into storage.buckets (id, name, public) values ('videos','videos', true);
create policy "رفع في مجلدي" on storage.objects for insert to authenticated
  with check (bucket_id = 'videos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "قراءة ملفات الفيديو" on storage.objects for select using (bucket_id = 'videos');
