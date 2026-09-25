import { createClient } from '@supabase/supabase-js';

/**
 * Single Supabase client for the app.
 *
 * Null-safe by design: if the env vars aren't set (e.g. before you've created
 * a project, or in the static-fallback deployment), `supabase` is `null` and
 * every consumer degrades gracefully instead of throwing. Check
 * `isSupabaseConfigured` before using the client.
 */
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Treat the .env.example placeholders as "not configured" too.
const looksReal =
  typeof url === 'string' &&
  typeof anonKey === 'string' &&
  url.startsWith('http') &&
  !url.includes('YOUR-PROJECT') &&
  !anonKey.includes('YOUR-ANON');

export const isSupabaseConfigured = looksReal;

export const supabase = looksReal
  ? createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true, // needed for magic-link redirects
      },
    })
  : null;
