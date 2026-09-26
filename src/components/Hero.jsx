import { motion } from 'framer-motion';
import { Link } from 'react-scroll';
import { HiArrowDown, HiEnvelope, HiArrowDownTray } from 'react-icons/hi2';
import { FaGithub, FaLinkedin, FaJava, FaAws } from 'react-icons/fa';
import { SiAngular, SiReact, SiLangchain } from 'react-icons/si';
import { SCROLL_OFFSET } from '../constants/layout';
import ResumeDownloadButton from './resume/ResumeDownloadButton';
import profileFallback from '../data/profile';
import { useContent } from '../context/ContentContext';

const SCAN_TAGS = [
  { label: 'Full stack', Icon: SiReact, color: '#61DAFB' },
  { label: 'Java & Spring', Icon: FaJava, color: '#EA2D2E' },
  { label: 'Angular / React', Icon: SiAngular, color: '#DD0031' },
  { label: 'AWS & cloud', Icon: FaAws, color: '#FF9900' },
  { label: 'AI / LLM', Icon: SiLangchain, color: '#00BB7E' },
];

export default function Hero() {
  // Live profile when Supabase is reachable, static file otherwise.
  const { profile = profileFallback } = useContent();
  return (
    <section
      id="hero"
      className="relative scroll-mt-0 overflow-x-hidden border-b border-neutral-200/70 bg-gradient-to-b from-stone-50 via-white to-white dark:border-white/[0.06] dark:from-ink-950 dark:via-ink-950 dark:to-ink-950"
      aria-label="Introduction"
    >
      <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-24 sm:px-6 sm:pb-20 sm:pt-28 lg:px-8 lg:pb-24">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-14 xl:gap-20">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="text-left"
          >
            <p className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-neutral-500 dark:text-glow-100/45">
              <span>Bengaluru, India</span>
              <span className="hidden text-neutral-300 dark:text-white/25 sm:inline" aria-hidden>
                ·
              </span>
              <span>Available for new roles</span>
            </p>

            <h1 className="font-display mt-4 text-display text-neutral-950 dark:text-white">
              Akhil Mukesh
            </h1>

            <p className="mt-4 max-w-xl text-lg font-medium leading-snug text-neutral-800 dark:text-glow-100/90">
              <span className="text-neutral-950 dark:text-white">{profile.hero.leadLabel}</span>{' '}
              {profile.hero.tagline}
            </p>

            <p className="mt-4 max-w-xl text-pretty text-base leading-relaxed text-neutral-600 dark:text-glow-100/55">
              {profile.hero.sub}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-300/80 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-900 dark:border-emerald-500/35 dark:bg-emerald-500/10 dark:text-emerald-200">
                <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden />
                Open to Full Stack roles
              </span>
              <span className="inline-flex items-center rounded-full border border-neutral-200 bg-white/80 px-3 py-1.5 text-xs font-medium text-neutral-700 dark:border-white/10 dark:bg-white/[0.06] dark:text-glow-100/85">
                Remote · Hybrid · On-site · GCC
              </span>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link
                to="projects"
                smooth
                duration={500}
                offset={SCROLL_OFFSET}
                className="inline-flex h-12 cursor-pointer items-center justify-center rounded-full bg-neutral-950 px-7 text-sm font-semibold text-white shadow-md transition hover:bg-neutral-800 active:scale-[0.98] dark:bg-white dark:text-neutral-950 dark:hover:bg-neutral-200"
              >
                See my work
              </Link>
              <Link
                to="contact"
                smooth
                duration={500}
                offset={SCROLL_OFFSET}
                className="inline-flex h-12 cursor-pointer items-center justify-center rounded-full border border-neutral-300 bg-white px-7 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-50 active:scale-[0.98] dark:border-white/15 dark:bg-transparent dark:text-glow-100 dark:hover:bg-white/5"
              >
                Get in touch
              </Link>
            </div>

            <p className="mt-4 text-xs leading-relaxed text-neutral-500 dark:text-glow-100/40">
              Quick read if you&apos;re short on time: scroll the projects, skim the stack, then
              say hi.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              {SCAN_TAGS.map(({ label, Icon, color }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200/90 bg-white/90 px-3 py-1 text-xs font-medium text-neutral-700 backdrop-blur-sm dark:border-white/10 dark:bg-white/[0.04] dark:text-glow-100/80"
                >
                  <Icon className="size-3.5 shrink-0" style={{ color }} aria-hidden />
                  {label}
                </span>
              ))}
            </div>

          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="w-full lg:mt-8 lg:w-[304px] xl:mt-10 xl:w-[352px]"
          >
            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              <ResumeDownloadButton className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-50 px-4 py-2 text-sm font-semibold text-teal-700 shadow-sm transition hover:-translate-y-0.5 hover:border-teal-500/60 hover:bg-teal-100 active:scale-[0.98] dark:border-teal-400/30 dark:bg-teal-400/10 dark:text-teal-300 dark:hover:bg-teal-400/15" />

              <a
                href={`${import.meta.env.BASE_URL}Akhil-Mukesh-Resume-ATS.docx`}
                download="Khaza-Shaik-Resume.docx"
                aria-label="Download ATS-friendly resume (Word .docx)"
                className="inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-neutral-50 active:scale-[0.98] dark:border-white/15 dark:bg-white/[0.04] dark:text-glow-100 dark:hover:bg-white/10"
              >
                <HiArrowDownTray className="size-4 shrink-0" aria-hidden />
                .docx
              </a>

              <a
                href="https://github.com/khazaShaik"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="inline-flex size-10 items-center justify-center rounded-full border border-neutral-300 bg-white text-neutral-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-neutral-50 active:scale-[0.98] dark:border-white/15 dark:bg-white/[0.04] dark:text-white dark:hover:bg-white/10"
              >
                <FaGithub className="size-[18px]" aria-hidden />
              </a>
              <a
                href="https://linkedin.com/in/khaza-shaik-3344b5157"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex size-10 items-center justify-center rounded-full border border-neutral-300 bg-white shadow-sm transition hover:-translate-y-0.5 hover:bg-neutral-50 active:scale-[0.98] dark:border-white/15 dark:bg-white/[0.04] dark:hover:bg-white/10"
                style={{ color: '#0A66C2' }}
              >
                <FaLinkedin className="size-[18px]" aria-hidden />
              </a>
              <a
                href="mailto:Khazashaik4@gmail.com"
                aria-label="Email"
                className="inline-flex size-10 items-center justify-center rounded-full border border-neutral-300 bg-white shadow-sm transition hover:-translate-y-0.5 hover:bg-neutral-50 active:scale-[0.98] dark:border-white/15 dark:bg-white/[0.04] dark:hover:bg-white/10"
                style={{ color: '#EA4335' }}
              >
                <HiEnvelope className="size-[18px]" aria-hidden />
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 sm:block"
        aria-hidden
      >
        <Link
          to="highlights"
          smooth
          offset={SCROLL_OFFSET}
          duration={500}
          className="pointer-events-auto text-neutral-400 dark:text-glow-100/30"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: 'easeInOut' }}
          >
            <HiArrowDown className="size-5" />
          </motion.div>
        </Link>
      </motion.div>
    </section>
  );
}
