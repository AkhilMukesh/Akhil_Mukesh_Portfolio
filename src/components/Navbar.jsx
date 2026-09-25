import { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import { motion, AnimatePresence } from 'framer-motion';
import { HiSun, HiMoon, HiBars3, HiXMark } from 'react-icons/hi2';
import { SCROLL_OFFSET } from '../constants/layout';

// Short labels keep the bar scannable; every section still exists in the page.
const navLinks = [
  { to: 'highlights', label: 'Intro' },
  { to: 'about', label: 'About' },
  { to: 'projects', label: 'Projects' },
  { to: 'skills', label: 'Tools' },
  { to: 'experience', label: 'Experience' },
  { to: 'certifications', label: 'Certs' },
  { to: 'contact', label: 'Contact' },
];

/**
 * Full-width top bar: predictable hit targets, high contrast, works on any section background.
 */
export default function Navbar({ isDark, toggleTheme }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  const barSurface =
    scrolled || mobileOpen
      ? 'border-neutral-200/90 bg-white/90 shadow-sm shadow-black/[0.03] dark:border-white/[0.08] dark:bg-ink-950/90'
      : 'border-transparent bg-white/80 dark:bg-ink-950/80';

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[70] border-b backdrop-blur-md transition-[background-color,box-shadow,border-color] duration-300 ${barSurface}`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          to="hero"
          smooth
          duration={500}
          offset={SCROLL_OFFSET}
          className="group flex shrink-0 cursor-pointer items-center gap-2"
          aria-label="Khaza Shaik — back to top"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-900 text-sm font-semibold text-white dark:bg-white dark:text-neutral-950">
            KS
          </span>
          <span className="hidden font-medium tracking-tight text-neutral-900 dark:text-white sm:block">
            Khaza Shaik
          </span>
        </Link>

        <nav
          className="hidden items-center gap-0.5 text-[13px] lg:flex lg:gap-1 lg:text-sm"
          role="navigation"
          aria-label="Main"
        >
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              smooth
              offset={SCROLL_OFFSET}
              duration={500}
              spy
              activeClass="navlink-active"
              className="cursor-pointer rounded-lg px-2.5 py-2 font-medium text-neutral-600 transition-colors hover:text-neutral-950 dark:text-glow-100/60 dark:hover:text-glow-100 lg:px-3"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 transition-colors hover:bg-neutral-100 dark:text-glow-100/70 dark:hover:bg-white/10"
          >
            {isDark ? <HiSun className="size-5" /> : <HiMoon className="size-5" />}
          </button>
            <Link
            to="contact"
            smooth
            offset={SCROLL_OFFSET}
            duration={500}
            className="hidden cursor-pointer rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 sm:inline-block dark:bg-white dark:text-neutral-950 dark:hover:bg-white/90"
          >
            Let&apos;s talk
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-700 dark:text-glow-100 lg:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <HiXMark className="size-6" /> : <HiBars3 className="size-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 top-16 z-40 bg-black/30 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
              aria-hidden
            />
            <motion.nav
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="border-b border-neutral-200 bg-white dark:border-white/10 dark:bg-ink-950 lg:hidden"
              role="navigation"
              aria-label="Mobile"
            >
              <div className="space-y-0.5 px-4 py-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    smooth
                    offset={SCROLL_OFFSET}
                    duration={500}
                    onClick={() => setMobileOpen(false)}
                    className="block cursor-pointer rounded-lg py-2.5 text-center text-base font-medium text-neutral-800 dark:text-glow-100"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  to="contact"
                  smooth
                  offset={SCROLL_OFFSET}
                  duration={500}
                  onClick={() => setMobileOpen(false)}
                  className="mt-2 block cursor-pointer rounded-full bg-neutral-900 py-3 text-center text-sm font-medium text-white dark:bg-white dark:text-neutral-950"
                >
                  Let&apos;s talk
                </Link>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
