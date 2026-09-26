-- ============================================================================
--  Khaza Shaik — Portfolio CMS schema
--  Run this in the Supabase SQL Editor (Dashboard → SQL → New query).
--  Safe to re-run: uses IF NOT EXISTS / idempotent policy drops.
--
--  Security model:
--    • Anyone (anon key) can READ  → the public portfolio renders from here.
--    • Only AUTHENTICATED users can WRITE → the /admin editor.
--  This is enforced with Row-Level Security (RLS) below, so the public anon
--  key is safe to ship in the frontend bundle.
-- ============================================================================

-- ---------------------------------------------------------------------------
--  updated_at auto-touch trigger
-- ---------------------------------------------------------------------------
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
--  projects
-- ---------------------------------------------------------------------------
create table if not exists public.projects (
  id                  uuid primary key default gen_random_uuid(),
  title               text        not null,
  description         text        not null default '',
  tech                text[]      not null default '{}',
  category            text        not null default 'Enterprise',  -- 'AI' | 'Enterprise'
  github              text,
  demo                text,
  featured            boolean     not null default false,
  has_interactive_demo boolean    not null default false,
  sort_order          integer     not null default 0,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
--  experience
-- ---------------------------------------------------------------------------
create table if not exists public.experience (
  id          uuid primary key default gen_random_uuid(),
  role        text        not null,
  company     text        not null,
  duration    text        not null default '',
  location    text        not null default '',
  client      text,
  website     text,
  highlights  text[]      not null default '{}',
  -- `tech_ai` renders as accent-coloured chips before a divider, `tech` after,
  -- so an AI-heavy role can show its AI stack distinctly from the rest.
  tech_ai     text[]      not null default '{}',
  tech        text[]      not null default '{}',
  sort_order  integer     not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Safe to re-run against an existing project that predates tech_ai.
alter table if exists public.experience
  add column if not exists tech_ai text[] not null default '{}';
alter table if exists public.experience
  add column if not exists website text;

-- ---------------------------------------------------------------------------
--  skill_groups   (items is JSONB: [{ name, icon, color }, ...])
--  `icon` is a string KEY resolved to a React icon component on the client
--  (see src/data/iconMap.js). Storing the component itself isn't possible.
-- ---------------------------------------------------------------------------
create table if not exists public.skill_groups (
  id          uuid primary key default gen_random_uuid(),
  category    text        not null,
  items       jsonb       not null default '[]'::jsonb,
  sort_order  integer     not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
--  certifications
-- ---------------------------------------------------------------------------
create table if not exists public.certifications (
  id             uuid primary key default gen_random_uuid(),
  title          text        not null,
  issuer         text        not null default '',
  date           text        not null default '',
  -- optional sub-line, e.g. the courses inside a specialization
  detail         text,
  credential_url text,
  sort_order     integer     not null default 0,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Safe to re-run against an existing project that predates `detail`.
alter table if exists public.certifications
  add column if not exists detail text;

-- ---------------------------------------------------------------------------
--  profile — the free-text prose shared by the site header, About section and
--  the résumé (PDF + .docx). Single row, pinned by `singleton`, so the admin
--  edits one record instead of managing a list.
-- ---------------------------------------------------------------------------
create table if not exists public.profile (
  id           uuid primary key default gen_random_uuid(),
  singleton    boolean     not null default true unique
                 constraint profile_single_row check (singleton),
  name         text        not null default '',
  title        text        not null default '',
  location     text        not null default '',
  email        text        not null default '',
  phone        text        not null default '',
  linkedin     text        not null default '',
  linkedin_url text        not null default '',
  github       text        not null default '',
  github_url   text        not null default '',
  summary      text        not null default '',
  -- { leadLabel, tagline, sub }
  hero         jsonb       not null default '{}'::jsonb,
  -- string[] of About paragraphs; `{years}` is substituted at render time
  about        jsonb       not null default '[]'::jsonb,
  -- [{ eyebrow, stat, hint, detail }]
  highlights   jsonb       not null default '[]'::jsonb,
  -- { degree, school }
  education    jsonb       not null default '{}'::jsonb,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
--  Attach updated_at triggers
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['projects','experience','skill_groups','certifications','profile']
  loop
    execute format('drop trigger if exists touch_%1$s on public.%1$s;', t);
    execute format(
      'create trigger touch_%1$s before update on public.%1$s
         for each row execute function public.touch_updated_at();', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
--  Row-Level Security: public read, authenticated write
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['projects','experience','skill_groups','certifications','profile']
  loop
    execute format('alter table public.%I enable row level security;', t);

    -- public read
    execute format('drop policy if exists "%1$s_read" on public.%1$s;', t);
    execute format(
      'create policy "%1$s_read" on public.%1$s
         for select to anon, authenticated using (true);', t);

    -- authenticated write (insert / update / delete)
    execute format('drop policy if exists "%1$s_write" on public.%1$s;', t);
    execute format(
      'create policy "%1$s_write" on public.%1$s
         for all to authenticated using (true) with check (true);', t);
  end loop;
end $$;

-- ---------------------------------------------------------------------------
--  Helpful indexes for ordered reads
-- ---------------------------------------------------------------------------
create index if not exists projects_sort_idx       on public.projects (sort_order);
create index if not exists experience_sort_idx     on public.experience (sort_order);
create index if not exists skill_groups_sort_idx   on public.skill_groups (sort_order);
create index if not exists certifications_sort_idx on public.certifications (sort_order);

-- ---------------------------------------------------------------------------
--  Public portfolio visit and like counters
--  Counters are changed only through SECURITY DEFINER RPCs; visitors get
--  read access to the totals, but no direct write access to this table.
-- ---------------------------------------------------------------------------
create table if not exists public.portfolio_stats (
  id          boolean primary key default true check (id),
  visit_count bigint not null default 0 check (visit_count >= 0),
  like_count  bigint not null default 0 check (like_count >= 0)
);

insert into public.portfolio_stats (id)
values (true)
on conflict (id) do nothing;

alter table public.portfolio_stats enable row level security;
drop policy if exists portfolio_stats_read on public.portfolio_stats;
create policy portfolio_stats_read
  on public.portfolio_stats
  for select to anon, authenticated
  using (true);

revoke all on public.portfolio_stats from anon, authenticated;
grant select on public.portfolio_stats to anon, authenticated;

create or replace function public.record_portfolio_visit()
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_visit_count bigint;
begin
  insert into public.portfolio_stats (id, visit_count)
  values (true, 1)
  on conflict (id) do update
    set visit_count = public.portfolio_stats.visit_count + 1
  returning visit_count into new_visit_count;

  return new_visit_count;
end;
$$;

create or replace function public.record_portfolio_like()
returns bigint
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_like_count bigint;
begin
  insert into public.portfolio_stats (id, like_count)
  values (true, 1)
  on conflict (id) do update
    set like_count = public.portfolio_stats.like_count + 1
  returning like_count into new_like_count;

  return new_like_count;
end;
$$;

revoke all on function public.record_portfolio_visit() from public;
revoke all on function public.record_portfolio_like() from public;
grant execute on function public.record_portfolio_visit() to anon, authenticated;
grant execute on function public.record_portfolio_like() to anon, authenticated;
