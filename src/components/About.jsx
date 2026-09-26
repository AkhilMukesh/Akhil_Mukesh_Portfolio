import { motion } from 'framer-motion';
import { getYearsOfExperienceLabel } from '../utils/experience';
import SectionBadge from './SectionBadge';
import { SCROLL_MARGIN_CLASS } from '../constants/layout';
import profileFallback from '../data/profile';
import { useContent } from '../context/ContentContext';
import { useRevealOnce } from '../hooks/useRevealOnce';

export default function About() {
  const { profile = profileFallback } = useContent();
  const [ref, inView] = useRevealOnce();
  const years = getYearsOfExperienceLabel();

  return (
    <section
      id="about"
      className={`${SCROLL_MARGIN_CLASS} bg-stone-50/80 dark:bg-ink-900/30`}
      aria-label="About me"
    >
      <motion.div
        className="section-container"
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="mb-12 md:mb-16">
          <SectionBadge align="left">About</SectionBadge>
          <h2 className="section-title text-left">A bit more about me</h2>
          <p className="section-subtitle text-left">
            The longer version — how I got here and what makes me tick.
          </p>
        </div>

        <div className="grid items-start gap-12 md:grid-cols-2 md:gap-16">
          <div className="max-w-prose space-y-5 text-[15px] leading-relaxed text-neutral-600 dark:text-glow-100/60 md:text-base">
            {profile.about.map((para, i) => (
              <p key={i}>{para.replace('{years}', years)}</p>
            ))}
          </div>

          <div className="space-y-4">
            {[
              { label: 'Based in', value: 'Bengaluru, India' },
              { label: 'Experience', value: `${years} years` },
              { label: 'Currently', value: 'TCS · IF P&C Insurance' },
              { label: 'Focus', value: 'Full stack · Java, Python, Angular/React, AI' },
              { label: 'Domains', value: 'Supply chain · Insurance · Banking and Finance' },
              { label: 'Education', value: profile.education.degree },
              { label: 'Availability', value: 'Open to new roles' },
            ].map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: 20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.4, delay: 0.1 * index, ease: 'easeOut' }}
                className="flex items-center gap-4 rounded-2xl border border-neutral-200/90 bg-white p-4
                           dark:border-white/[0.08] dark:bg-ink-900/50"
              >
                <span className="w-32 shrink-0 text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-glow-100/50">
                  {item.label}
                </span>
                <span className="text-sm font-medium text-neutral-900 dark:text-glow-100">
                  {item.value}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
