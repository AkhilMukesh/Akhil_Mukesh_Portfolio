import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { HiArrowUp } from 'react-icons/hi2';

/**
 * Floating "back to top" button.
 * Appears after the user scrolls past the first viewport.
 */
export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll back to top"
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-40 rounded-full bg-neutral-900 p-3
                     text-white shadow-lg shadow-black/15 transition-colors
                     hover:bg-neutral-800 focus-visible:outline focus-visible:outline-2
                     focus-visible:outline-offset-2 focus-visible:outline-teal-400
                     active:scale-[0.98] dark:bg-white dark:text-black dark:hover:bg-white/90"
        >
          <HiArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
