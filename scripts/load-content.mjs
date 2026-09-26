/**
 * Shared content loader for the résumé builders (PDF + .docx).
 *
 * Supabase is the single source of truth: whatever you edit in /admin is what
 * lands in the résumé. If Supabase isn't configured or is unreachable we fall
 * back to the static src/data/*.js files so `npm run resume` never fails just
 * because you're offline.
 *
 * Node can't read Vite's `import.meta.env`, so credentials come from the
 * process env — a .env / .env.local file is parsed manually (no extra dep).
 *
 * Rows are normalised snake_case → camelCase to match what the React
 * components already consume; this mirrors the mappers in ContentContext.jsx.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** Minimal .env parser — first file that defines a key wins. */
const readEnvFiles = () => {
  const out = {};
  for (const name of ['.env.local', '.env']) {
    const file = path.join(ROOT, name);
    if (!fs.existsSync(file)) continue;
    for (const rawLine of fs.readFileSync(file, 'utf8').split('\n')) {
      const line = rawLine.trim();
      if (!line || line.startsWith('#')) continue;
      const eq = line.indexOf('=');
      if (eq < 1) continue;
      const key = line.slice(0, eq).trim();
      let val = line.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (!(key in out)) out[key] = val;
    }
  }
  return out;
};

const env = { ...readEnvFiles(), ...process.env };

const url = env.VITE_SUPABASE_URL || env.SUPABASE_URL;
// Prefer a service-role key when present (bypasses RLS); anon is enough for
// reads because the schema grants public select.
const key =
  env.SUPABASE_SERVICE_ROLE_KEY || env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY;

const isConfigured =
  typeof url === 'string' &&
  typeof key === 'string' &&
  url.startsWith('http') &&
  !url.includes('YOUR-PROJECT') &&
  !key.includes('YOUR-ANON');

// --- normalisers: DB row → app shape (keep in sync with ContentContext) ----
const mapProject = (r) => ({
  id: r.id,
  title: r.title,
  description: r.description,
  tech: r.tech ?? [],
  category: r.category,
  github: r.github ?? undefined,
  demo: r.demo ?? undefined,
  featured: !!r.featured,
  hasInteractiveDemo: !!r.has_interactive_demo,
  sortOrder: r.sort_order,
});

const mapExperience = (r) => ({
  id: r.id,
  role: r.role,
  company: r.company,
  duration: r.duration,
  location: r.location,
  client: r.client ?? undefined,
  website: r.website ?? undefined,
  highlights: r.highlights ?? [],
  techAI: r.tech_ai ?? [],
  tech: r.tech ?? [],
  sortOrder: r.sort_order,
});

const mapSkillGroup = (r) => ({
  id: r.id,
  category: r.category,
  items: Array.isArray(r.items) ? r.items : [],
  sortOrder: r.sort_order,
});

const mapCertification = (r) => ({
  id: r.id,
  title: r.title,
  issuer: r.issuer,
  date: r.date,
  detail: r.detail ?? undefined,
  credentialUrl: r.credential_url ?? '#',
  sortOrder: r.sort_order,
});

const mapProfile = (r, fallback) => {
  if (!r) return fallback;
  const pick = (v, fb) => (v == null || v === '' ? fb : v);
  const obj = (v, fb) => (v && typeof v === 'object' && Object.keys(v).length ? v : fb);
  const arr = (v, fb) => (Array.isArray(v) && v.length ? v : fb);
  return {
    ...fallback,
    name: pick(r.name, fallback.name),
    title: pick(r.title, fallback.title),
    location: pick(r.location, fallback.location),
    email: pick(r.email, fallback.email),
    phone: pick(r.phone, fallback.phone),
    linkedin: pick(r.linkedin, fallback.linkedin),
    linkedinUrl: pick(r.linkedin_url, fallback.linkedinUrl),
    github: pick(r.github, fallback.github),
    githubUrl: pick(r.github_url, fallback.githubUrl),
    summary: pick(r.summary, fallback.summary),
    hero: obj(r.hero, fallback.hero),
    about: arr(r.about, fallback.about),
    highlights: arr(r.highlights, fallback.highlights),
    education: obj(r.education, fallback.education),
  };
};

/**
 * Resolve résumé content, preferring Supabase.
 *
 * @param {object} statics static fallbacks: { experience, projects, skills, certifications, profile }
 * @returns {Promise<{content: object, source: 'supabase'|'static'}>}
 */
export async function loadContent(statics) {
  if (!isConfigured) {
    return { content: statics, source: 'static' };
  }

  try {
    const { createClient } = await import('@supabase/supabase-js');
    const supabase = createClient(url, key, { auth: { persistSession: false } });

    const [exp, proj, sk, cert, prof] = await Promise.all([
      supabase.from('experience').select('*').order('sort_order', { ascending: true }),
      supabase.from('projects').select('*').order('sort_order', { ascending: true }),
      supabase.from('skill_groups').select('*').order('sort_order', { ascending: true }),
      supabase.from('certifications').select('*').order('sort_order', { ascending: true }),
      supabase.from('profile').select('*').limit(1).maybeSingle(),
    ]);

    const firstError = exp.error || proj.error || sk.error || cert.error;
    if (firstError) throw firstError;

    // An empty table almost always means "not seeded yet" rather than
    // "intentionally blank", so prefer the static list in that case.
    const orStatic = (rows, mapper, fb) =>
      rows && rows.length ? rows.map(mapper) : fb;

    return {
      source: 'supabase',
      content: {
        experience: orStatic(exp.data, mapExperience, statics.experience),
        projects: orStatic(proj.data, mapProject, statics.projects),
        skills: orStatic(sk.data, mapSkillGroup, statics.skills),
        certifications: orStatic(cert.data, mapCertification, statics.certifications),
        profile: prof.error ? statics.profile : mapProfile(prof.data, statics.profile),
      },
    };
  } catch (err) {
    console.warn(`  ! Supabase read failed (${err?.message || err}) — using static src/data`);
    return { content: statics, source: 'static' };
  }
}
