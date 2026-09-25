import { Link } from 'react-scroll';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { HiEnvelope } from 'react-icons/hi2';
import { SCROLL_OFFSET } from '../constants/layout';
import { RouterLink } from '../lib/router';

const footerNav = [
  { to: 'highlights', label: 'Intro' },
  { to: 'about', label: 'About' },
  { to: 'projects', label: 'Projects' },
  { to: 'skills', label: 'Tools' },
  { to: 'experience', label: 'Experience' },
  { to: 'certifications', label: 'Certs' },
  { to: 'contact', label: 'Contact' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      className="border-t border-white/10 bg-neutral-950 text-white"
    >
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/45">
              Portfolio
            </p>
            <p className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
              Khaza Shaik
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/55">
              AI engineer in Hyderabad. Building with LLMs on top of a long career in fullstack and
              backend work. Open to new roles.
            </p>
          </div>

          <div className="sm:pl-4 lg:col-span-3 lg:pl-0">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
              On this page
            </p>
            <ul className="mt-4 space-y-2.5" role="list">
              {footerNav.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    smooth
                    offset={SCROLL_OFFSET}
                    duration={500}
                    className="cursor-pointer text-sm text-white/70 transition hover:text-white"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="sm:pl-4 lg:col-span-4 lg:flex lg:justify-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
                Connect
              </p>
              <div className="mt-4 flex gap-2">
                <a
                  href="https://github.com/khazaShaik"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="rounded-lg p-2.5 text-white/55 transition hover:bg-white/10 hover:text-white"
                >
                  <FaGithub className="size-5" />
                </a>
                <a
                  href="https://linkedin.com/in/khaza-shaik-3344b5157"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="rounded-lg p-2.5 text-white/55 transition hover:bg-white/10 hover:text-white"
                >
                  <FaLinkedin className="size-5" />
                </a>
                <a
                  href="mailto:Khazashaik4@gmail.com"
                  aria-label="Email"
                  className="rounded-lg p-2.5 text-white/55 transition hover:bg-white/10 hover:text-white"
                >
                  <HiEnvelope className="size-5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-2 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row sm:justify-between">
          <p>&copy; {year} Khaza Shaik. All rights reserved.</p>
          <RouterLink
            to="/admin"
            className="text-white/30 transition hover:text-white/70"
          >
            Admin
          </RouterLink>
        </div>
      </div>
    </footer>
  );
}
