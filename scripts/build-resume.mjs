#!/usr/bin/env node
/**
 * Render scripts/resume.html → public/resume.pdf using headless Chrome.
 *
 * Usage:  npm run resume
 *
 * Requires: Google Chrome installed locally. No npm dependencies needed.
 * If Chrome isn't at a standard path, set the CHROME env var:
 *   CHROME="/path/to/chrome" npm run resume
 */

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC = path.join(ROOT, 'scripts/resume.html');
const OUT = path.join(ROOT, 'public/resume.pdf');

const CHROME_CANDIDATES = [
  process.env.CHROME,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary',
  '/Applications/Chromium.app/Contents/MacOS/Chromium',
  '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
].filter(Boolean);

const chrome = CHROME_CANDIDATES.find((p) => p && fs.existsSync(p));

if (!chrome) {
  console.error('❌  Chrome / Chromium not found. Tried:');
  CHROME_CANDIDATES.forEach((p) => console.error('    ·', p));
  console.error('    Set CHROME="/path/to/chrome" and try again.');
  process.exit(1);
}

if (!fs.existsSync(SRC)) {
  console.error(`❌  Resume source missing: ${SRC}`);
  process.exit(1);
}

fs.mkdirSync(path.dirname(OUT), { recursive: true });

console.log(`→ Rendering ${path.relative(ROOT, SRC)}  using ${path.basename(chrome)}`);

const result = spawnSync(
  chrome,
  [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--hide-scrollbars',
    '--disable-translate',
    '--disable-extensions',
    '--virtual-time-budget=15000',
    '--no-pdf-header-footer',
    `--print-to-pdf=${OUT}`,
    `file://${SRC}`,
  ],
  { stdio: ['ignore', 'pipe', 'pipe'] },
);

if (result.status !== 0) {
  console.error('❌  Chrome failed to render the PDF.');
  if (result.stderr) process.stderr.write(result.stderr);
  process.exit(result.status ?? 1);
}

const stats = fs.statSync(OUT);
const sizeKb = (stats.size / 1024).toFixed(1);
console.log(`✓ Wrote ${path.relative(ROOT, OUT)}  (${sizeKb} KB)`);
