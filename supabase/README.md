# Supabase setup (one-time, ~5 minutes)

The portfolio runs **without** Supabase — it falls back to the static data in
`src/data/*.js`. Follow these steps only when you want the live, editable CMS
and the `/admin` editor.

## 1. Create a project
1. Go to <https://supabase.com> → **New project** (free tier is plenty).
2. Once it's ready, open **Project Settings → API** and copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`

## 2. Add your keys locally
```bash
cp .env.example .env.local
# then edit .env.local and paste the two values
```
On Vercel: **Project → Settings → Environment Variables** → add the same two.

## 3. Create the tables
Open **SQL Editor → New query**, paste the contents of
[`schema.sql`](./schema.sql), and **Run**. This creates the tables, triggers,
and Row-Level Security policies (public read, authenticated write).

## 4. Seed your content
Regenerate the seed from the source data (optional — a committed `seed.sql`
already exists):
```bash
npm run seed:build
```
Then paste [`seed.sql`](./seed.sql) into the SQL Editor and **Run**.

## 5. Create your admin user
**Authentication → Users → Add user** (email + password), or enable email
magic links under **Authentication → Providers → Email**. That email/password
is what you'll use at `/admin`.

> Add your production site URL under **Authentication → URL Configuration →
> Redirect URLs** so magic links redirect back correctly (e.g.
> `https://your-portfolio.vercel.app/admin`).

## Editing content
Sign in at `/admin` and edit any section inline — **Profile**, Projects,
Experience, Skills, Certifications. Changes save straight to Supabase and
appear on the live site immediately (public read is uncached at the DB level; a
hard refresh always shows the latest).

The **Profile** tab holds everything that used to be code-only: name, title,
contact details, the résumé summary, hero copy, About paragraphs, the
highlight cards, and education. Any field you leave blank falls back to
`src/data/profile.js`, so a partially-filled row never blanks out the site.

## Refreshing the résumé after an edit

The website reads Supabase live, but `public/resume.pdf` and
`public/Khaza-Shaik-Resume-ATS.docx` are **build artifacts** — they do not
update themselves. After editing in `/admin`, regenerate them:

```bash
npm run resume && npm run resume:docx
```

Both scripts read Supabase first (using `VITE_SUPABASE_URL` +
`VITE_SUPABASE_ANON_KEY`, or `SUPABASE_SERVICE_ROLE_KEY` if you set one) and
fall back to `src/data/*.js` when it's unreachable. Each prints which source it
used:

```
✓ Wrote public/resume.pdf  (36.5 KB) from Supabase (admin UI)
✓ Wrote public/resume.pdf  (36.5 KB) from static src/data
```

If it says `static src/data` unexpectedly, your `.env.local` isn't being picked
up — check the two `VITE_SUPABASE_*` values.

## Keeping the static fallback in sync

`src/data/*.js` is still the offline fallback and the seed source. If you make
significant edits in the admin UI, mirror them back into those files (or
re-seed from them) so a Supabase outage doesn't serve stale content:

```bash
npm run seed:build   # regenerates supabase/seed.sql from src/data/*.js
```
