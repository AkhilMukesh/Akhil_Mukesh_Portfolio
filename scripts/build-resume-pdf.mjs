#!/usr/bin/env node
/**
 * Render the LIVE resume (src/components/resume/ResumeDocument.jsx) straight to
 * public/resume.pdf, using the same content the site + download button use.
 *
 * Usage:  npm run resume
 *
 * This keeps the committed static PDF (the download-button fallback, and any
 * direct link to /resume.pdf) in lockstep with src/data/*. It replaces the old
 * headless-Chrome pipeline that rendered the now-stale scripts/resume.html.
 *
 * How it works: esbuild bundles the JSX entry to a temp ESM file (fast, uses
 * the project's own node_modules), then we run it and clean up.
 */
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public/resume.pdf');
const TMP_ENTRY = path.join(ROOT, '.resume-entry.jsx');
const TMP_BUNDLE = path.join(ROOT, '.resume-bundle.mjs');
const esbuild = path.join(ROOT, 'node_modules/.bin/esbuild');

const entry = `
import { renderToFile } from '@react-pdf/renderer';
import experience from './src/data/experience.js';
import projects from './src/data/projects.js';
import skills from './src/data/skills.js';
import certifications from './src/data/certifications.js';
import resumeProfile from './src/data/profile.js';
import ResumeDocument from './src/components/resume/ResumeDocument.jsx';
import { loadContent } from './scripts/load-content.mjs';

// Supabase (what /admin edits) is the source of truth; the static imports above
// are the offline fallback.
const { content, source } = await loadContent({
  experience, projects, skills, certifications, profile: resumeProfile,
});
console.log('source:' + source);

await renderToFile(
  <ResumeDocument
    profile={content.profile}
    experience={content.experience}
    projects={content.projects}
    skills={content.skills}
    certifications={content.certifications}
  />,
  ${JSON.stringify(OUT)},
);
console.log('rendered');
`;

const cleanup = () => {
  for (const f of [TMP_ENTRY, TMP_BUNDLE]) {
    try { fs.unlinkSync(f); } catch { /* ignore */ }
  }
};

try {
  fs.writeFileSync(TMP_ENTRY, entry);

  const bundle = spawnSync(
    esbuild,
    [
      TMP_ENTRY,
      '--bundle',
      '--platform=node',
      '--format=esm',
      `--outfile=${TMP_BUNDLE}`,
      '--loader:.js=jsx',
      '--jsx=automatic',
      '--packages=external',
      '--log-level=error',
    ],
    { cwd: ROOT, stdio: ['ignore', 'inherit', 'inherit'] },
  );
  if (bundle.status !== 0) throw new Error('esbuild bundling failed');

  const run = spawnSync(process.execPath, [TMP_BUNDLE], {
    cwd: ROOT,
    stdio: ['ignore', 'pipe', 'inherit'],
  });
  if (run.status !== 0) throw new Error('PDF render failed');

  const stdout = run.stdout?.toString() ?? '';
  const source = /source:supabase/.test(stdout) ? 'Supabase (admin UI)' : 'static src/data';

  const kb = (fs.statSync(OUT).size / 1024).toFixed(1);
  console.log(`✓ Wrote ${path.relative(ROOT, OUT)}  (${kb} KB) from ${source}`);
} catch (err) {
  console.error('❌', err.message);
  process.exitCode = 1;
} finally {
  cleanup();
}
