/**
 * Return a new array with the item at `from` moved to index `to`.
 * Out-of-range moves are clamped to a no-op (returns the original order).
 */
export function moveInList(list, from, to) {
  if (to < 0 || to >= list.length || from === to) return [...list];
  const next = [...list];
  const [moved] = next.splice(from, 1);
  next.splice(to, 0, moved);
  return next;
}
