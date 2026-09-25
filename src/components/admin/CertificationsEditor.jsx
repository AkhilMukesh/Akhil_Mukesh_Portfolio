import { HiPlus } from 'react-icons/hi2';
import { useContent } from '../../context/ContentContext';
import { useCrud } from '../../hooks/useCrud';
import EditorCard from './EditorCard';
import { InlineText, InlineTextarea, Field } from './inline';
import { moveInList } from './reorder';

export default function CertificationsEditor({ notify }) {
  const { certifications } = useContent();
  const { create, update, remove, reorder, busy } = useCrud('certifications');

  const onAdd = async () => {
    const { error } = await create({
      title: 'New certification',
      issuer: '',
      date: `${new Date().getFullYear()}`,
      credential_url: '#',
      sort_order: certifications.length,
    });
    notify(error ? `Couldn't add: ${error.message}` : 'Certification added');
  };

  const save = async (id, patch, ok = 'Saved') => {
    const { error } = await update(id, patch);
    notify(error ? `Save failed: ${error.message}` : ok);
  };

  const onDelete = async (id, title) => {
    if (!window.confirm(`Delete “${title}”?`)) return;
    const { error } = await remove(id);
    notify(error ? `Delete failed: ${error.message}` : 'Certification deleted');
  };

  const onMove = async (from, to) => {
    const ids = moveInList(certifications, from, to).map((c) => c.id);
    const { error } = await reorder(ids);
    if (error) notify(`Reorder failed: ${error.message}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500 dark:text-glow-100/55">
          {certifications.length} cert{certifications.length !== 1 && 's'}.
        </p>
        <button
          type="button"
          onClick={onAdd}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-full bg-neutral-950 px-3.5 py-1.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-60 dark:bg-white dark:text-neutral-950"
        >
          <HiPlus className="size-4" /> Add certification
        </button>
      </div>

      {certifications.map((c, i) => (
        <EditorCard
          key={c.id}
          title="Certification"
          index={i}
          total={certifications.length}
          busy={busy}
          onMoveUp={() => onMove(i, i - 1)}
          onMoveDown={() => onMove(i, i + 1)}
          onDelete={() => onDelete(c.id, c.title)}
        >
          <div className="space-y-3">
            <Field label="Title">
              <InlineText
                value={c.title}
                onCommit={(v) => save(c.id, { title: v })}
                className="font-semibold"
              />
            </Field>
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Issuer">
                <InlineText value={c.issuer} onCommit={(v) => save(c.id, { issuer: v })} />
              </Field>
              <Field label="Date">
                <InlineText value={c.date} mono onCommit={(v) => save(c.id, { date: v })} />
              </Field>
            </div>
            <Field label="Detail (optional — e.g. courses in a specialization)">
              <InlineTextarea
                value={c.detail ?? ''}
                rows={2}
                placeholder="Course A · Course B · Course C"
                onCommit={(v) => save(c.id, { detail: v || null })}
              />
            </Field>
            <Field label="Credential URL">
              <InlineText
                value={c.credentialUrl === '#' ? '' : c.credentialUrl}
                mono
                placeholder="https://…"
                onCommit={(v) => save(c.id, { credential_url: v || '#' })}
              />
            </Field>
          </div>
        </EditorCard>
      ))}
    </div>
  );
}
