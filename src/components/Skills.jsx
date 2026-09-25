import { motion } from 'framer-motion';
import { useContent } from '../context/ContentContext';
import { iconForKey } from '../data/iconMap';
import SectionBadge from './SectionBadge';
import { SCROLL_MARGIN_CLASS } from '../constants/layout';
import { useRevealOnce } from '../hooks/useRevealOnce';

// Framer Motion variants — stagger each skill icon in one-by-one
const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.8 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 260,
      damping: 22,
    },
  },
};

const headingVariants = {
  hidden: { opacity: 0, x: -12 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export default function Skills() {
  const { skills } = useContent();
  const [ref, inView] = useRevealOnce();

  return (
    <section
      id="skills"
      className={`${SCROLL_MARGIN_CLASS} bg-white dark:bg-ink-950`}
      aria-label="Technical skills"
    >
      <motion.div
        ref={ref}
        className="section-container"
        initial={{ opacity: 0, y: 40 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="mb-12 md:mb-16">
          <SectionBadge align="left">Tools</SectionBadge>
          <h2 className="section-title text-left">My toolbox</h2>
          <p className="section-subtitle !mb-0 max-w-2xl text-left">
            Stuff I reach for day to day. AI tooling first, then the backend, cloud, and frontend
            bits I&apos;ve used for years.
          </p>
        </div>

        <div className="space-y-10">
          {skills.map((group, groupIndex) => (
            <motion.div
              key={group.id ?? group.category}
              initial="hidden"
              animate={inView ? 'show' : 'hidden'}
              variants={containerVariants}
              transition={{ delay: 0.15 * groupIndex }}
            >
              <motion.h3
                className="skill-category-heading"
                variants={headingVariants}
              >
                <span className="skill-category-bar" aria-hidden="true" />
                {group.category}
              </motion.h3>

              <motion.div
                className="flex flex-wrap gap-x-6 gap-y-5"
                variants={containerVariants}
              >
                {group.items.map((skill, i) => {
                  const Icon = iconForKey(skill.icon);
                  // Stagger the idle float so icons don't bob in sync
                  const floatDelay = `${(i * 0.25) % 4}s`;
                  return (
                    <motion.div
                      key={skill.name}
                      className="skill-item group"
                      variants={itemVariants}
                      whileHover={{ y: -4 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                    >
                      <div
                        className="skill-icon-float"
                        style={{
                          '--brand': skill.color,
                          '--float-delay': floatDelay,
                        }}
                      >
                        <Icon
                          className="h-6 w-6 transition-transform duration-200 group-hover:scale-110 sm:h-7 sm:w-7"
                          style={{ color: skill.color }}
                        />
                      </div>
                      <span>{skill.name}</span>
                    </motion.div>
                  );
                })}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
