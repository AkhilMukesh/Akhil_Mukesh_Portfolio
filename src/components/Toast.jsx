import { AnimatePresence, motion } from 'framer-motion';
import { HiCheckCircle } from 'react-icons/hi2';

/**
 * Minimal bottom-centered toast notification.
 * Auto-dismiss is controlled by the caller.
 */
export default function Toast({ message, visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="status"
          aria-live="polite"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50
                     flex items-center gap-2 px-4 py-2.5 rounded-lg
                     bg-gray-900 text-white dark:bg-glow-100 dark:text-ink-950
                     shadow-lg text-sm font-medium"
        >
          <HiCheckCircle className="w-4 h-4 text-primary-400 dark:text-primary-600" />
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
