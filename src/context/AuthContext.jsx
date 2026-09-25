import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

/**
 * AuthContext — thin wrapper over Supabase Auth for the /admin editor.
 * Supports both email/password and magic-link sign-in. When Supabase isn't
 * configured, every method returns a friendly error and `session` stays null.
 */
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(isSupabaseConfigured);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (active) {
        setSession(data.session ?? null);
        setLoading(false);
      }
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next ?? null);
    });

    return () => {
      active = false;
      sub?.subscription?.unsubscribe();
    };
  }, []);

  const signInWithPassword = useCallback(async (email, password) => {
    if (!supabase) return { error: new Error('Supabase is not configured.') };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  }, []);

  const signInWithMagicLink = useCallback(async (email) => {
    if (!supabase) return { error: new Error('Supabase is not configured.') };
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/admin` },
    });
    return { error };
  }, []);

  const signOut = useCallback(async () => {
    if (!supabase) return;
    await supabase.auth.signOut();
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      isAuthenticated: !!session,
      loading,
      isConfigured: isSupabaseConfigured,
      signInWithPassword,
      signInWithMagicLink,
      signOut,
    }),
    [session, loading, signInWithPassword, signInWithMagicLink, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}
