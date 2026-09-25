import { useState } from 'react';
import { HiEnvelope, HiLockClosed, HiArrowRight, HiSparkles } from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';

/**
 * Sign-in panel for /admin. Two modes:
 *   • password   → email + password (Supabase signInWithPassword)
 *   • magic      → email only, sends a one-time login link
 */
export default function LoginPanel() {
  const { signInWithPassword, signInWithMagicLink, isConfigured } = useAuth();
  const [mode, setMode] = useState('password'); // 'password' | 'magic'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error
  const [message, setMessage] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setMessage('');

    const { error } =
      mode === 'password'
        ? await signInWithPassword(email.trim(), password)
        : await signInWithMagicLink(email.trim());

    if (error) {
      setStatus('error');
      setMessage(error.message || 'Something went wrong. Try again.');
      return;
    }

    if (mode === 'magic') {
      setStatus('sent');
      setMessage('Check your inbox for a one-time sign-in link.');
    }
    // password success → AuthProvider flips session, panel unmounts.
  };

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="mb-6 text-center">
        <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-xl bg-neutral-900 text-white dark:bg-white dark:text-neutral-900">
          <HiLockClosed className="size-5" />
        </div>
        <h1 className="font-display text-2xl font-semibold text-neutral-950 dark:text-white">
          Admin sign-in
        </h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-glow-100/55">
          Restricted to the portfolio owner.
        </p>
      </div>

      {!isConfigured && (
        <div className="mb-5 rounded-lg border border-amber-300/70 bg-amber-50 px-3.5 py-3 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
          Supabase isn&apos;t configured yet. Add <code className="font-mono">VITE_SUPABASE_URL</code>{' '}
          and <code className="font-mono">VITE_SUPABASE_ANON_KEY</code> (see{' '}
          <code className="font-mono">supabase/README.md</code>) to enable login and editing.
        </div>
      )}

      {/* Mode toggle */}
      <div className="mb-4 grid grid-cols-2 gap-1 rounded-full bg-neutral-100 p-1 dark:bg-white/[0.06]">
        {[
          { id: 'password', label: 'Password' },
          { id: 'magic', label: 'Magic link' },
        ].map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => {
              setMode(m.id);
              setStatus('idle');
              setMessage('');
            }}
            className={`h-8 rounded-full text-sm font-medium transition ${
              mode === m.id
                ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-800 dark:text-white'
                : 'text-neutral-500 hover:text-neutral-800 dark:text-glow-100/55 dark:hover:text-white'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      <form onSubmit={submit} className="space-y-3">
        <label className="block">
          <span className="sr-only">Email</span>
          <div className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 focus-within:border-neutral-500 dark:border-white/15 dark:bg-white/[0.04]">
            <HiEnvelope className="size-4 shrink-0 text-neutral-400" />
            <input
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              disabled={!isConfigured || status === 'sending'}
              className="h-11 w-full bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400 disabled:opacity-60 dark:text-white"
            />
          </div>
        </label>

        {mode === 'password' && (
          <label className="block">
            <span className="sr-only">Password</span>
            <div className="flex items-center gap-2 rounded-lg border border-neutral-300 bg-white px-3 focus-within:border-neutral-500 dark:border-white/15 dark:bg-white/[0.04]">
              <HiLockClosed className="size-4 shrink-0 text-neutral-400" />
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                disabled={!isConfigured || status === 'sending'}
                className="h-11 w-full bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400 disabled:opacity-60 dark:text-white"
              />
            </div>
          </label>
        )}

        <button
          type="submit"
          disabled={!isConfigured || status === 'sending' || status === 'sent'}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-neutral-950 text-sm font-semibold text-white transition hover:bg-neutral-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
        >
          {status === 'sending' ? (
            'Working…'
          ) : mode === 'magic' ? (
            <>
              <HiSparkles className="size-4" /> Send magic link
            </>
          ) : (
            <>
              Sign in <HiArrowRight className="size-4" />
            </>
          )}
        </button>
      </form>

      {message && (
        <p
          className={`mt-3 text-center text-sm ${
            status === 'error'
              ? 'text-red-600 dark:text-red-400'
              : 'text-emerald-600 dark:text-emerald-400'
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
