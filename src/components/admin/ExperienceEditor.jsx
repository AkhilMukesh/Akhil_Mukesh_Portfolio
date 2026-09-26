import { HiPlus } from 'react-icons/hi2';
import { useContent } from '../../context/ContentContext';
import { useCrud } from '../../hooks/useCrud';
import EditorCard from './EditorCard';
import { InlineText, TagListEditor, BulletListEditor, Field } from './inline';
import { moveInList } from './reorder';

export default function ExperienceEditor({ notify }) {
  const { experience } = useContent();
  const { create, update, remove, reorder, busy } = useCrud('experience');

  const onAdd = async () => {
    const { error } = await create({
      role: 'New role',
      company: 'Company',
      duration: '',
      location: '',
      highlights: [],
      tech_ai: [],
      tech: [],
      sort_order: experience.length,
    });
    notify(error ? `Couldn't add: ${error.message}` : 'Experience added');
  };

  const save = async (id, patch, ok = 'Saved') => {
    const { error } = await update(id, patch);
    notify(error ? `Save failed: ${error.message}` : ok);
  };

  const onDelete = async (id, role) => {
    if (!window.confirm(`Delete “${role}”? This can't be undone.`)) return;
    const { error } = await remove(id);
    notify(error ? `Delete failed: ${error.message}` : 'Experience deleted');
  };

  const onMove = async (from, to) => {
    const ids = moveInList(experience, from, to).map((e) => e.id);
    const { error } = await reorder(ids);
    if (error) notify(`Reorder failed: ${error.message}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500 dark:text-glow-100/55">
          {experience.length} role{experience.length !== 1 && 's'} · newest first.
        </p>
        <button
          type="button"
          onClick={onAdd}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-full bg-neutral-950 px-3.5 py-1.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-60 dark:bg-white dark:text-neutral-950"
        >
          <HiPlus className="size-4" /> Add role
        </button>
      </div>

      {experience.map((job, i) => (
        <EditorCard
          key={job.id}
          title="Role"
          index={i}
          total={experience.length}
          busy={busy}
          onMoveUp={() => onMove(i, i - 1)}
          onMoveDown={() => onMove(i, i + 1)}
          onDelete={() => onDelete(job.id, job.role)}
        >
          <div className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Role">
                <InlineText
                  value={job.role}
                  onCommit={(v) => save(job.id, { role: v })}
                  className="text-base font-semibold"
                />
              </Field>
              <Field label="Company">
                <InlineText value={job.company} onCommit={(v) => save(job.id, { company: v })} />
              </Field>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Field label="Duration">
                <InlineText
                  value={job.duration}
                  mono
                  placeholder="Aug 2023 – Present"
                  onCommit={(v) => save(job.id, { duration: v })}
                />
              </Field>
              <Field label="Location">
                <InlineText
                  value={job.location}
                  placeholder="Hyderabad, India"
                  onCommit={(v) => save(job.id, { location: v })}
                />
              </Field>
              <Field label="Client (optional)">
                <InlineText
                  value={job.client ?? ''}
                  placeholder="Client name"
                  onCommit={(v) => save(job.id, { client: v || null })}
                />
              </Field>
              <Field label="Website URL (optional)">
                <InlineText
                  value={job.website ?? ''}
                  placeholder="https://example.com"
                  onCommit={(v) => save(job.id, { website: v || null })}
                />
              </Field>
            </div>

            <Field label="Highlights">
              <BulletListEditor
                items={job.highlights}
                onChange={(h) => save(job.id, { highlights: h }, 'Highlights updated')}
              />
            </Field>

            <Field label="AI stack (accent chips, shown first)">
              <TagListEditor
                tags={job.techAI ?? []}
                onChange={(t) => save(job.id, { tech_ai: t }, 'AI stack updated')}
              />
            </Field>

            <Field label="Tech">
              <TagListEditor
                tags={job.tech}
                onChange={(t) => save(job.id, { tech: t }, 'Tech updated')}
              />
            </Field>
          </div>
        </EditorCard>
      ))}
    </div>
  );
}
