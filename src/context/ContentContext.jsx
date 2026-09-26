import { createContext, useContext, useCallback, useEffect, useMemo, useState } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

import projectsFallback from '../data/projects';
import experienceFallback from '../data/experience';
import skillsFallback from '../data/skills';
import certificationsFallback from '../data/certifications';
import profileFallback from '../data/profile';

/**
 * ContentContext — the single data source for every public section and the
 * admin editor.
 *
 * Behaviour:
 *   • Supabase configured → fetch live rows (ordered by sort_order).
 *   • Not configured OR fetch fails → fall back to the static src/data arrays
 *     so the site ALWAYS renders. `source` tells you which you're seeing.
 *
 * DB columns are snake_case; we normalise to the camelCase shapes the existing
 * components already consume (hasInteractiveDemo, credentialUrl, …).
 */

const ContentContext = createContext(null);

// --- normalisers: DB row → app shape --------------------------------------
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

/**
 * Profile is a single row of mostly-prose. Anything the admin hasn't filled in
 * yet falls back to the static file field-by-field, so a half-populated row
 * never blanks out the hero or résumé.
 */
const mapProfile = (r) => {
  if (!r) return profileFallback;
  const pick = (v, fb) => (v == null || v === '' ? fb : v);
  const obj = (v, fb) => (v && typeof v === 'object' && Object.keys(v).length ? v : fb);
  const arr = (v, fb) => (Array.isArray(v) && v.length ? v : fb);
  return {
    id: r.id,
    name: pick(r.name, profileFallback.name),
    title: pick(r.title, profileFallback.title),
    location: pick(r.location, profileFallback.location),
    email: pick(r.email, profileFallback.email),
    phone: pick(r.phone, profileFallback.phone),
    linkedin: pick(r.linkedin, profileFallback.linkedin),
    linkedinUrl: pick(r.linkedin_url, profileFallback.linkedinUrl),
    github: pick(r.github, profileFallback.github),
    githubUrl: pick(r.github_url, profileFallback.githubUrl),
    summary: pick(r.summary, profileFallback.summary),
    hero: obj(r.hero, profileFallback.hero),
    about: arr(r.about, profileFallback.about),
    highlights: arr(r.highlights, profileFallback.highlights),
    education: obj(r.education, profileFallback.education),
  };
};

const FALLBACK = {
  projects: projectsFallback,
  experience: experienceFallback,
  skills: skillsFallback,
  certifications: certificationsFallback,
  profile: profileFallback,
};

const EMPTY = { projects: [], experience: [], skills: [], certifications: [] };

export function ContentProvider({ children }) {
  const [data, setData] = useState(FALLBACK);
  const [source, setSource] = useState(isSupabaseConfigured ? 'loading' : 'fallback');
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) {
      setData(FALLBACK);
      setSource('fallback');
      return;
    }
    try {
      const [proj, exp, sk, cert, prof] = await Promise.all([
        supabase.from('projects').select('*').order('sort_order', { ascending: true }),
        supabase.from('experience').select('*').order('sort_order', { ascending: true }),
        supabase.from('skill_groups').select('*').order('sort_order', { ascending: true }),
        supabase.from('certifications').select('*').order('sort_order', { ascending: true }),
        supabase.from('profile').select('*').limit(1).maybeSingle(),
      ]);

      const firstError = proj.error || exp.error || sk.error || cert.error;
      if (firstError) throw firstError;

      // The profile table may not exist yet on an older project — that alone
      // shouldn't drop the whole site onto static data.
      if (prof.error) {
        console.warn('[ContentProvider] profile unavailable, using static:', prof.error.message);
      }

      setData({
        projects: (proj.data ?? []).map(mapProject),
        experience: (exp.data ?? []).map(mapExperience),
        skills: (sk.data ?? []).map(mapSkillGroup),
        certifications: (cert.data ?? []).map(mapCertification),
        profile: prof.error ? profileFallback : mapProfile(prof.data),
      });
      setSource('live');
      setError(null);
    } catch (err) {
      // Network / RLS / table-missing → keep the site alive on static data.
      console.warn('[ContentProvider] falling back to static data:', err?.message || err);
      setData(FALLBACK);
      setSource('fallback');
      setError(err);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const value = useMemo(
    () => ({
      ...data,
      source, // 'loading' | 'live' | 'fallback'
      isLive: source === 'live',
      error,
      refresh: fetchAll,
      EMPTY,
    }),
    [data, source, error, fetchAll],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within <ContentProvider>');
  return ctx;
}
