import { motion } from 'framer-motion';
import { HiArrowTopRightOnSquare, HiBriefcase, HiMapPin } from 'react-icons/hi2';
import { useContent } from '../context/ContentContext';
import SectionBadge from './SectionBadge';
import { SCROLL_MARGIN_CLASS } from '../constants/layout';
import { useRevealOnce } from '../hooks/useRevealOnce';

const getWebsiteHref = (value) => {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.href : null;
  } catch {
    return null;
  }
};

export default function Experience() {
  const { experience } = useContent();
  const [ref, inView] = useRevealOnce();

  return (
    <section
      id="experience"
      className={`${SCROLL_MARGIN_CLASS} bg-stone-50/80 dark:bg-ink-900/30`}
      aria-label="Work experience"
    >
      <motion.div
        ref={ref}
        className="section-container"
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="mb-12 md:mb-16">
          <SectionBadge align="left">Experience</SectionBadge>
          <h2 className="section-title text-left">Where I&apos;ve worked</h2>
          <p className="section-subtitle !mb-0 max-w-2xl text-left">
            A quick timeline of the teams and systems I&apos;ve been part of.
          </p>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-gray-200 dark:bg-ink-800" />

          <div className="space-y-10">
            {experience.map((job, index) => {
              const websiteHref = getWebsiteHref(job.website);
              return (
              <motion.div
                key={job.id ?? `${job.company}-${job.role}`}
                initial={{ opacity: 0, x: -20 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.15 * index, ease: 'easeOut' }}
                className="relative pl-12 md:pl-16"
              >
                {/* Timeline dot — md offset uses arbitrary value (no left-4.5 in Tailwind) */}
                <div className="absolute left-2.5 md:left-[1.125rem] top-1 w-3 h-3 rounded-full
                                bg-primary-500 ring-4 ring-white dark:ring-ink-950" />

                <div
                  className="card card-glow"
                  style={{ '--glow-duration': `${11 + index * 3}s` }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-3">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <HiBriefcase className="w-4 h-4 text-primary-500 shrink-0" />
                        {job.role}
                      </h3>
                      <p className="text-sm text-primary-600 dark:text-primary-400 font-medium">
                        {job.company}
                      </p>
                      {websiteHref && (
                        <a
                          href={websiteHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-primary-600 underline-offset-2 hover:underline dark:text-primary-400"
                          aria-label={`Visit ${job.company} website (opens in a new tab)`}
                        >
                          Visit website
                          <HiArrowTopRightOnSquare className="size-3" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-glow-100/40 space-y-0.5 sm:text-right">
                      <p className="font-mono">{job.duration}</p>
                      <p className="flex items-center gap-1 sm:justify-end">
                        <HiMapPin className="w-3 h-3" />
                        {job.location}
                      </p>
                    </div>
                  </div>

                  {job.client && (
                    <p className="mb-3 flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="text-gray-400 dark:text-glow-100/40">Client</span>
                      <span className="font-semibold text-gray-700 dark:text-glow-100/80">
                        {job.client}
                      </span>
                    </p>
                  )}

                  <ul className="space-y-2 mb-4" role="list">
                    {job.highlights.map((highlight, i) => (
                      <li
                        key={i}
                        className="text-sm text-gray-600 dark:text-glow-100/55 leading-relaxed
                                   flex items-start gap-2"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-glow-200/30 mt-1.5 shrink-0" />
                        {highlight}
                      </li>
                    ))}
                  </ul>

                  {((job.techAI && job.techAI.length > 0) || (job.tech && job.tech.length > 0)) && (
                    <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-gray-200 dark:border-glow-200/[0.08]">
                      {job.techAI?.map((t) => (
                        <span
                          key={t}
                          className="text-xs px-2 py-0.5 rounded font-mono ring-1 ring-inset
                                     bg-[#E20074]/10 text-[#E20074] ring-[#E20074]/25
                                     dark:bg-[#E20074]/15 dark:text-[#f472b6] dark:ring-[#E20074]/35"
                        >
                          {t}
                        </span>
                      ))}

                      {/* Divider — color, not a heading, separates AI stack from the rest */}
                      {job.techAI?.length > 0 && job.tech?.length > 0 && (
                        <span
                          aria-hidden="true"
                          className="self-stretch w-px bg-gray-300 dark:bg-glow-200/20 mx-1"
                        />
                      )}

                      {job.tech?.map((t) => (
                        <span
                          key={t}
                          className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-ink-800
                                     text-gray-600 dark:text-glow-100/55 font-mono"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
