#!/usr/bin/env node
/**
 * Generate an ATS-optimized .docx resume from the same src/data/* content the
 * site and PDF use → public/Khaza-Shaik-Resume-ATS.docx
 *
 * Usage:  npm run resume:docx
 *
 * ATS design choices (differ deliberately from the styled PDF):
 *   • Single column, no tables / text boxes / icons / header-footer.
 *   • Standard fonts (Calibri), standard section headings parsers recognize.
 *   • Real bullet lists (numbering config), plain hyphen dates.
 *   • Contact info as plain top lines; skills as keyword-dense text.
 *   • A4 page size (matches the PDF; standard for India / non-US applications).
 *   • Every role lists a "Technologies:" line so the stack is keyword-parseable.
 *
 * Many job portals (Naukri, Workday, Greenhouse) parse .docx more reliably than
 * PDF — hand recruiters this file for online applications, the PDF for humans.
 */
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  ExternalHyperlink, BorderStyle, LevelFormat, convertInchesToTwip,
} from 'docx';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'public/Khaza-Shaik-Resume-ATS.docx');

const { default: experienceStatic } = await import('../src/data/experience.js');
const { default: projectsStatic } = await import('../src/data/projects.js');
const { default: skillsStatic } = await import('../src/data/skills.js');
const { default: certificationsStatic } = await import('../src/data/certifications.js');
const { default: profileStatic } = await import('../src/data/profile.js');
const { loadContent } = await import('./load-content.mjs');

// Supabase (what /admin edits) is the source of truth; the static imports above
// are the offline fallback.
const { content, source: contentSource } = await loadContent({
  experience: experienceStatic,
  projects: projectsStatic,
  skills: skillsStatic,
  certifications: certificationsStatic,
  profile: profileStatic,
});

const experience = content.experience;
const projects = content.projects;
const skills = content.skills;
const certifications = content.certifications;
const profile = content.profile;

// ATS: normalise glyphs some parsers choke on → plain ASCII.
const ascii = (s) =>
  String(s ?? '')
    .replace(/[–—]/g, '-')      // en/em dash → hyphen
    .replace(/₹\s?/g, 'Rs. ')   // rupee sign
    .replace(/×/g, 'x')         // multiplication sign → x
    .replace(/\s*[→⟶➔➞]\s*/g, ' -> ') // arrows some parsers drop entirely
    .replace(/[‘’]/g, "'")      // curly single quotes
    .replace(/[“”]/g, '"');     // curly double quotes

const FONT = 'Calibri';
const INK = '1F2937';
const ACCENT = '0D9488';

// --- section heading with a bottom rule -----------------------------------
const heading = (text) =>
  new Paragraph({
    spacing: { before: 220, after: 90 },
    border: { bottom: { color: 'BFBFBF', space: 2, style: BorderStyle.SINGLE, size: 6 } },
    children: [
      new TextRun({ text: text.toUpperCase(), bold: true, size: 22, color: INK, font: FONT, characterSpacing: 20 }),
    ],
  });

const bullet = (text) =>
  new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    spacing: { after: 40 },
    children: [new TextRun({ text: ascii(text), size: 20, color: INK, font: FONT })],
  });

// --- header block ----------------------------------------------------------
const children = [];

children.push(
  new Paragraph({
    spacing: { after: 20 },
    children: [new TextRun({ text: profile.name, bold: true, size: 40, color: INK, font: FONT })],
  }),
  new Paragraph({
    spacing: { after: 60 },
    children: [new TextRun({ text: ascii(profile.title), bold: true, size: 20, color: ACCENT, font: FONT })],
  }),
  new Paragraph({
    spacing: { after: 20 },
    children: [
      new TextRun({ text: `${profile.location}  |  `, size: 18, color: INK, font: FONT }),
      new ExternalHyperlink({ link: `mailto:${profile.email}`, children: [new TextRun({ text: profile.email, size: 18, color: INK, font: FONT })] }),
      new TextRun({ text: `  |  ${profile.phone}`, size: 18, color: INK, font: FONT }),
    ],
  }),
  new Paragraph({
    spacing: { after: 60 },
    children: [
      new ExternalHyperlink({ link: profile.linkedinUrl, children: [new TextRun({ text: profile.linkedin, size: 18, color: INK, font: FONT })] }),
      new TextRun({ text: '  |  ', size: 18, color: INK, font: FONT }),
      new ExternalHyperlink({ link: profile.githubUrl, children: [new TextRun({ text: profile.github, size: 18, color: INK, font: FONT })] }),
    ],
  }),
);

// --- summary ---------------------------------------------------------------
children.push(heading('Summary'));
children.push(new Paragraph({
  spacing: { after: 60 },
  children: [new TextRun({ text: ascii(profile.summary), size: 20, color: INK, font: FONT })],
}));

// --- technical skills (keyword-dense, ATS gold) ----------------------------
children.push(heading('Technical Skills'));
for (const group of skills) {
  const items = (group.items ?? []).map((i) => i.name).join(', ');
  children.push(new Paragraph({
    spacing: { after: 40 },
    children: [
      new TextRun({ text: `${group.category}: `, bold: true, size: 20, color: INK, font: FONT }),
      new TextRun({ text: ascii(items), size: 20, color: INK, font: FONT }),
    ],
  }));
}

// --- experience ------------------------------------------------------------
children.push(heading('Experience'));
for (const job of experience) {
  children.push(new Paragraph({
    spacing: { before: 120, after: 0 },
    children: [
      new TextRun({ text: `${job.role}, ${job.company}`, bold: true, size: 21, color: INK, font: FONT }),
      new TextRun({ text: `   ${ascii(job.duration)}`, size: 18, color: '6B7280', font: FONT }),
    ],
  }));
  const sub = [job.location, job.client ? `Client: ${job.client}` : null].filter(Boolean).join('  |  ');
  if (sub) {
    children.push(new Paragraph({
      spacing: { after: 40 },
      children: [new TextRun({ text: ascii(sub), italics: true, size: 18, color: '6B7280', font: FONT })],
    }));
  }
  for (const h of job.highlights) children.push(bullet(h));
  // AI stack first, then the rest — the .docx is a flat list (no colour split),
  // but every technology still has to reach the ATS keyword scan.
  const allTech = [...(job.techAI ?? []), ...(job.tech ?? [])];
  if (allTech.length) {
    children.push(new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({ text: 'Technologies: ', bold: true, size: 18, color: INK, font: FONT }),
        new TextRun({ text: ascii(allTech.join(', ')), size: 18, color: '374151', font: FONT }),
      ],
    }));
  }
}

// --- projects --------------------------------------------------------------
children.push(heading('Selected Projects'));
for (const p of projects) {
  children.push(new Paragraph({
    spacing: { before: 80, after: 0 },
    children: [new TextRun({ text: ascii(p.title), bold: true, size: 20, color: INK, font: FONT })],
  }));
  children.push(new Paragraph({
    spacing: { after: 20 },
    children: [new TextRun({ text: ascii(p.description), size: 19, color: INK, font: FONT })],
  }));
  if (p.tech?.length) {
    children.push(new Paragraph({
      spacing: { after: 40 },
      children: [new TextRun({ text: ascii(p.tech.join(', ')), size: 18, color: '374151', font: FONT })],
    }));
  }
}

// --- education -------------------------------------------------------------
children.push(heading('Education'));
children.push(new Paragraph({
  children: [new TextRun({ text: ascii(profile.education.degree), bold: true, size: 20, color: INK, font: FONT })],
}));
children.push(new Paragraph({
  spacing: { after: 60 },
  children: [new TextRun({ text: ascii(profile.education.school), size: 19, color: '374151', font: FONT })],
}));

// --- certifications --------------------------------------------------------
if (certifications.length) {
  children.push(heading('Certifications'));
  for (const c of certifications) {
    children.push(new Paragraph({
      spacing: { after: 30 },
      children: [
        new TextRun({ text: ascii(c.title), bold: true, size: 19, color: INK, font: FONT }),
        new TextRun({
          text: `  —  ${ascii(c.issuer)}${c.date ? `, ${c.date}` : ''}`,
          size: 18, color: '374151', font: FONT,
        }),
        // Courses inside a specialization — keyword-rich, so keep it for the ATS.
        ...(c.detail
          ? [new TextRun({ text: `  (${ascii(c.detail)})`, size: 17, color: '6B7280', font: FONT })]
          : []),
      ],
    }));
  }
}

// --- assemble --------------------------------------------------------------
const doc = new Document({
  creator: profile.name,
  title: `${profile.name} - Resume`,
  description: 'Resume',
  styles: { default: { document: { run: { font: FONT } } } },
  numbering: {
    config: [{
      reference: 'bullets',
      levels: [{
        level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
        style: { paragraphProperties: { indent: { left: convertInchesToTwip(0.25), hanging: convertInchesToTwip(0.18) } } },
      }],
    }],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 }, // A4 (210 × 297 mm), matches the PDF
        margin: { top: 720, bottom: 720, left: 900, right: 900 },
      },
    },
    children,
  }],
});

const buffer = await Packer.toBuffer(doc);
fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, buffer);
const kb = (fs.statSync(OUT).size / 1024).toFixed(1);
console.log(
  `✓ Wrote ${path.relative(ROOT, OUT)}  (${kb} KB) from ` +
    (contentSource === 'supabase' ? 'Supabase (admin UI)' : 'static src/data'),
);
