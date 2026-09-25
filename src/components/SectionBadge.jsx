/**
 * Small kicker above section titles — align with section copy (left) or centered blocks.
 */
export default function SectionBadge({ children, align = 'left', className = '' }) {
  const alignClass = align === 'center' ? 'text-center' : 'text-left';
  return (
    <p
      className={`mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-neutral-500 dark:text-glow-100/50 ${alignClass} ${className}`}
    >
      {children}
    </p>
  );
}
