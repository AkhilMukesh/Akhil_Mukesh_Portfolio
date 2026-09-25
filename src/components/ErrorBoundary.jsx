import { Component } from 'react';

/**
 * Surfaces React render errors instead of an empty root (common “blank page” symptom).
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[portfolio]', error, info.componentStack);
  }

  render() {
    const { error } = this.state;
    if (error) {
      return (
        <div className="min-h-dvh bg-white px-6 py-16 text-neutral-900 dark:bg-ink-950 dark:text-glow-100">
          <div className="mx-auto max-w-lg">
            <p className="font-mono text-xs font-semibold uppercase tracking-wider text-red-600 dark:text-red-400">
              Render error
            </p>
            <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight">
              Something broke while loading this page
            </h1>
            <pre className="mt-6 overflow-x-auto rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-left text-xs leading-relaxed dark:border-white/10 dark:bg-ink-900">
              {error?.message ?? String(error)}
            </pre>
            <p className="mt-6 text-sm text-neutral-600 dark:text-glow-100/60">
              Open the browser developer console (F12 → Console) for the full stack trace.
            </p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
