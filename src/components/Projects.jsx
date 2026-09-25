import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';
import { useContent } from '../context/ContentContext';
import SectionBadge from './SectionBadge';
import { SCROLL_MARGIN_CLASS } from '../constants/layout';
import { useRevealOnce } from '../hooks/useRevealOnce';

// Curated top-level filter tags — AI listed first since I'm targeting AI Eng roles
const FILTER_TAGS = ['All', 'AI', 'Enterprise', 'Featured', 'Java', 'Spring Boot', 'Angular'];

export default function Projects({ onLaunchDemo }) {
  const { projects } = useContent();
  const [ref, inView] = useRevealOnce();
  const [activeFilter, setActiveFilter] = useState('All');

  // Filter logic:
  //   • 'All'                 → everything
  //   • 'Featured'            → only featured projects
  //   • 'AI' / 'Enterprise'   → match by category
  //   • Anything else (tech)  → exact case-insensitive match against the tech list
  //                             (substring matching mistakenly mixed Java with JavaScript)
  const visible = useMemo(() => {
    if (activeFilter === 'All') return projects;
    if (activeFilter === 'Featured') return projects.filter((p) => p.featured);
    if (activeFilter === 'AI' || activeFilter === 'Enterprise') {
      return projects.filter((p) => p.category === activeFilter);
    }
    const target = activeFilter.toLowerCase();
    return projects.filter((p) =>
      p.tech.some((t) => t.toLowerCase() === target),
    );
  }, [activeFilter, projects]);

  return (
    <section
      id="projects"
      className={`${SCROLL_MARGIN_CLASS} bg-stone-50/80 dark:bg-ink-900/30`}
      aria-label="Projects"
    >
      <motion.div
        ref={ref}
        className="section-container"
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="mb-10 md:mb-12">
          <SectionBadge align="left">Projects</SectionBadge>
          <h2 className="section-title text-left">Things I&apos;ve built</h2>
          <p className="section-subtitle !mb-0 max-w-2xl text-left">
            A mix of AI side projects and work from my day job. Filter by whatever&apos;s interesting.
          </p>
        </div>

        {/* Filter chips */}
        <div
          className="mb-10 flex flex-wrap gap-2 md:gap-2"
          role="tablist"
          aria-label="Filter projects by technology"
        >
          {FILTER_TAGS.map((tag) => {
            const isActive = activeFilter === tag;
            return (
              <button
                key={tag}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveFilter(tag)}
                className={`h-8 rounded-full px-3 text-sm font-medium transition-colors active:scale-[0.98] ${
                  isActive
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-black'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70 dark:bg-white/10 dark:text-white dark:hover:bg-white/20'
                }`}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* Project grid with layout animation for filter transitions */}
        <motion.div layout className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {visible.map((project, index) => (
              <motion.article
                layout
                key={project.id ?? project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.35, delay: 0.04 * index, ease: 'easeOut' }}
                // Stagger the rotation duration so cards don't pulse in sync
                style={{ '--glow-duration': `${10 + (index % 3) * 4}s` }}
                className="card card-glow flex flex-col"
              >
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  {project.category === 'AI' && (
                    <span
                      className="badge"
                      style={{
                        backgroundColor: 'rgba(139, 92, 246, 0.12)',
                        color: '#a78bfa',
                      }}
                    >
                      AI · ML
                    </span>
                  )}
                  {project.featured && (
                    <span className="badge">Featured</span>
                  )}
                </div>

                <h3 className="text-lg font-semibold mb-2">{project.title}</h3>

                <p className="text-sm text-gray-500 dark:text-glow-100/55 leading-relaxed mb-4 flex-1">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="text-xs px-2 py-0.5 rounded bg-gray-100 dark:bg-ink-800
                                 text-gray-600 dark:text-glow-100/55 font-mono"
                    >
                      {t}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-3 pt-3 border-t border-gray-200 dark:border-glow-200/[0.08]">
                  {project.github && project.github !== '#' && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`GitHub repository for ${project.title}`}
                      className="text-gray-400 hover:text-gray-900 dark:hover:text-glow-100 transition-colors"
                    >
                      <FaGithub className="w-4 h-4" />
                    </a>
                  )}
                  {project.demo && project.demo !== '#' && (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Live demo for ${project.title}`}
                      className="text-gray-400 hover:text-gray-900 dark:hover:text-glow-100 transition-colors"
                    >
                      <FaExternalLinkAlt className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {project.hasInteractiveDemo && (
                    <button
                      type="button"
                      onClick={() => onLaunchDemo && onLaunchDemo(project.title)}
                      className="ml-auto flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full bg-teal-500/10 text-teal-600 hover:bg-teal-500/20 dark:bg-teal-400/10 dark:text-teal-300 dark:hover:bg-teal-400/20 active:scale-[0.98] transition-all cursor-pointer"
                    >
                      <span>Walkthrough</span>
                      <FaExternalLinkAlt className="w-2.5 h-2.5" />
                    </button>
                  )}
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {visible.length === 0 && (
          <p className="text-center text-sm text-gray-500 dark:text-glow-100/55 py-12">
            No projects match "{activeFilter}".
          </p>
        )}
      </motion.div>
    </section>
  );
}
