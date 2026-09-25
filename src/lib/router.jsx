import { createContext, useContext, useEffect, useState, useCallback } from 'react';

/**
 * Minimal client-side router — just enough for this SPA (home + /admin).
 *
 * Why not react-router: every published react-router version is currently
 * flagged for SSR/loader XSS+RCE advisories that don't apply to a static SPA,
 * and we only need a single extra route. ~40 lines with zero deps is cleaner.
 *
 * Uses the History API. Requires a host rewrite so deep links resolve to
 * index.html (see vercel.json). BASE_URL-aware so it works under a subpath.
 */

const RouterContext = createContext(null);

const BASE = import.meta.env.BASE_URL || '/';

/** Current path with the base stripped, always starting with '/'. */
function currentPath() {
  let p = window.location.pathname;
  if (BASE !== '/' && p.startsWith(BASE)) {
    p = p.slice(BASE.length - 1); // keep leading slash
  }
  return p || '/';
}

export function RouterProvider({ children }) {
  const [path, setPath] = useState(currentPath);

  useEffect(() => {
    const onPop = () => setPath(currentPath());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback((to) => {
    const base = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
    const url = `${base}${to.startsWith('/') ? to : `/${to}`}`;
    window.history.pushState({}, '', url);
    setPath(to.startsWith('/') ? to : `/${to}`);
    window.scrollTo(0, 0);
  }, []);

  return (
    <RouterContext.Provider value={{ path, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  const ctx = useContext(RouterContext);
  if (!ctx) throw new Error('useRouter must be used within <RouterProvider>');
  return ctx;
}

/** Anchor that navigates client-side (falls back to normal nav on modifier-click). */
export function RouterLink({ to, children, className, ...rest }) {
  const { navigate } = useRouter();
  const base = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;
  const href = `${base}${to.startsWith('/') ? to : `/${to}`}`;
  const onClick = (e) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    navigate(to);
  };
  return (
    <a href={href} onClick={onClick} className={className} {...rest}>
      {children}
    </a>
  );
}
