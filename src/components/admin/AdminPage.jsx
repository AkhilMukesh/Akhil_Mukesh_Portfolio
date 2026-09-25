import { useEffect, useRef, useState } from 'react';
import { HiArrowLeft, HiArrowRightOnRectangle, HiCheckCircle } from 'react-icons/hi2';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../context/ContentContext';
import { RouterLink } from '../../lib/router';
import LoginPanel from './LoginPanel';
import ProfileEditor from './ProfileEditor';
import ProjectsEditor from './ProjectsEditor';
import ExperienceEditor from './ExperienceEditor';
import SkillsEditor from './SkillsEditor';
import CertificationsEditor from './CertificationsEditor';

const TABS = [
  { id: 'profile', label: 'Profile', Editor: ProfileEditor },
  { id: 'projects', label: 'Projects', Editor: ProjectsEditor },
  { id: 'experience', label: 'Experience', Editor: ExperienceEditor },
  { id: 'skills', label: 'Skills', Editor: SkillsEditor },
  { id: 'certifications', label: 'Certifications', Editor: CertificationsEditor },
];

/** Ephemeral toast for save/error feedback. */
function useToast() {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);
  const notify = (message) => {
    clearTimeout(timer.current);
    setToast(message);
    timer.current = setTimeout(() => setToast(null), 2600);
  };
  useEffect(() => () => clearTimeout(timer.current), []);
  return { toast, notify };
}

export default function AdminPage() {
  const { isAuthenticated, loading, user, signOut, isConfigured } = useAuth();
  const { isLive, source } = useContent();
  const [tab, setTab] = useState('projects');
  const { toast, notify } = useToast();

  if (loading) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-white dark:bg-ink-950">
        <p className="animate-pulse text-sm text-neutral-400">Loading…</p>
      </div>
    );
  }

  // Not signed in → gate.
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-dvh flex-col bg-white px-4 py-16 dark:bg-ink-950">
        <div className="mx-auto w-full max-w-sm">
          <RouterLink
            to="/"
            className="mb-8 inline-flex items-center gap-1.5 text-sm text-neutral-500 transition hover:text-neutral-900 dark:text-glow-100/55 dark:hover:text-white"
          >
            <HiArrowLeft className="size-4" /> Back to site
          </RouterLink>
          <LoginPanel />
        </div>
      </div>
    );
  }

  const ActiveEditor = TABS.find((t) => t.id === tab)?.Editor ?? ProjectsEditor;

  return (
    <div className="min-h-dvh bg-stone-50 dark:bg-ink-950">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/90 backdrop-blur dark:border-white/10 dark:bg-ink-950/90">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-3">
            <RouterLink
              to="/"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-neutral-500 transition hover:text-neutral-900 dark:text-glow-100/55 dark:hover:text-white"
            >
              <HiArrowLeft className="size-4" /> Site
            </RouterLink>
            <span className="text-neutral-300 dark:text-white/20">·</span>
            <h1 className="font-display text-lg font-semibold text-neutral-950 dark:text-white">
              Content editor
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-neutral-400 sm:inline">{user?.email}</span>
            <button
              type="button"
              onClick={signOut}
              className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700 transition hover:bg-neutral-100 dark:border-white/15 dark:text-glow-100/80 dark:hover:bg-white/10"
            >
              <HiArrowRightOnRectangle className="size-4" /> Sign out
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="mx-auto flex max-w-4xl gap-1 overflow-x-auto px-4 pb-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition ${
                tab === t.id
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900'
                  : 'text-neutral-500 hover:bg-neutral-100 dark:text-glow-100/55 dark:hover:bg-white/10'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        {!isLive && (
          <div className="mb-5 rounded-lg border border-amber-300/70 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
            {isConfigured
              ? `Showing static fallback data (source: ${source}). Edits need a working Supabase connection with the schema applied — check the browser console and supabase/README.md.`
              : 'Supabase isn’t configured, so this is read-only static data. Add your keys to enable editing.'}
          </div>
        )}

        {isLive && (
          <div className="mb-5 rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-600 dark:border-glow-200/15 dark:bg-white/5 dark:text-glow-100/60">
            Edits appear on the site right away. The downloadable résumé is a build
            artifact — run{' '}
            <code className="rounded bg-neutral-200/70 px-1.5 py-0.5 font-mono text-xs dark:bg-white/10">
              npm run resume &amp;&amp; npm run resume:docx
            </code>{' '}
            to refresh the PDF and .docx from these changes.
          </div>
        )}

        <ActiveEditor notify={notify} />
      </main>

      {/* Toast */}
      {toast && (
        <div className="pointer-events-none fixed bottom-5 left-1/2 z-50 -translate-x-1/2">
          <div className="pointer-events-auto flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white shadow-lg dark:bg-white dark:text-neutral-900">
            <HiCheckCircle className="size-4 text-emerald-400 dark:text-emerald-500" />
            {toast}
          </div>
        </div>
      )}
    </div>
  );
}
