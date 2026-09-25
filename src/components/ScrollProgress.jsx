import { motion, useScroll, useSpring } from 'framer-motion';

/**
 * Thin progress bar pinned to the top of the viewport.
 * Width reflects vertical scroll progress through the page.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX, transformOrigin: '0% 50%' }}
      className="fixed top-0 left-0 right-0 z-[60] h-0.5 origin-left bg-neutral-900/15 dark:bg-white/20 pointer-events-none"
    />
  );
}
