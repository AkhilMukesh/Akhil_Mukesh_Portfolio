import { HiPlus } from 'react-icons/hi2';
import { useContent } from '../../context/ContentContext';
import { useCrud } from '../../hooks/useCrud';
import EditorCard from './EditorCard';
import { InlineText, InlineTextarea, TagListEditor, Field } from './inline';
import { moveInList } from './reorder';

const CATEGORIES = ['AI', 'Enterprise'];

export default function ProjectsEditor({ notify }) {
  const { projects } = useContent();
  const { create, update, remove, reorder, busy } = useCrud('projects');

  const onAdd = async () => {
    const { error } = await create({
      title: 'New project',
      description: '',
      tech: [],
      category: 'AI',
      featured: false,
      has_interactive_demo: false,
      sort_order: projects.length,
    });
    notify(error ? `Couldn't add: ${error.message}` : 'Project added');
  };

  const save = async (id, patch, ok = 'Saved') => {
    const { error } = await update(id, patch);
    notify(error ? `Save failed: ${error.message}` : ok);
  };

  const onDelete = async (id, title) => {
    if (!window.confirm(`Delete “${title}”? This can't be undone.`)) return;
    const { error } = await remove(id);
    notify(error ? `Delete failed: ${error.message}` : 'Project deleted');
  };

  const onMove = async (from, to) => {
    const ids = moveInList(projects, from, to).map((p) => p.id);
    const { error } = await reorder(ids);
    if (error) notify(`Reorder failed: ${error.message}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500 dark:text-glow-100/55">
          {projects.length} project{projects.length !== 1 && 's'} · edits save automatically.
        </p>
        <button
          type="button"
          onClick={onAdd}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-full bg-neutral-950 px-3.5 py-1.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-60 dark:bg-white dark:text-neutral-950"
        >
          <HiPlus className="size-4" /> Add project
        </button>
      </div>

      {projects.map((p, i) => (
        <EditorCard
          key={p.id}
          title="Project"
          index={i}
          total={projects.length}
          busy={busy}
          onMoveUp={() => onMove(i, i - 1)}
          onMoveDown={() => onMove(i, i + 1)}
          onDelete={() => onDelete(p.id, p.title)}
        >
          <div className="space-y-3">
            <Field label="Title">
              <InlineText
                value={p.title}
                onCommit={(v) => save(p.id, { title: v })}
                className="text-base font-semibold"
              />
            </Field>

            <Field label="Description">
              <InlineTextarea
                value={p.description}
                onCommit={(v) => save(p.id, { description: v })}
              />
            </Field>

            <Field label="Tech">
              <TagListEditor tags={p.tech} onChange={(t) => save(p.id, { tech: t }, 'Tech updated')} />
            </Field>

            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="GitHub URL">
                <InlineText
                  value={p.github ?? ''}
                  mono
                  placeholder="https://github.com/…"
                  onCommit={(v) => save(p.id, { github: v || null })}
                />
              </Field>
              <Field label="Live demo URL">
                <InlineText
                  value={p.demo ?? ''}
                  mono
                  placeholder="https://…"
                  onCommit={(v) => save(p.id, { demo: v || null })}
                />
              </Field>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Field label="Category">
                <select
                  value={p.category}
                  onChange={(e) => save(p.id, { category: e.target.value }, 'Category updated')}
                  className="rounded-md border border-neutral-300 bg-white px-2 py-1 text-sm dark:border-white/15 dark:bg-ink-800 dark:text-white"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </Field>

              <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700 dark:text-glow-100/80">
                <input
                  type="checkbox"
                  checked={p.featured}
                  onChange={(e) => save(p.id, { featured: e.target.checked }, 'Updated')}
                  className="size-4 rounded accent-primary-600"
                />
                Featured
              </label>

              <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700 dark:text-glow-100/80">
                <input
                  type="checkbox"
                  checked={p.hasInteractiveDemo}
                  onChange={(e) =>
                    save(p.id, { has_interactive_demo: e.target.checked }, 'Updated')
                  }
                  className="size-4 rounded accent-primary-600"
                />
                Demo simulator
              </label>
            </div>
          </div>
        </EditorCard>
      ))}
    </div>
  );
}
