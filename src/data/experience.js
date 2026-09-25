const experience = [
  {
    role: 'Senior Software Engineer (Lead)',
    company: 'Concentrix',
    duration: 'Jun 2025 – Present',
    location: 'Hyderabad, India',
    client: 'T-Mobile — Supply Chain Management (SCM)',
    highlights: [
      'Lead TOP-Elevate, a test orchestration platform that lets any tester run full end-to-end supply-chain journeys from one screen, without needing SAP, API, or database knowledge',
      'Designed the architecture: an LLM generates schema-valid test data and picks reusable step templates, while deterministic code runs the SAP, API, and database steps (Cassandra, MongoDB) and validates each result — keeping the LLM boundary narrow so failures stay debuggable',
      'Hands-on across the stack — built the critical paths myself: the test-data generation engine, step-execution runtime, and per-run validation reporting, in Python (FastAPI, LangChain) with a React front-end',
      'Lead a team of 4 (2 devs, 1 QA, 1 dev-test) and mentor 4–5 junior developers — own the key design decisions, run design and code reviews each sprint, and shape the roadmap with product owners',
      'Cut end-to-end test setup from a multi-team, multi-day effort to minutes — OEM data loads from a 24–48 hour ticket to 5 minutes — saving a measured 8,000+ engineering hours across 4,400+ test cases, 8 environments and 8 distribution centres, with monthly usage up ~40x as teams adopted it',
      'Widened what gets tested — teams previously covered only the happy path; integration, negative, and security scenarios are now routine, catching failures that used to reach production',
    ],
    techAI: ['Python', 'FastAPI', 'LangChain', 'RAG', 'AI Agents', 'React'],
    tech: ['Java', 'Spring Boot', 'Angular 17', 'REST APIs', 'Kafka', 'Cassandra', 'MongoDB'],
  },
  {
    role: 'Cloud Consultant',
    company: 'Concentrix',
    duration: 'Feb 2023 – Jun 2025',
    location: 'Hyderabad, India',
    client: 'T-Mobile — Supply Chain Management (SCM)',
    highlights: [
      'Owned three SCM modules (DRI / DRO / DLM) serving ~3,000 T-Mobile retail stores, on a device-lifecycle platform carrying 18M+ daily transactions across 50+ boundary systems — took them from weekly P1 pages to almost none by fixing root causes rather than patching symptoms',
      'Delivered features across TIMO Console (Angular back-office) and the TIMO 2.0 iOS app on a ~55-microservice retail inventory platform, replacing manual reconciliation with system-tracked movement and SOX-compliant inventory reporting',
      'Built Spring Boot microservices with REST APIs and Angular/TypeScript front-ends, and worked across the Kafka event pipeline that keeps store-level Stock on Hand in sync for BOPIS, buy-online-while-in-store, and same-day delivery',
      'Tuned Cassandra queries and reshaped the data models behind the hot paths, and replaced synchronous batch processing with Kafka-based asynchronous flows to remove the throughput ceiling on large data loads',
      'Set up CI/CD with GitLab pipelines and Azure DevOps using Docker and Kubernetes, moving releases from manual steps to a continuous dev → UAT → pre-prod → production flow that ships every sprint on a per-feature basis',
    ],
    tech: ['Java 17', 'Spring Boot', 'Microservices', 'Angular', 'TypeScript', 'REST APIs', 'Cassandra', 'Kafka', 'AWS', 'Kubernetes'],
  },
  {
    role: 'Software Engineer 1',
    company: 'ProKarma',
    duration: 'Jul 2019 – Jan 2023',
    location: 'Hyderabad, India',
    client: 'T-Mobile US, Inc. & Union Pacific Railroad',
    highlights: [
      'Delivered back-end and Angular UI features on DASH, T-Mobile\'s postpaid order platform for retail and care reps — activations, add-a-line, and device sales across six finance types (FRP, EIP, JOD, CCR, BOPIS, BOWIS)',
      'Owned production defect resolution on DASH — including Redis cache-consistency bugs where stale catalog loads surfaced as wrong pricing at the point of sale, traced across ~15 interfacing systems (SAP, MPM, DPS, Samson, xECM)',
      'Set up blue-green deployments so releases shipped without a maintenance window, and migrated service credentials to HashiCorp Vault — removing hard-coded secrets and making rotation a config change, not a redeploy',
      'Delivered Crew Allocation and Time Management for Union Pacific Railroad — a Rest Day engine running daily for a ~4,000-member crew workforce, with configurable rules enforcing the mandated 12–24 hour rest gap between shifts by role and policy',
    ],
    tech: ['Java', 'Spring Boot', 'Oracle', 'Redis', 'REST APIs', 'Angular', 'Vault', 'Splunk', 'GitLab CI/CD'],
  },
  {
    role: 'Software Engineer',
    company: 'Tata Consultancy Services',
    duration: 'Feb 2016 – Jul 2019',
    location: 'Mumbai, India',
    client: 'CCIL — Clearing Corporation of India Ltd.',
    highlights: [
      'Delivered ERCS for collateral notices at CCIL, India\'s central counterparty for clearing and settlement — live in production at enotice.ccilindia.com and used across its member network of major Indian banks and financial institutions',
      'Built CRM (Credit Risk Monitoring) from scratch to ingest member-bank data, calculate risk scores, and auto-categorize participants, replacing a slow multi-day manual process with a quick automated workflow',
      'Modernised a legacy monolith from Java 6 to Java 8, moving business logic behind REST services — improved performance and left the codebase far easier to maintain',
      'Owned four applications full stack — APIs, UI, SQL schema design, and testing — with a strong track record for production stability',
    ],
    tech: ['Java 6 → 8', 'Spring', 'REST', 'Oracle', 'SQL', 'Tomcat', 'AngularJS', 'JSP', 'JPA', 'Git'],
  },
];

export default experience;
