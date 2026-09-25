/**
 * SINGLE SOURCE OF TRUTH for all profile prose used across the site AND the
 * résumé (PDF + .docx). Edit text here once and every surface updates:
 *   • Hero tagline  → src/components/Hero.jsx
 *   • About         → src/components/About.jsx
 *   • Highlights    → src/components/HiringHighlights.jsx
 *   • Résumé        → src/components/resume/ResumeDocument.jsx (PDF) and
 *                     scripts/build-resume-docx.mjs (.docx)
 *
 * Structured lists (projects, experience, skills, certifications) live in their
 * own data files since they're also the CMS/Supabase schema. This file holds
 * the free-text prose that used to be hardcoded inside components.
 */
const profile = {
  // --- identity + contact (shared by header, résumé, SEO) ---
  name: 'Khaza Shaik',
  title: 'Senior Software Engineer, Lead (Java · React/Angular · AI)',
  location: 'Hyderabad, India',
  email: 'Khazashaik4@gmail.com',
  phone: '+91 82913 33422',
  linkedin: 'linkedin.com/in/khaza-shaik',
  linkedinUrl: 'https://linkedin.com/in/khaza-shaik-3344b5157',
  github: 'github.com/khazaShaik',
  githubUrl: 'https://github.com/khazaShaik',

  // --- résumé summary (also usable anywhere a one-paragraph pitch is needed) ---
  summary:
    'Senior Full Stack Engineer with 10+ years building and scaling enterprise systems for telecom, supply chain, railroad, and financial clients. Currently lead a team of 4 and mentor 4–5 junior developers on an AI-powered test orchestration platform at T-Mobile, owning its architecture end to end. Deep across the stack — Java and Spring Boot, Angular and React, Kafka event-driven systems, and Cassandra/MongoDB on AWS, Azure, and Kubernetes — plus production AI: RAG pipelines, tool-calling agents, and LLM features in Python. Track record of taking systems from weekly P1 pages to almost none.',

  // --- hero (website only): two-line pitch. `leadLabel` is the bold role phrase. ---
  hero: {
    leadLabel: 'Senior Full Stack Engineer',
    tagline:
      'with 10+ years building web apps end to end — Java and Spring Boot on the back, Angular and React on the front, for telecom, supply chain, and finance clients.',
    sub:
      'I lead a team of 4 on an AI-powered test orchestration platform at T-Mobile — owning its architecture, mentoring the developers on it, and building the critical paths myself. LLM features, retrieval (RAG), and agents in Python, held to the same bar as everything else I ship.',
  },

  // --- about (website): paragraphs. `strong` marks phrases rendered bold in UI. ---
  about: [
    "I'm a full stack engineer. Most of my {years} years have gone into building and integrating Java and Spring Boot services with Angular and React front-ends for enterprise clients in telecom, supply chain, railroads, and finance — the kind of systems where a lot of people depend on things not breaking.",
    "I'm comfortable across the whole stack. On a typical feature I'll design the API and data model, write the back-end and the UI, wire up the messaging and caching, and make sure it's observable and stable once it ships. I care about the parts that don't show up in a demo: error handling, edge cases, and what happens under load.",
    "I also build AI into products — LLM-powered features, retrieval (RAG), and small tool-calling agents, mostly in Python with LangChain and vector databases. It gets the same testing, logging, and review as anything else I ship, because a clever prototype that falls over in production isn't worth much.",
    'Outside of work: cricket, reading about how other engineers build things, and the occasional deep-dive into something completely unrelated.',
  ],

  // --- "short version" highlight cards (website only) ---
  highlights: [
    {
      eyebrow: 'What I do',
      stat: 'Build full stack, end to end',
      hint: 'Java · Spring Boot · Angular / React',
      detail:
        'I own features from the API and data model to the UI, with the messaging, testing, and observability that keep them reliable.',
    },
    {
      eyebrow: 'Track record',
      stat: '{years} years · 3 companies',
      hint: 'T-Mobile · Union Pacific · CCIL',
      detail:
        'Shipped and maintained enterprise systems across telecom, supply chain, railroads, and finance — the kind people depend on daily.',
    },
    {
      eyebrow: 'Current role',
      stat: 'Leading a team of 4',
      hint: 'Concentrix · T-Mobile SCM',
      detail:
        'Lead an AI-powered test orchestration platform — microservices, Kafka event flows, Kubernetes, and an LLM layer for generating test data.',
    },
    {
      eyebrow: 'Looking for',
      stat: 'A strong product team',
      hint: 'Remote · Hybrid · On-site · GCC',
      detail:
        'Somewhere I can own features end to end across the stack, and keep bringing AI in where it genuinely helps.',
    },
  ],

  // --- education (shared by résumé) ---
  education: {
    degree: 'B.Tech, Electronics & Communication',
    school: 'Jawaharlal Nehru Technological University, India',
  },
};

export default profile;
