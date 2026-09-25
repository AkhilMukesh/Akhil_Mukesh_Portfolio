import {
  Document,
  Page,
  Text,
  View,
  Link,
  StyleSheet,
  Font,
} from '@react-pdf/renderer';

/**
 * Live resume PDF, generated from the same content the site renders.
 *
 * Design: modern minimalist / typographic — Inter throughout, a strong weight
 * hierarchy, generous whitespace, one restrained accent, and NO decorative
 * underline rules. Single column and real text, so it stays ATS-parseable.
 *
 * Fonts are referenced by URL relative to this module (`import.meta.url`), which
 * resolves in both the browser (Vite serves the asset) and the Node build
 * script (esbuild keeps it as a file URL).
 */

// Inter (latin, weights 400/500/600/700) bundled in src/assets/fonts.
//
// react-pdf resolves `src` differently per environment: in the browser it
// fetch()es a URL (Vite serves the asset); in Node it reads a filesystem path
// (Node's fetch() can't handle file:// URLs). So we detect the environment and
// hand each the form it can load.
const isNode =
  typeof process !== 'undefined' && !!(process.versions && process.versions.node);

const fontSrc = (file) => {
  // Browser: a Vite-served URL relative to this module.
  if (!isNode) return new URL(`../../assets/fonts/${file}`, import.meta.url).href;
  // Node (build script, bundled to project root): resolve from cwd so it works
  // regardless of where the bundle lands.
  return `${process.cwd()}/src/assets/fonts/${file}`;
};

Font.register({
  family: 'Inter',
  fonts: [
    { src: fontSrc('Inter-400.woff'), fontWeight: 400 },
    { src: fontSrc('Inter-500.woff'), fontWeight: 500 },
    { src: fontSrc('Inter-600.woff'), fontWeight: 600 },
    { src: fontSrc('Inter-700.woff'), fontWeight: 700 },
  ],
});

// Disable hyphenation so words don't break mid-token in bullets.
Font.registerHyphenationCallback((word) => [word]);

/**
 * Replace glyphs the built-in Helvetica can't render (they'd show as garbage
 * like "¹") with ASCII equivalents. Helvetica DOES support en/em dashes,
 * curly quotes, ·, and × (verified in the rendered output), so those are left
 * intact — only the genuinely-missing rupee sign is swapped. The website keeps
 * the original symbol; this sanitizes the PDF only. Extend if new symbols
 * creep into the data.
 */
// The embedded PDF font has no arrow glyphs — they render as stray quote
// marks — so map them to ASCII before they reach react-pdf.
const GLYPH_FIXES = [
  [/₹\s?/g, 'Rs. '],
  [/\s*[→⟶➔➞]\s*/g, ' -> '],
];
const pdfSafe = (v) => {
  if (v == null) return v;
  let out = String(v);
  for (const [re, sub] of GLYPH_FIXES) out = out.replace(re, sub);
  return out;
};

/**
 * Keep the résumé's project blurbs to one tight line: take the first sentence
 * only. The website keeps the full multi-sentence descriptions from the shared
 * data — this trims for the print résumé so Projects don't push the tail onto a
 * third page.
 */
/**
 * Trim a project description to a compact, even-looking blurb.
 * Takes the first sentence, then keeps pulling in the next one while the
 * result is still short — otherwise projects whose opening sentence is brief
 * render as a stubby single line next to ones that fill two.
 */
const firstSentence = (v, minChars = 110, maxChars = 235) => {
  const t = String(v ?? '').trim();
  const parts = t.match(/[^.!?]+[.!?]+(\s|$)/g);
  if (!parts) return t;
  let out = '';
  for (const part of parts) {
    const piece = part.trim();
    const next = out ? `${out} ${piece}` : piece;
    if (out && (next.length > maxChars || out.length >= minChars)) break;
    out = next;
  }
  return out || t;
};

const C = {
  ink: '#111827',    // near-black for name + headings
  text: '#374151',   // body
  muted: '#6b7280',  // secondary
  faint: '#9ca3af',  // dates / captions
  accent: '#4338ca', // restrained indigo, used sparingly
  hair: '#e5e7eb',   // the one hairline we keep (contact divider)
};

const s = StyleSheet.create({
  page: {
    paddingTop: 22,
    // Must clear the absolutely-positioned footer (bottom: 14) plus a little
    // breathing room, or the last STACK line of a page butts against it.
    paddingBottom: 30,
    paddingHorizontal: 34,
    fontSize: 9.5,
    lineHeight: 1.5,
    color: C.text,
    fontFamily: 'Inter',
    fontWeight: 400,
  },
  // ---- header: name, role, then a quiet inline contact row ----
  header: { marginBottom: 14 },
  name: {
    fontSize: 26,
    fontWeight: 700,
    color: C.ink,
    letterSpacing: -0.6,
    lineHeight: 1.05,
  },
  roleTitle: {
    fontSize: 10.5,
    fontWeight: 500,
    color: C.accent,
    marginTop: 3,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 9,
    paddingTop: 9,
    borderTopWidth: 0.75,
    borderTopColor: C.hair,
    fontSize: 8.5,
    color: C.muted,
  },
  contactItem: { color: C.muted, marginRight: 4 },
  contactSep: { color: C.faint, marginRight: 4 },
  link: { color: C.muted, textDecoration: 'none' },
  // ---- sections: quiet label, no underline rule ----
  section: { marginBottom: 7 },
  h2: {
    fontSize: 10,
    fontWeight: 700,
    color: C.accent,
    letterSpacing: 0.3,
    marginBottom: 5,
  },
  summary: { fontSize: 9.1, color: C.ink, lineHeight: 1.38, fontWeight: 400 },
  // ---- job ----
  job: { marginBottom: 6.5 },
  jobHead: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  jobRole: { fontSize: 10.5, fontWeight: 600, color: C.ink },
  jobAt: { color: C.text, fontWeight: 500 },
  jobMeta: { fontSize: 8.5, color: C.faint, fontWeight: 400 },
  jobClient: { fontSize: 8.5, color: C.muted, marginTop: 1, marginBottom: 4 },
  bulletRow: { flexDirection: 'row', marginBottom: 1.8, paddingRight: 4 },
  bulletDot: { color: C.accent, width: 8, fontSize: 8.8, lineHeight: 1.32 },
  bulletText: { flex: 1, fontSize: 8.8, color: C.text, lineHeight: 1.32 },
  techLine: { marginTop: 4, fontSize: 8, color: C.muted, lineHeight: 1.35 },
  techLabel: { color: C.faint, fontWeight: 600, marginRight: 3 },
  // ---- projects ----
  proj: { marginBottom: 6 },
  projTitle: { fontSize: 9.75, fontWeight: 600, color: C.ink, letterSpacing: 0.1 },
  projDesc: { fontSize: 8.9, color: C.text, marginTop: 1.5, lineHeight: 1.4 },
  projTech: { fontSize: 7.8, color: C.faint, marginTop: 3, letterSpacing: 0.15 },
  // ---- skills ----
  skillRow: { flexDirection: 'row', marginBottom: 3.5 },
  skillCat: { width: 100, fontSize: 8.8, fontWeight: 600, color: C.ink },
  skillVals: { flex: 1, fontSize: 8.8, color: C.text, lineHeight: 1.34 },
  // ---- two-col (Education | Certifications) ----
  twoCol: { flexDirection: 'row', gap: 22 },
  colWide: { flex: 1 },
  colNarrow: { flex: 1.5 },
  eduDegree: { fontSize: 9.75, fontWeight: 600, color: C.ink },
  eduSchool: { fontSize: 8.75, color: C.muted, marginTop: 2 },
  certRow: { marginBottom: 5, fontSize: 8.6, lineHeight: 1.45 },
  // Courses inside a specialization — set smaller and lighter so the credential
  // title stays the thing you read first.
  certDetail: { fontSize: 8, color: C.faint, lineHeight: 1.4, marginTop: 1.5 },
  certTitle: { fontSize: 8.6, fontWeight: 600, color: C.ink },
  certMeta: { fontSize: 8.6, color: C.muted },
  footer: {
    position: 'absolute',
    bottom: 14,
    left: 34,
    right: 34,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 7.5,
    color: C.faint,
  },
});

function SectionTitle({ children }) {
  return <Text style={s.h2}>{children}</Text>;
}

function Bullet({ children }) {
  return (
    <View style={s.bulletRow} wrap={false}>
      <Text style={s.bulletDot}>•</Text>
      <Text style={s.bulletText}>{children}</Text>
    </View>
  );
}

export default function ResumeDocument({
  profile,
  experience = [],
  projects = [],
  skills = [],
  certifications = [],
}) {
  // Curate projects for the PDF: AI + featured first, cap at 4.
  const resumeProjects = [...projects]
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .filter((p) => p.category === 'AI' || p.featured)
    .slice(0, 4);

  return (
    <Document
      title={`${profile.name} — Resume`}
      author={profile.name}
      subject="Resume"
      keywords="AI Engineer, Software Engineer, RAG, LLM, Java, Spring Boot"
    >
      {/* Single flowing page — react-pdf auto-paginates, so no forced
          half-empty pages. `wrap={false}` on each block keeps a job/project
          from splitting across a page boundary. */}
      <Page size="A4" style={s.page}>
        <View style={s.header}>
          <Text style={s.name}>{profile.name}</Text>
          <Text style={s.roleTitle}>{profile.title}</Text>
          <View style={s.contactRow}>
            <Text style={s.contactItem}>{profile.location}</Text>
            <Text style={s.contactSep}>·</Text>
            <Link style={[s.link, s.contactItem]} src={`mailto:${profile.email}`}>
              {profile.email}
            </Link>
            <Text style={s.contactSep}>·</Text>
            <Text style={s.contactItem}>{profile.phone}</Text>
            <Text style={s.contactSep}>·</Text>
            <Link style={[s.link, s.contactItem]} src={profile.linkedinUrl}>
              {profile.linkedin}
            </Link>
            <Text style={s.contactSep}>·</Text>
            <Link style={[s.link, s.contactItem]} src={profile.githubUrl}>
              {profile.github}
            </Link>
          </View>
        </View>

        <View style={s.section}>
          <SectionTitle>Summary</SectionTitle>
          <Text style={s.summary}>{pdfSafe(profile.summary)}</Text>
        </View>

        <View style={s.section}>
          <SectionTitle>Experience</SectionTitle>
          {experience.map((job, i) => (
            <View key={job.id ?? i} style={s.job} wrap={false}>
              <View style={s.jobHead}>
                <Text style={s.jobRole}>
                  {job.role} <Text style={s.jobAt}>· {job.company}</Text>
                </Text>
                <Text style={s.jobMeta}>
                  {job.duration}
                  {job.location ? ` · ${job.location.split(',')[0]}` : ''}
                </Text>
              </View>
              {job.client && <Text style={s.jobClient}>Client: {pdfSafe(job.client)}</Text>}
              {job.highlights.map((h, j) => (
                <Bullet key={j}>{pdfSafe(h)}</Bullet>
              ))}
              {([...(job.techAI ?? []), ...(job.tech ?? [])].length > 0) && (
                <Text style={s.techLine}>
                  <Text style={s.techLabel}>STACK </Text>
                  {pdfSafe([...(job.techAI ?? []), ...(job.tech ?? [])].join(' · '))}
                </Text>
              )}
            </View>
          ))}
        </View>

        {resumeProjects.length > 0 && (
          <View style={s.section}>
            <SectionTitle>Selected Projects</SectionTitle>
            {resumeProjects.map((p, i) => (
              <View key={p.id ?? i} style={s.proj} wrap={false}>
                <Text style={s.projTitle}>{pdfSafe(p.title)}</Text>
                <Text style={s.projDesc}>{pdfSafe(firstSentence(p.description))}</Text>
                {p.tech?.length > 0 && <Text style={s.projTech}>{p.tech.join(' · ')}</Text>}
              </View>
            ))}
          </View>
        )}

        <View style={s.section}>
          <SectionTitle>Technical Skills</SectionTitle>
          {skills.map((group, i) => (
            <View key={group.id ?? i} style={s.skillRow} wrap={false}>
              <Text style={s.skillCat}>{group.category}</Text>
              <Text style={s.skillVals}>
                {pdfSafe((group.items ?? []).map((it) => it.name).join(' · '))}
              </Text>
            </View>
          ))}
        </View>

        {/* Education + Certifications side by side to keep the tail compact */}
        <View style={s.twoCol} wrap={false}>
          <View style={s.colWide}>
            <SectionTitle>Education</SectionTitle>
            <Text style={s.eduDegree}>{profile.education.degree}</Text>
            <Text style={s.eduSchool}>{profile.education.school}</Text>
          </View>
          {certifications.length > 0 && (
            <View style={s.colNarrow}>
              <SectionTitle>Certifications</SectionTitle>
              {certifications.map((c, i) => (
                <View key={c.id ?? i} style={s.certRow}>
                  <Text>
                    <Text style={s.certTitle}>{pdfSafe(c.title)}</Text>
                    <Text style={s.certMeta}>
                      {'  —  '}
                      {pdfSafe(c.issuer)}
                      {c.date ? `, ${c.date}` : ''}
                    </Text>
                  </Text>
                  {c.detail && <Text style={s.certDetail}>{pdfSafe(c.detail)}</Text>}
                </View>
              ))}
            </View>
          )}
        </View>

        <View style={s.footer} fixed>
          <Text>{profile.name} — Resume</Text>
          <Text>
            {profile.location} · {profile.email}
          </Text>
        </View>
      </Page>
    </Document>
  );
}
