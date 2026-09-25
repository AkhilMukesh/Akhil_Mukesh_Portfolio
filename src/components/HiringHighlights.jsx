import { motion } from 'framer-motion';
import {
  HiBolt,
  HiBriefcase,
  HiClock,
  HiGlobeAlt,
} from 'react-icons/hi2';
import { getYearsOfExperienceLabel } from '../utils/experience';
import SectionBadge from './SectionBadge';
import { SCROLL_MARGIN_CLASS } from '../constants/layout';
import profileFallback from '../data/profile';
import { useContent } from '../context/ContentContext';
import { useRevealOnce } from '../hooks/useRevealOnce';

// Presentation only — icon + accent per card, merged with the shared prose in
// profile.highlights (same order). Text lives in profile.js; look lives here.
const CARD_STYLE = [
  { Icon: HiBolt, accent: 'border-l-[3px] border-l-teal-500 dark:border-l-teal-400' },
  { Icon: HiClock, accent: 'border-l-[3px] border-l-violet-500 dark:border-l-violet-400' },
  { Icon: HiBriefcase, accent: 'border-l-[3px] border-l-amber-500 dark:border-l-amber-400' },
  { Icon: HiGlobeAlt, accent: 'border-l-[3px] border-l-sky-500 dark:border-l-sky-400' },
];

/** Light intro cards — the kind of things I'd say if you asked about me in person. */
export default function HiringHighlights() {
  const { profile = profileFallback } = useContent();
  const [ref, inView] = useRevealOnce();
  const years = getYearsOfExperienceLabel();

  const tiles = profile.highlights.map((h, i) => ({
    ...CARD_STYLE[i % CARD_STYLE.length],
    ...h,
    stat: h.stat.replace('{years}', years),
  }));

  return (
    <section
      id="highlights"
      className={`${SCROLL_MARGIN_CLASS} border-y border-neutral-200/80 bg-neutral-50/90 dark:border-white/[0.06] dark:bg-ink-900/40`}
      aria-label="Quick summary"
    >
      <div className="section-container !py-16 md:!py-20" ref={ref}>
        <div className="mb-10 md:mb-14">
          <SectionBadge align="left">Quick intro</SectionBadge>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-neutral-950 md:text-4xl dark:text-white">
            The short version
          </h2>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-neutral-600 dark:text-glow-100/55 md:text-lg">
            Four things that tell you if we&apos;re a good fit.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map((tile, i) => {
            const Icon = tile.Icon;
            return (
            <motion.article
              key={tile.eyebrow}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.06 * i, ease: [0.22, 1, 0.36, 1] }}
              className={`flex flex-col rounded-2xl border border-neutral-200/90 bg-white p-5 pl-4 shadow-sm dark:border-white/[0.08] dark:bg-ink-950/80 ${tile.accent}`}
            >
              <div className="flex items-center gap-2 text-neutral-500 dark:text-glow-100/45">
                <Icon className="size-5 shrink-0" aria-hidden />
                <span className="text-[11px] font-semibold uppercase tracking-[0.14em]">
                  {tile.eyebrow}
                </span>
              </div>
              <p className="mt-3 font-display text-xl font-semibold tracking-tight text-neutral-950 dark:text-white">
                {tile.stat}
              </p>
              <p className="mt-1 text-sm font-medium text-neutral-600 dark:text-glow-100/65">
                {tile.hint}
              </p>
              <p className="mt-3 text-sm leading-snug text-neutral-500 dark:text-glow-100/50">
                {tile.detail}
              </p>
            </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
