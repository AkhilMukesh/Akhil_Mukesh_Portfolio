import { motion } from 'framer-motion';
import { HiAcademicCap, HiArrowTopRightOnSquare } from 'react-icons/hi2';
import { useContent } from '../context/ContentContext';
import SectionBadge from './SectionBadge';
import { SCROLL_MARGIN_CLASS } from '../constants/layout';
import { useRevealOnce } from '../hooks/useRevealOnce';

export default function Certifications() {
  const { certifications } = useContent();
  const [ref, inView] = useRevealOnce();
  const isEmpty = !certifications || certifications.length === 0;

  return (
    <section
      id="certifications"
      className={`${SCROLL_MARGIN_CLASS} bg-white dark:bg-ink-950`}
      aria-label="Certifications"
    >
      <motion.div
        ref={ref}
        className="section-container"
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="mb-12 md:mb-16">
          <SectionBadge align="left">Learning</SectionBadge>
          <h2 className="section-title text-left">Always learning something</h2>
          <p className="section-subtitle !mb-0 max-w-2xl text-left">
            Courses, certs, and bits of AI tooling I&apos;m picking up in the background.
          </p>
        </div>

        {isEmpty && (
          <div className="card text-center py-12">
            <HiAcademicCap className="w-10 h-10 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-sm text-gray-500 dark:text-glow-100/55">
              Currently deep in LangChain, RAG, and LLM systems — adding proper certs here as I
              finish them.
            </p>
          </div>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id ?? cert.title}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.08 * index, ease: 'easeOut' }}
              style={{ '--glow-duration': `${9 + (index % 4) * 3}s` }}
              className="card card-glow group"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/20 shrink-0">
                  <HiAcademicCap className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold leading-snug mb-1">{cert.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-glow-100/55">{cert.issuer}</p>
                  {cert.detail && (
                    <p className="mt-1 text-xs leading-relaxed text-gray-400 dark:text-glow-100/40">
                      {cert.detail}
                    </p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-400 dark:text-glow-100/40 font-mono">
                      {cert.date}
                    </span>
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`View credential for ${cert.title}`}
                      className="text-gray-400 hover:text-primary-500 transition-colors"
                    >
                      <HiArrowTopRightOnSquare className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
