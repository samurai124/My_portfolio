-- Portfolio CMS schema for Supabase
-- Run in Supabase SQL Editor.

create extension if not exists pgcrypto;

-- ----------------------------
-- Content tables
-- ----------------------------
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null,
  tags text[] not null default '{}',
  image text,
  github_url text,
  live_url text,
  metrics text[] not null default '{}',
  description text,
  details jsonb not null default '{}'::jsonb,
  featured boolean not null default false,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  code text,
  title text not null,
  description text,
  images text[] not null default '{}',
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  name text not null,
  role text,
  image text,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blogs (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date text,
  read_time text,
  category text,
  image text,
  summary text,
  content text,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skills (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  level int not null default 90,
  icon text,
  featured boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profile (
  id uuid primary key default gen_random_uuid(),
  full_name text,
  headline text,
  location text,
  availability text,
  bio text,
  avatar_url text,
  social_links jsonb not null default '{}'::jsonb,
  stats jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ----------------------------
-- Inbound leads
-- ----------------------------
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  project_type text,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  date text not null,
  slot text not null,
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

-- ----------------------------
-- Generic updated_at trigger
-- ----------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_projects_updated_at on public.projects;
create trigger set_projects_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists set_services_updated_at on public.services;
create trigger set_services_updated_at
before update on public.services
for each row execute function public.set_updated_at();

drop trigger if exists set_testimonials_updated_at on public.testimonials;
create trigger set_testimonials_updated_at
before update on public.testimonials
for each row execute function public.set_updated_at();

drop trigger if exists set_faqs_updated_at on public.faqs;
create trigger set_faqs_updated_at
before update on public.faqs
for each row execute function public.set_updated_at();

drop trigger if exists set_blogs_updated_at on public.blogs;
create trigger set_blogs_updated_at
before update on public.blogs
for each row execute function public.set_updated_at();

drop trigger if exists set_skills_updated_at on public.skills;
create trigger set_skills_updated_at
before update on public.skills
for each row execute function public.set_updated_at();

drop trigger if exists set_profile_updated_at on public.profile;
create trigger set_profile_updated_at
before update on public.profile
for each row execute function public.set_updated_at();

-- ----------------------------
-- Row Level Security
-- ----------------------------
alter table public.projects enable row level security;
alter table public.services enable row level security;
alter table public.testimonials enable row level security;
alter table public.faqs enable row level security;
alter table public.blogs enable row level security;
alter table public.skills enable row level security;
alter table public.profile enable row level security;
alter table public.messages enable row level security;
alter table public.bookings enable row level security;

-- Public can read portfolio content
create policy if not exists "public read projects"
on public.projects for select
to anon, authenticated
using (published = true or auth.role() = 'authenticated');

create policy if not exists "public read services"
on public.services for select
to anon, authenticated
using (true);

create policy if not exists "public read testimonials"
on public.testimonials for select
to anon, authenticated
using (true);

create policy if not exists "public read faqs"
on public.faqs for select
to anon, authenticated
using (true);

create policy if not exists "public read blogs"
on public.blogs for select
to anon, authenticated
using (published = true or auth.role() = 'authenticated');

create policy if not exists "public read skills"
on public.skills for select
to anon, authenticated
using (true);

create policy if not exists "public read profile"
on public.profile for select
to anon, authenticated
using (true);

-- Authenticated users can manage content
create policy if not exists "auth manage projects"
on public.projects for all
to authenticated
using (true)
with check (true);

create policy if not exists "auth manage services"
on public.services for all
to authenticated
using (true)
with check (true);

create policy if not exists "auth manage testimonials"
on public.testimonials for all
to authenticated
using (true)
with check (true);

create policy if not exists "auth manage faqs"
on public.faqs for all
to authenticated
using (true)
with check (true);

create policy if not exists "auth manage blogs"
on public.blogs for all
to authenticated
using (true)
with check (true);

create policy if not exists "auth manage skills"
on public.skills for all
to authenticated
using (true)
with check (true);

create policy if not exists "auth manage profile"
on public.profile for all
to authenticated
using (true)
with check (true);

-- Public can submit forms
create policy if not exists "public insert messages"
on public.messages for insert
to anon, authenticated
with check (true);

create policy if not exists "public insert bookings"
on public.bookings for insert
to anon, authenticated
with check (true);

-- Only authenticated can read/manage submissions
create policy if not exists "auth read messages"
on public.messages for select
to authenticated
using (true);

create policy if not exists "auth manage messages"
on public.messages for update
to authenticated
using (true)
with check (true);

create policy if not exists "auth delete messages"
on public.messages for delete
to authenticated
using (true);

create policy if not exists "auth read bookings"
on public.bookings for select
to authenticated
using (true);

create policy if not exists "auth manage bookings"
on public.bookings for update
to authenticated
using (true)
with check (true);

create policy if not exists "auth delete bookings"
on public.bookings for delete
to authenticated
using (true);

-- ----------------------------
-- Storage bucket for uploads
-- ----------------------------
insert into storage.buckets (id, name, public)
values ('portfolio-assets', 'portfolio-assets', true)
on conflict (id) do nothing;

create policy if not exists "public read portfolio assets"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'portfolio-assets');

create policy if not exists "auth upload portfolio assets"
on storage.objects for insert
to authenticated
with check (bucket_id = 'portfolio-assets');

create policy if not exists "auth update portfolio assets"
on storage.objects for update
to authenticated
using (bucket_id = 'portfolio-assets')
with check (bucket_id = 'portfolio-assets');

create policy if not exists "auth delete portfolio assets"
on storage.objects for delete
to authenticated
using (bucket_id = 'portfolio-assets');

-- ----------------------------
-- Sample / Initial Skills Seeds
-- ----------------------------
insert into public.skills (name, category, level, icon, featured, sort_order)
values
  ('React.js', 'Frontend', 95, 'code', true, 1),
  ('JavaScript (ES6+)', 'Frontend', 92, 'javascript', true, 2),
  ('TypeScript', 'Frontend', 85, 'code', true, 3),
  ('Tailwind CSS & Modern UI', 'Frontend', 90, 'palette', true, 4),
  ('HTML5 & Responsive CSS', 'Frontend', 95, 'web', false, 5),
  ('Java Spring Boot', 'Backend', 90, 'terminal', true, 6),
  ('PHP & Laravel', 'Backend', 88, 'data_object', true, 7),
  ('RESTful API & Security (JWT)', 'Backend', 92, 'lock', true, 8),
  ('Microservices & MVC', 'Backend', 85, 'hub', false, 9),
  ('PostgreSQL', 'Database', 88, 'database', true, 10),
  ('MySQL', 'Database', 90, 'database', true, 11),
  ('Supabase & BaaS', 'Database', 86, 'storage', true, 12),
  ('Docker & Containerization', 'DevOps & Cloud', 86, 'deployed_code', true, 13),
  ('CI/CD Pipelines (GitHub Actions)', 'DevOps & Cloud', 82, 'sync_alt', true, 14),
  ('Linux & Cloud Deployment', 'DevOps & Cloud', 80, 'cloud_upload', false, 15),
  ('Git & GitHub Workflow', 'Tools', 92, 'fork_right', true, 16),
  ('Postman & API Testing', 'Tools', 90, 'send_time_extension', true, 17),
  ('Agile / Scrum & Clean Code', 'Tools', 88, 'check_circle', false, 18)
on conflict do nothing;
