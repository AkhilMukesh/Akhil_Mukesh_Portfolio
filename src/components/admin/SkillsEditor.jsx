import { useEffect, useState } from 'react';
import { HiPlus, HiXMark } from 'react-icons/hi2';
import { useContent } from '../../context/ContentContext';
import { useCrud } from '../../hooks/useCrud';
import { ICON_KEYS, iconForKey, FALLBACK_ICON_KEY } from '../../data/iconMap';
import EditorCard from './EditorCard';
import { InlineText, Field } from './inline';
import { moveInList } from './reorder';

/**
 * One editable skill row. `onCommit(nextItem)` persists the whole item.
 * Name + color use local draft state and commit on blur (color drags and
 * keystrokes would otherwise fire a DB write per event); icon commits on
 * change since it's a single discrete pick.
 */
function SkillItemRow({ item, onCommit, onRemove }) {
  const [name, setName] = useState(item.name);
  const [color, setColor] = useState(item.color || '#14B8A6');
  useEffect(() => setName(item.name), [item.name]);
  useEffect(() => setColor(item.color || '#14B8A6'), [item.color]);

  const Icon = iconForKey(item.icon);
  const iconKey = ICON_KEYS.includes(item.icon) ? item.icon : FALLBACK_ICON_KEY;

  return (
    <div className="flex items-center gap-2 rounded-lg border border-neutral-200 px-2 py-1.5 dark:border-white/10">
      <Icon className="size-5 shrink-0" style={{ color }} aria-hidden />
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={() => name.trim() !== item.name && onCommit({ ...item, name: name.trim() })}
        onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
        placeholder="Skill name"
        className="w-32 flex-1 bg-transparent text-sm text-neutral-800 outline-none dark:text-glow-100/80"
      />
      <select
        value={iconKey}
        onChange={(e) => onCommit({ ...item, icon: e.target.value })}
        className="max-w-[9rem] rounded border border-neutral-200 bg-white px-1 py-0.5 font-mono text-xs dark:border-white/10 dark:bg-ink-800 dark:text-glow-100/70"
        aria-label="Icon"
      >
        {ICON_KEYS.map((k) => (
          <option key={k} value={k}>
            {k}
          </option>
        ))}
      </select>
      <input
        type="color"
        value={color}
        onChange={(e) => setColor(e.target.value)}
        onBlur={() => color !== item.color && onCommit({ ...item, color })}
        className="size-6 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0"
        aria-label="Brand color"
      />
      <button
        type="button"
        onClick={onRemove}
        aria-label="Remove skill"
        className="text-neutral-300 transition hover:text-red-500"
      >
        <HiXMark className="size-4" />
      </button>
    </div>
  );
}

export default function SkillsEditor({ notify }) {
  const { skills } = useContent();
  const { create, update, remove, reorder, busy } = useCrud('skill_groups');

  const onAddGroup = async () => {
    const { error } = await create({ category: 'New group', items: [], sort_order: skills.length });
    notify(error ? `Couldn't add: ${error.message}` : 'Group added');
  };

  const saveItems = async (id, items, ok = 'Saved') => {
    const { error } = await update(id, { items });
    notify(error ? `Save failed: ${error.message}` : ok);
  };

  const saveCategory = async (id, category) => {
    const { error } = await update(id, { category });
    notify(error ? `Save failed: ${error.message}` : 'Category renamed');
  };

  const onDelete = async (id, category) => {
    if (!window.confirm(`Delete the “${category}” group and all its skills?`)) return;
    const { error } = await remove(id);
    notify(error ? `Delete failed: ${error.message}` : 'Group deleted');
  };

  const onMove = async (from, to) => {
    const ids = moveInList(skills, from, to).map((g) => g.id);
    const { error } = await reorder(ids);
    if (error) notify(`Reorder failed: ${error.message}`);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-500 dark:text-glow-100/55">
          {skills.length} group{skills.length !== 1 && 's'} · each skill has an icon + brand color.
        </p>
        <button
          type="button"
          onClick={onAddGroup}
          disabled={busy}
          className="inline-flex items-center gap-1.5 rounded-full bg-neutral-950 px-3.5 py-1.5 text-sm font-semibold text-white transition hover:bg-neutral-800 disabled:opacity-60 dark:bg-white dark:text-neutral-950"
        >
          <HiPlus className="size-4" /> Add group
        </button>
      </div>

      {skills.map((group, i) => {
        const setItem = (idx, next) =>
          saveItems(
            group.id,
            group.items.map((it, j) => (j === idx ? next : it)),
            'Skill updated',
          );
        const removeItem = (idx) =>
          saveItems(group.id, group.items.filter((_, j) => j !== idx), 'Skill removed');
        const addItem = () =>
          saveItems(
            group.id,
            [...group.items, { name: 'New skill', icon: FALLBACK_ICON_KEY, color: '#14B8A6' }],
            'Skill added',
          );

        return (
          <EditorCard
            key={group.id}
            title="Group"
            index={i}
            total={skills.length}
            busy={busy}
            onMoveUp={() => onMove(i, i - 1)}
            onMoveDown={() => onMove(i, i + 1)}
            onDelete={() => onDelete(group.id, group.category)}
          >
            <div className="space-y-3">
              <Field label="Category name">
                <InlineText
                  value={group.category}
                  onCommit={(v) => saveCategory(group.id, v)}
                  className="text-base font-semibold"
                />
              </Field>

              <Field label="Skills">
                <div className="grid gap-2 sm:grid-cols-2">
                  {group.items.map((item, idx) => (
                    <SkillItemRow
                      key={idx}
                      item={item}
                      onCommit={(next) => setItem(idx, next)}
                      onRemove={() => removeItem(idx)}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={addItem}
                  className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-500 dark:text-primary-400"
                >
                  <HiPlus className="size-3.5" /> Add skill
                </button>
              </Field>
            </div>
          </EditorCard>
        );
      })}
    </div>
  );
}
