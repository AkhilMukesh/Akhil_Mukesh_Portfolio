import { HiChevronUp, HiChevronDown, HiTrash } from 'react-icons/hi2';

/**
 * A card wrapper for one editable record: hosts the inline fields (children)
 * plus reorder ↑/↓ and delete controls in a header.
 *
 * Singleton sections (e.g. Profile) omit `index`/`onDelete`, which hides the
 * numbering and the reorder/delete controls entirely.
 */
export default function EditorCard({
  title,
  index,
  total,
  onMoveUp,
  onMoveDown,
  onDelete,
  busy,
  children,
}) {
  const isListRow = typeof index === 'number';

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-ink-900/60">
      <div className="mb-3 flex items-center justify-between gap-2 border-b border-neutral-100 pb-2 dark:border-white/10">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 dark:text-glow-100/40">
          {title}
          {isListRow && ` · ${index + 1}`}
        </span>
        <div className={`flex items-center gap-1 ${isListRow ? '' : 'hidden'}`}>
          <button
            type="button"
            onClick={onMoveUp}
            disabled={index === 0 || busy}
            aria-label="Move up"
            className="rounded p-1 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-30 dark:hover:bg-white/10"
          >
            <HiChevronUp className="size-4" />
          </button>
          <button
            type="button"
            onClick={onMoveDown}
            disabled={index === total - 1 || busy}
            aria-label="Move down"
            className="rounded p-1 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-30 dark:hover:bg-white/10"
          >
            <HiChevronDown className="size-4" />
          </button>
          <button
            type="button"
            onClick={onDelete}
            disabled={busy}
            aria-label="Delete"
            className="rounded p-1 text-neutral-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-30 dark:hover:bg-red-500/10"
          >
            <HiTrash className="size-4" />
          </button>
        </div>
      </div>
      {children}
    </div>
  );
}
