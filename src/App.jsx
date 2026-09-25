import { useState } from 'react';
import useDarkMode from './hooks/useDarkMode';
import { useRouter } from './lib/router';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import HiringHighlights from './components/HiringHighlights';
import About from './components/About';
import Projects from './components/Projects';
import Skills from './components/Skills';
import Experience from './components/Experience';
import Certifications from './components/Certifications';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import ScrollToTop from './components/ScrollToTop';
import TechMarquee from './components/TechMarquee';
import DemoDashboard from './components/DemoDashboard';
import AdminPage from './components/admin/AdminPage';

/**
 * Public portfolio.
 * Flow follows hiring psychology: hook → scannable proof → narrative → outcomes → depth → credentials → action.
 */
function HomePage({ isDark, toggle }) {
  const [isDemoOpen, setIsDemoOpen] = useState(false);
  const [demoProject, setDemoProject] = useState('');

  return (
    <div className="relative flex min-h-dvh w-full flex-col overflow-x-hidden bg-white text-black antialiased tracking-[-0.02em] dark:bg-ink-950 dark:text-glow-100">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <ScrollProgress />
      <Navbar isDark={isDark} toggleTheme={toggle} />

      <main id="main-content" className="flex flex-1 flex-col">
        <Hero />
        <HiringHighlights />
        <About />
        <Projects onLaunchDemo={(title) => {
          setDemoProject(title);
          setIsDemoOpen(true);
        }} />
        <Skills />
        <Experience />
        <Certifications />
        <Contact />
      </main>

      <div className="border-t border-neutral-200/80 bg-white dark:border-white/[0.06] dark:bg-ink-950">
        <TechMarquee />
      </div>

      <Footer />
      <ScrollToTop />

      <DemoDashboard
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        initialProject={demoProject}
      />
    </div>
  );
}

export default function App() {
  const { isDark, toggle } = useDarkMode();
  const { path } = useRouter();

  if (path.startsWith('/admin')) {
    return <AdminPage />;
  }

  return <HomePage isDark={isDark} toggle={toggle} />;
}
