import { useEffect, useRef, useState } from 'react';
import { HiXMark, HiPlus } from 'react-icons/hi2';

/**
 * Inline-edit primitives for the admin editor.
 *
 * Design: click a field to edit in place; it commits on blur (or ⌘/Ctrl+Enter
 * for textareas, Enter for single-line). `onCommit(nextValue)` only fires when
 * the value actually changed, so you don't spam the DB on every focus.
 */

// --- single-line text ------------------------------------------------------
export function InlineText({ value, onCommit, placeholder, className = '', mono = false }) {
  const [draft, setDraft] = useState(value ?? '');
  useEffect(() => setDraft(value ?? ''), [value]);

  const commit = () => {
    const next = draft.trim();
    if (next !== (value ?? '')) onCommit(next);
  };

  return (
    <input
      value={draft}
      placeholder={placeholder}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === 'Enter') e.currentTarget.blur();
        if (e.key === 'Escape') {
          setDraft(value ?? '');
          e.currentTarget.blur();
        }
      }}
      className={`w-full rounded-md border border-transparent bg-transparent px-2 py-1 text-neutral-900 outline-none transition hover:bg-neutral-100 focus:border-primary-400 focus:bg-white dark:text-white dark:hover:bg-white/[0.06] dark:focus:bg-white/10 ${
        mono ? 'font-mono text-xs' : ''
      } ${className}`}
    />
  );
}

// --- multi-line text -------------------------------------------------------
export function InlineTextarea({ value, onCommit, placeholder, rows = 3, className = '' }) {
  const [draft, setDraft] = useState(value ?? '');
  const ref = useRef(null);
  useEffect(() => setDraft(value ?? ''), [value]);

  // auto-grow
  useEffect(() => {
    const el = ref.current;
    if (el) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [draft]);

  const commit = () => {
    const next = draft.trim();
    if (next !== (value ?? '')) onCommit(next);
  };

  return (
    <textarea
      ref={ref}
      rows={rows}
      value={draft}
      placeholder={placeholder}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') e.currentTarget.blur();
        if (e.key === 'Escape') {
          setDraft(value ?? '');
          e.currentTarget.blur();
        }
      }}
      className={`w-full resize-none rounded-md border border-transparent bg-transparent px-2 py-1 text-sm leading-relaxed text-neutral-800 outline-none transition hover:bg-neutral-100 focus:border-primary-400 focus:bg-white dark:text-glow-100/80 dark:hover:bg-white/[0.06] dark:focus:bg-white/10 ${className}`}
    />
  );
}

// --- editable chip list (tech tags) ---------------------------------------
export function TagListEditor({ tags = [], onChange }) {
  const [adding, setAdding] = useState('');

  const add = () => {
    const t = adding.trim();
    if (t && !tags.includes(t)) onChange([...tags, t]);
    setAdding('');
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {tags.map((t) => (
        <span
          key={t}
          className="inline-flex items-center gap-1 rounded bg-neutral-100 px-2 py-0.5 font-mono text-xs text-neutral-600 dark:bg-ink-800 dark:text-glow-100/70"
        >
          {t}
          <button
            type="button"
            onClick={() => onChange(tags.filter((x) => x !== t))}
            aria-label={`Remove ${t}`}
            className="text-neutral-400 hover:text-red-500"
          >
            <HiXMark className="size-3" />
          </button>
        </span>
      ))}
      <span className="inline-flex items-center gap-1 rounded border border-dashed border-neutral-300 px-1.5 py-0.5 dark:border-white/15">
        <input
          value={adding}
          onChange={(e) => setAdding(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              add();
            }
          }}
          onBlur={add}
          placeholder="add tag"
          className="w-20 bg-transparent font-mono text-xs text-neutral-700 outline-none placeholder:text-neutral-400 dark:text-glow-100/70"
        />
      </span>
    </div>
  );
}

// --- editable bullet list (experience highlights) --------------------------
export function BulletListEditor({ items = [], onChange }) {
  const update = (i, v) => onChange(items.map((it, idx) => (idx === i ? v : it)));
  const removeAt = (i) => onChange(items.filter((_, idx) => idx !== i));
  const add = () => onChange([...items, '']);

  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2">
          <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-primary-400" aria-hidden />
          <div className="flex-1">
            <InlineTextarea
              value={item}
              rows={2}
              onCommit={(v) => update(i, v)}
              placeholder="Achievement / responsibility…"
            />
          </div>
          <button
            type="button"
            onClick={() => removeAt(i)}
            aria-label="Remove bullet"
            className="mt-1.5 text-neutral-300 transition hover:text-red-500"
          >
            <HiXMark className="size-4" />
          </button>
        </li>
      ))}
      <li>
        <button
          type="button"
          onClick={add}
          className="ml-3.5 inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
        >
          <HiPlus className="size-3.5" /> Add bullet
        </button>
      </li>
    </ul>
  );
}

// --- small labelled field wrapper -----------------------------------------
export function Field({ label, children }) {
  return (
    <div>
      <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wider text-neutral-400 dark:text-glow-100/40">
        {label}
      </span>
      {children}
    </div>
  );
}
