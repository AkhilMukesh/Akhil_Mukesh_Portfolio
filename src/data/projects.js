/**
 * Project list — a mix of professional enterprise work and personal AI
 * projects. Each project carries a `category` ('AI' | 'Enterprise') so the
 * Projects section can filter between full-stack/enterprise work and AI work.
 */
const projects = [
  // === AI / ML Personal Projects ===
  {
    title: 'Git Release Analyzer',
    description:
      'AI tool that compares release branches using Git APIs, producing rich summaries of code changes, commits, MRs, developers, and reviewers. Generates separate non-technical Business Summaries and detailed Technical summaries for deployment risk auditing.',
    tech: ['Python', 'Git API', 'OpenAI', 'FastAPI', 'React'],
    github: 'https://github.com/khazaShaik',
    featured: true,
    category: 'AI',
    hasInteractiveDemo: true,
  },
  {
    title: 'Agent Studio — Onboard Any Service, Generate Its Tests',
    description:
      'A generic tool that takes a service from "here is my repo" to a running test suite. It ingests seven source types — Git code, Swagger/OpenAPI, Confluence runbooks, database schema, qTest and Splunk — into a searchable per-service domain, builds a cross-source dependency graph, then generates positive, negative and edge scenarios filled with data that satisfies real schema constraints and executes them with per-step validation and reporting. Nothing is service-specific: onboarding a new API is configuration, not code. The LLM handles extraction and scenario design while deterministic code runs and validates every step, so failures stay reproducible.',
    tech: ['React 19', 'TypeScript', 'Python', 'FastAPI', 'LangGraph', 'RAG', 'pgvector', 'SSE'],
    github: 'https://github.com/khazaShaik',
    featured: true,
    category: 'AI',
    hasInteractiveDemo: true,
  },
  {
    title: 'DocuMind — RAG-Powered Doc Assistant',
    description:
      'Retrieval-augmented Q&A system over technical documentation. Ingests PDFs and Markdown, chunks with recursive splitting, embeds via OpenAI, and retrieves via ChromaDB with hybrid search and cross-encoder reranking. Returns answers with cited sources and holds up well against a hand-built evaluation set.',
    tech: ['Python', 'LangChain', 'OpenAI', 'ChromaDB', 'FastAPI', 'RAG'],
    github: 'https://github.com/khazaShaik',
    featured: true,
    category: 'AI',
  },
  {
    title: 'AgentFlow — Multi-Agent Workflow',
    description:
      'Multi-agent orchestration system built with LangGraph. Four agents (planner, retriever, executor, critic) collaborate through shared state with tool calling, function routing, and self-correction loops. It triages GitHub issues and drafts contextual responses, taking a lot of the manual work out of issue triage.',
    tech: ['Python', 'LangGraph', 'LangChain', 'OpenAI', 'Function Calling', 'AI Agents'],
    github: 'https://github.com/khazaShaik',
    featured: true,
    category: 'AI',
  },

  // === Enterprise / Professional Projects ===
  {
    title: 'T-Mobile SCM Platform',
    description:
      'Cloud-native supply chain platform used across thousands of T-Mobile retail stores. Owns the DRI / DRO / DLM modules that handle a high daily volume of inventory transactions, with Kafka async flows, Cassandra-tuned hot paths, and Kubernetes orchestration. Currently delivering the TIMO Console and TIMO iOS app.',
    tech: ['Spring Boot', 'Java 17', 'Apigee', 'Cassandra', 'Kafka', 'Kubernetes', 'Angular 16'],
    featured: false,
    category: 'Enterprise',
  },
  {
    title: 'CREW Rest Day Logic — Union Pacific Railroad',
    description:
      'Designed and delivered Rest Day functionality for Union Pacific Railroad\'s crew allocation system, serving a ~4,000-member crew workforce with calculations running daily. Built it as a configurable rule engine that enforces the mandated rest gap between shifts (12–24 hours by role and policy), integrated end to end into the CREW module.',
    tech: ['Spring Boot', 'Java 11', 'Reactive Programming', 'Angular 11', 'Splunk'],
    featured: false,
    category: 'Enterprise',
  },
  {
    title: 'ERCS — Electronic Receipt System',
    description:
      'Electronic receipt and confirmation system for CCIL, handling collateral notices across its member network — India\'s major banks and financial institutions clearing through CCIL and NSE in the money, G-Sec, and derivative markets. Live in production at enotice.ccilindia.com.',
    tech: ['Spring', 'REST', 'Oracle', 'AngularJS', 'JPA', 'Tomcat'],
    demo: 'https://enotice.ccilindia.com',
    featured: false,
    category: 'Enterprise',
  },
  {
    title: 'eTokens — Coupons Management',
    description:
      'SEO-friendly coupons management platform enabling merchants to create, distribute, and track coupon campaigns with real-time analytics and redemption tracking.',
    tech: ['Angular', 'Spring Boot', 'Java', 'REST API'],
    github: 'https://github.com/khazaShaik',
    featured: false,
    category: 'Enterprise',
  },
  {
    title: 'Vendor Management System (VMS)',
    description:
      'Platform for businesses to manage their contingent vendor ecosystem — obtaining quotes with pricing, capabilities, and turnaround times in one place.',
    tech: ['Java', 'Spring', 'AngularJS', 'REST', 'Oracle'],
    github: 'https://github.com/khazaShaik/VMS',
    featured: false,
    category: 'Enterprise',
  },
];

export default projects;
