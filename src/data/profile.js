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
  name: 'Akhil Mukesh',
  title: 'Software Engineer, Lead (Java · Python · React/Angular · AI)',
  location: 'Bengaluru, India',
  email: 'akhil1997mukesh@gmail.com',
  phone: '+91 8618097296',
  linkedin: 'https://www.linkedin.com/in/akhil-mukesh-43376a126/',
  linkedinUrl: 'https://www.linkedin.com/in/akhil-mukesh-43376a126/',
  github: 'https://github.com/AkhilMukesh',
  githubUrl: 'https://github.com/AkhilMukesh',

  // --- résumé summary (also usable anywhere a one-paragraph pitch is needed) ---
  summary:
    'Full Stack Engineer with 6+ years building, scaling enterprise systems and owning its architecture end to end. Deep across the stack — Java and Spring Boot, Angular and React, Kafka event-driven systems, PostgresSQL and Cassandra/MongoDB on AWS, Azure, and Kubernetes — plus production AI: RAG pipelines, tool-calling agents, and LLM features in Python. Proven track record of transforming systems from frequent P1 production incidents to highly reliable platforms with minimal critical outages.',

  // --- hero (website only): two-line pitch. `leadLabel` is the bold role phrase. ---
  hero: {
    leadLabel: 'Full Stack Engineer',
    tagline:
      'With 6+ years building web applications end to end — Java and Spring Boot on the backend, Angular and React on the frontend, and Python-based AI systems including LLMs, RAG pipelines, and tool-calling agents.',
    sub:
      'I lead a team at TCS on an AI-powered orchestration platform — owning its architecture, mentoring the developers on it, and building the critical paths myself. LLM features, retrieval (RAG), and agents in Python, held to the same bar as everything else I ship.'
  },

  // --- about (website): paragraphs. `strong` marks phrases rendered bold in UI. ---
  about: [
    "I'm a full stack engineer. Most of my {years} years have gone into building and integrating Java and Spring Boot services with Angular and React front-ends for enterprise clients — the kind of systems where a lot of people depend on things not breaking.",
    "I'm comfortable across the whole stack. On a typical feature I'll design the API and data model, write the back-end and the UI, wire up the messaging and caching, and make sure it's observable and stable once it ships. I care about the parts that don't show up in a demo: error handling, edge cases, and what happens under load.",
    "I also build AI into products — LLM-powered features, retrieval (RAG), and small tool-calling agents, mostly in Python with LangChain and vector databases. It gets the same testing, logging, and review as anything else I ship, because a clever prototype that falls over in production isn't worth much.",
    'Outside of work: cricket,gaming and reading about how other engineers build things, and the occasional deep-dive into something completely unrelated.',
  ],

  // --- "short version" highlight cards (website only) ---
  highlights: [
    {
      eyebrow: 'What I do',
      stat: 'Build full stack, end to end',
      hint: 'Java · Python · Spring Boot · Angular / React · AI',
      detail:
        'I own features from the API and data model to the UI, with the messaging, testing, and observability that keep them reliable.',
    },
    {
      eyebrow: 'Track record',
      stat: '{years} years · 3 companies',
      hint: 'TCS · UST · Gove.Co',
      detail:
        'Shipped and maintained enterprise systems across Insurance, supply chain, Banking and finance — the kind people depend on daily.',
    },
    {
      eyebrow: 'Current role',
      stat: 'Leading a team',
      hint: 'Tata Consultancy Services (TCS) · If P&C Insurance',
      detail:
        'Leading a team while owning architecture and critical development for an AI-powered test orchestration platform — Java, Spring Boot, Kafka, Kubernetes, and Python-based LLM, RAG, and agentic workflows.',
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
    degree: 'B.Tech/BE, Information Science Engineering',
    school: 'Visvesvaraya Technological University (VTU), India',
  },
};

export default profile;
