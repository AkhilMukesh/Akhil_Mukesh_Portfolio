import { useCallback, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useContent } from '../context/ContentContext';

/**
 * Generic CRUD helper for a single Supabase table, tuned for the admin editor.
 *
 * Every mutation re-pulls content via ContentProvider.refresh() so the public
 * site and the editor stay in sync from one source of truth. `busy` and
 * `error` drive button spinners / toasts in the UI.
 *
 * @param {string} table  e.g. 'projects'
 */
export function useCrud(table) {
  const { refresh } = useContent();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);

  const run = useCallback(
    async (fn) => {
      if (!supabase) {
        const e = new Error('Supabase is not configured.');
        setError(e);
        return { error: e };
      }
      setBusy(true);
      setError(null);
      try {
        const { data, error: err } = await fn();
        if (err) throw err;
        await refresh();
        return { data };
      } catch (err) {
        setError(err);
        return { error: err };
      } finally {
        setBusy(false);
      }
    },
    [refresh],
  );

  const create = useCallback(
    (row) => run(() => supabase.from(table).insert(row).select().single()),
    [run, table],
  );

  const update = useCallback(
    (id, patch) => run(() => supabase.from(table).update(patch).eq('id', id).select().single()),
    [run, table],
  );

  const remove = useCallback(
    (id) => run(() => supabase.from(table).delete().eq('id', id).select().maybeSingle()),
    [run, table],
  );

  /**
   * Write a patch to a single-row ("singleton") table such as `profile`.
   * Upserts on the `singleton` column so the first save creates the row and
   * every later save updates that same row.
   */
  const upsertSingleton = useCallback(
    (patch) =>
      run(() =>
        supabase
          .from(table)
          .upsert({ singleton: true, ...patch }, { onConflict: 'singleton' })
          .select()
          .single(),
      ),
    [run, table],
  );

  /**
   * Persist a new ordering. `orderedIds` is the full id list in desired order;
   * we write each row's sort_order to its index.
   */
  const reorder = useCallback(
    (orderedIds) =>
      run(async () => {
        const updates = orderedIds.map((id, i) =>
          supabase.from(table).update({ sort_order: i }).eq('id', id),
        );
        const results = await Promise.all(updates);
        const failed = results.find((r) => r.error);
        return { data: true, error: failed?.error ?? null };
      }),
    [run, table],
  );

  return { create, update, remove, reorder, upsertSingleton, busy, error };
}
