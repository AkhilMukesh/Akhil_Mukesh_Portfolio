import { HiPlus, HiTrash } from 'react-icons/hi2';
import { useContent } from '../../context/ContentContext';
import { useCrud } from '../../hooks/useCrud';
import EditorCard from './EditorCard';
import { InlineText, InlineTextarea, Field } from './inline';

/**
 * ProfileEditor — the one-row `profile` table: identity, contact, and all the
 * free-text prose shared by the hero, About section and the résumé.
 *
 * Unlike the list editors there's nothing to add or reorder, so this saves via
 * upsertSingleton: the first write creates the row, later writes update it.
 * Fields left blank fall back to src/data/profile.js at render time.
 */
export default function ProfileEditor({ notify }) {
  const { profile } = useContent();
  const { upsertSingleton, busy } = useCrud('profile');

  const save = async (patch, ok = 'Saved') => {
    const { error } = await upsertSingleton(patch);
    notify(error ? `Save failed: ${error.message}` : ok);
  };

  // hero / education are jsonb objects — patch one key without losing the rest.
  const saveHero = (key, v) => save({ hero: { ...(profile.hero ?? {}), [key]: v } }, 'Hero updated');
  const saveEdu = (key, v) =>
    save({ education: { ...(profile.education ?? {}), [key]: v } }, 'Education updated');

  const about = Array.isArray(profile.about) ? profile.about : [];
  const highlights = Array.isArray(profile.highlights) ? profile.highlights : [];

  const saveAbout = (next) => save({ about: next }, 'About updated');
  const saveHighlights = (next) => save({ highlights: next }, 'Highlights updated');

  return (
    <div className="space-y-4">
      <p className="text-sm text-neutral-500 dark:text-glow-100/55">
        Shared by the site header, About section and the résumé. Blank fields fall back to the
        built-in defaults.
      </p>

      {/* ---------------- identity + contact ---------------- */}
      <EditorCard title="Identity & contact" busy={busy}>
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Name">
              <InlineText
                value={profile.name ?? ''}
                onCommit={(v) => save({ name: v })}
                className="text-base font-semibold"
              />
            </Field>
            <Field label="Title (headline under your name)">
              <InlineText value={profile.title ?? ''} onCommit={(v) => save({ title: v })} />
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Field label="Location">
              <InlineText value={profile.location ?? ''} onCommit={(v) => save({ location: v })} />
            </Field>
            <Field label="Email">
              <InlineText value={profile.email ?? ''} onCommit={(v) => save({ email: v })} />
            </Field>
            <Field label="Phone">
              <InlineText value={profile.phone ?? ''} mono onCommit={(v) => save({ phone: v })} />
            </Field>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="LinkedIn (display text)">
              <InlineText value={profile.linkedin ?? ''} onCommit={(v) => save({ linkedin: v })} />
            </Field>
            <Field label="LinkedIn URL">
              <InlineText
                value={profile.linkedinUrl ?? ''}
                mono
                onCommit={(v) => save({ linkedin_url: v })}
              />
            </Field>
            <Field label="GitHub (display text)">
              <InlineText value={profile.github ?? ''} onCommit={(v) => save({ github: v })} />
            </Field>
            <Field label="GitHub URL">
              <InlineText
                value={profile.githubUrl ?? ''}
                mono
                onCommit={(v) => save({ github_url: v })}
              />
            </Field>
          </div>
        </div>
      </EditorCard>

      {/* ---------------- résumé summary ---------------- */}
      <EditorCard title="Résumé summary" busy={busy}>
        <Field label="One-paragraph pitch (top of the résumé)">
          <InlineTextarea
            value={profile.summary ?? ''}
            rows={6}
            onCommit={(v) => save({ summary: v }, 'Summary updated')}
          />
        </Field>
      </EditorCard>

      {/* ---------------- hero ---------------- */}
      <EditorCard title="Hero (website)" busy={busy}>
        <div className="space-y-3">
          <Field label="Lead label (bold role phrase)">
            <InlineText
              value={profile.hero?.leadLabel ?? ''}
              onCommit={(v) => saveHero('leadLabel', v)}
            />
          </Field>
          <Field label="Tagline (continues the sentence after the lead label)">
            <InlineTextarea
              value={profile.hero?.tagline ?? ''}
              rows={3}
              onCommit={(v) => saveHero('tagline', v)}
            />
          </Field>
          <Field label="Sub-paragraph">
            <InlineTextarea
              value={profile.hero?.sub ?? ''}
              rows={4}
              onCommit={(v) => saveHero('sub', v)}
            />
          </Field>
        </div>
      </EditorCard>

      {/* ---------------- about paragraphs ---------------- */}
      <EditorCard title="About paragraphs" busy={busy}>
        <div className="space-y-3">
          <p className="text-xs text-neutral-500 dark:text-glow-100/45">
            Use <code>{'{years}'}</code> to insert your years of experience automatically.
          </p>
          {about.map((para, i) => (
            <div key={i} className="flex gap-2">
              <div className="flex-1">
                <InlineTextarea
                  value={para}
                  rows={4}
                  onCommit={(v) => {
                    const next = [...about];
                    next[i] = v;
                    saveAbout(next);
                  }}
                />
              </div>
              <button
                type="button"
                aria-label={`Delete paragraph ${i + 1}`}
                onClick={() => saveAbout(about.filter((_, j) => j !== i))}
                disabled={busy}
                className="self-start rounded-lg p-2 text-neutral-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:hover:bg-red-500/10"
              >
                <HiTrash className="size-4" />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => saveAbout([...about, ''])}
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 px-3 py-1.5 text-sm font-medium transition hover:bg-neutral-50 disabled:opacity-60 dark:border-glow-200/20 dark:hover:bg-white/5"
          >
            <HiPlus className="size-4" /> Add paragraph
          </button>
        </div>
      </EditorCard>

      {/* ---------------- highlight cards ---------------- */}
      <EditorCard title="Highlight cards (“The short version”)" busy={busy}>
        <div className="space-y-4">
          {highlights.map((h, i) => {
            const patch = (key, v) => {
              const next = [...highlights];
              next[i] = { ...next[i], [key]: v };
              saveHighlights(next);
            };
            return (
              <div
                key={i}
                className="rounded-xl border border-neutral-200 p-3 dark:border-glow-200/10"
              >
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                    Card {i + 1}
                  </span>
                  <button
                    type="button"
                    aria-label={`Delete card ${i + 1}`}
                    onClick={() => saveHighlights(highlights.filter((_, j) => j !== i))}
                    disabled={busy}
                    className="rounded-lg p-1.5 text-neutral-400 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50 dark:hover:bg-red-500/10"
                  >
                    <HiTrash className="size-4" />
                  </button>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Field label="Eyebrow">
                    <InlineText value={h.eyebrow ?? ''} onCommit={(v) => patch('eyebrow', v)} />
                  </Field>
                  <Field label="Stat (headline)">
                    <InlineText value={h.stat ?? ''} onCommit={(v) => patch('stat', v)} />
                  </Field>
                </div>
                <div className="mt-3 space-y-3">
                  <Field label="Hint">
                    <InlineText value={h.hint ?? ''} onCommit={(v) => patch('hint', v)} />
                  </Field>
                  <Field label="Detail">
                    <InlineTextarea
                      value={h.detail ?? ''}
                      rows={3}
                      onCommit={(v) => patch('detail', v)}
                    />
                  </Field>
                </div>
              </div>
            );
          })}
          <button
            type="button"
            onClick={() =>
              saveHighlights([...highlights, { eyebrow: '', stat: '', hint: '', detail: '' }])
            }
            disabled={busy}
            className="inline-flex items-center gap-1.5 rounded-full border border-neutral-300 px-3 py-1.5 text-sm font-medium transition hover:bg-neutral-50 disabled:opacity-60 dark:border-glow-200/20 dark:hover:bg-white/5"
          >
            <HiPlus className="size-4" /> Add card
          </button>
        </div>
      </EditorCard>

      {/* ---------------- education ---------------- */}
      <EditorCard title="Education" busy={busy}>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Degree">
            <InlineText
              value={profile.education?.degree ?? ''}
              onCommit={(v) => saveEdu('degree', v)}
            />
          </Field>
          <Field label="School">
            <InlineText
              value={profile.education?.school ?? ''}
              onCommit={(v) => saveEdu('school', v)}
            />
          </Field>
        </div>
      </EditorCard>
    </div>
  );
}
