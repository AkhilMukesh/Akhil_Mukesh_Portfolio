# Khaza Shaik — Portfolio

Personal portfolio site built with **Vite + React + Tailwind CSS + Framer Motion**.

Single-page app with smooth-scroll navigation, dark/light theme, and scroll-triggered animations.

## Tech Stack

- **React 18** — UI library
- **Vite 6** — build tool & dev server
- **Tailwind CSS 3** — styling (class-based dark mode)
- **Framer Motion 11** — animations
- **react-scroll** — smooth in-page navigation
- **react-icons** — icon set
- **@emailjs/browser** — contact form (optional, configure keys)

## Getting Started

```bash
npm install
npm run dev       # start dev server
npm run build     # production build to dist/
npm run preview   # preview production build
```

## Project Structure

```
portfolio/
├── public/
│   ├── resume.pdf                    ← generated, do not edit by hand
│   └── Khaza-Shaik-Resume-ATS.docx   ← generated, do not edit by hand
├── scripts/
│   ├── build-resume-pdf.mjs          ← renders the PDF résumé
│   ├── build-resume-docx.mjs         ← renders the ATS-friendly .docx
│   ├── build-seed.mjs                ← regenerates supabase/seed.sql
│   └── load-content.mjs              ← Supabase-first content loader (static fallback)
├── src/
│   ├── components/
│   │   ├── admin/                    ← CMS editors (profile, projects, experience…)
│   │   └── resume/                   ← React-PDF résumé document
│   ├── context/ContentContext.jsx    ← Supabase → static fallback
│   ├── data/                         ← static content + offline fallback
│   ├── hooks/                        ← useDarkMode, useCrud, useRevealOnce
│   └── utils/                        ← getYearsOfExperience (auto-updates)
├── supabase/
│   ├── schema.sql                    ← tables, RLS, triggers
│   ├── seed.sql                      ← generated from src/data
│   └── README.md                     ← one-time setup guide
└── index.html                        ← SEO meta, JSON-LD Person schema
```

## Content: one source of truth

Content lives in **Supabase** when configured, and falls back to `src/data/*.js`
when it isn't — so the site works offline and never shows a blank section.

```
/admin (CMS)  →  Supabase  →  website (live)
                          └→  npm run resume  →  PDF + .docx
```

Edit content either way:

| Where | How |
|---|---|
| **`/admin`** | Sign in and edit Profile, Projects, Experience, Skills, Certifications inline. Saves to Supabase; the site updates immediately. |
| **`src/data/*.js`** | Edit directly. This is the offline fallback and the seed source. |

See [`supabase/README.md`](supabase/README.md) for the one-time setup.

## Résumé generation

`public/resume.pdf` and `public/*.docx` are **build artifacts** — they do not
update themselves. After changing content, regenerate:

```bash
npm run resume        # PDF  (React-PDF)
npm run resume:docx   # ATS-friendly .docx
npm run seed:build    # regenerate supabase/seed.sql from src/data
```

Both résumé scripts read Supabase first and fall back to `src/data`, printing
which source they used. The `.docx` is deliberately single-column with no
tables or text boxes so applicant tracking systems parse it cleanly.

## Customization

| File | What to edit |
|---|---|
| `src/data/profile.js` | Name, title, contact, summary, hero copy, About, highlights |
| `src/data/projects.js` | Projects |
| `src/data/skills.js` | Skills, grouped by category |
| `src/data/experience.js` | Work history (`techAI` renders as accent chips) |
| `src/data/certifications.js` | Certifications |
| `src/data/iconMap.js` | Register a new icon key before using it in skills |
| `src/utils/experience.js` | `CAREER_START` date (drives auto-calculated years) |
| `index.html` | SEO meta, JSON-LD |

## EmailJS Setup (Contact Form)

1. Create a free account at https://www.emailjs.com
2. Create a Service + Template
3. Create `.env.local` with:
   ```
   VITE_EMAILJS_SERVICE_ID=your_service_id
   VITE_EMAILJS_TEMPLATE_ID=your_template_id
   VITE_EMAILJS_PUBLIC_KEY=your_public_key
   ```
4. The Contact form picks these up automatically.

## Features

- Dark / light theme with `localStorage` persistence + system preference
- Smooth-scroll section navigation with active-link spy
- Mobile hamburger menu with focus/scroll-lock
- Scroll-triggered fade-in animations (respects `prefers-reduced-motion`)
- Top scroll-progress bar
- Scroll-to-top floating button
- Rotating role tagline in Hero
- Project filter by tech-stack tag
- Copy-email-to-clipboard button in Contact
- Client-side contact form validation
- Dynamic years-of-experience (updates automatically)
- SEO-ready: Open Graph, Twitter Card, JSON-LD Person schema
- Skip-to-content link for keyboard users

## Deployment

Any static host works. Recommended:

- **Vercel**: `vercel` (zero config)
- **Netlify**: drag-and-drop the `dist/` folder
- **GitHub Pages**: build, push `dist/` to `gh-pages` branch

Build once with `npm run build`, then deploy the `dist/` folder.

## License

MIT © Khaza Shaik
