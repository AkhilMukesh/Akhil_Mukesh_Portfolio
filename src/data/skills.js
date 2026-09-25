/**
 * Full-stack skills, curated to what I can whiteboard or discuss in depth.
 * Backend and frontend lead (that's the primary positioning); AI is a strong
 * secondary set.
 *
 * `icon` is a string KEY (resolved via src/data/iconMap.js) rather than a
 * component, so this shape is identical to what Supabase stores — the same
 * renderer handles both live DB data and this offline fallback.
 * Each skill also carries the brand color used by its tech.
 */
const skills = [
  {
    category: 'AI Engineering',
    items: [
      { name: 'Python',                   icon: 'SiPython',      color: '#3776AB' },
      { name: 'Generative AI',            icon: 'HiSparkles',    color: '#8B5CF6' },
      { name: 'LLMs',                     icon: 'HiChatBubbleLeftRight', color: '#10A37F' },
      { name: 'Retrieval-Augmented Generation (RAG)', icon: 'HiMagnifyingGlass', color: '#14B8A6' },
      { name: 'LangChain',                icon: 'SiLangchain',   color: '#00BB7E' },
      { name: 'LangGraph',                icon: 'HiShare',       color: '#1C3D5A' },
      { name: 'OpenAI / Anthropic Claude', icon: 'SiOpenai',     color: '#10A37F' },
      { name: 'FastAPI',                  icon: 'SiFastapi',     color: '#009688' },
      { name: 'Vector DBs (FAISS, Pinecone)', icon: 'HiCircleStack', color: '#22c55e' },
      { name: 'AI Agents',                icon: 'HiCpuChip',     color: '#8B5CF6' },
      { name: 'Prompt Engineering',       icon: 'HiCodeBracket', color: '#A855F7' },
    ],
  },
  {
    category: 'Backend',
    items: [
      { name: 'Java',              icon: 'FaJava',          color: '#F89820' },
      { name: 'Spring Boot',       icon: 'SiSpringboot',    color: '#6DB33F' },
      { name: 'Spring Security',   icon: 'SiSpringsecurity', color: '#6DB33F' },
      { name: 'Microservices',     icon: 'HiCube',          color: '#8B5CF6' },
      { name: 'REST APIs / API Design', icon: 'HiArrowsRightLeft', color: '#2563EB' },
      { name: 'System Design',     icon: 'HiSquares2X2',    color: '#6366F1' },
      { name: 'Distributed Systems',    icon: 'HiCubeTransparent', color: '#4F46E5' },
      { name: 'Event-Driven Architecture', icon: 'HiBolt',  color: '#7C3AED' },
      { name: 'Scalability & High Availability', icon: 'HiRocketLaunch', color: '#0891B2' },
      { name: 'Performance Optimization',  icon: 'HiChartBar', color: '#059669' },
      { name: 'Legacy Modernization',  icon: 'HiWrenchScrewdriver', color: '#B45309' },
    ],
  },
  {
    category: 'Frontend',
    items: [
      { name: 'Angular',            icon: 'SiAngular',    color: '#DD0031' },
      { name: 'React',              icon: 'SiReact',      color: '#61DAFB' },
      { name: 'TypeScript',         icon: 'SiTypescript', color: '#3178C6' },
      { name: 'JavaScript',         icon: 'SiJavascript', color: '#F7DF1E' },
      { name: 'RxJS / Redux',       icon: 'SiRedux',      color: '#764ABC' },
      { name: 'HTML5 / CSS3',       icon: 'SiHtml5',      color: '#E34F26' },
      { name: 'Responsive Design',  icon: 'HiDevicePhoneMobile', color: '#0EA5E9' },
      { name: 'Next.js',            icon: 'SiNextdotjs',  color: '#737373' },
    ],
  },
  {
    category: 'Cloud & DevOps',
    items: [
      { name: 'AWS',            icon: 'FaAws',          color: '#FF9900' },
      { name: 'Azure',          icon: 'FaMicrosoft',    color: '#0078D4' },
      { name: 'Docker',         icon: 'SiDocker',       color: '#2496ED' },
      { name: 'Kubernetes',     icon: 'SiKubernetes',   color: '#326CE5' },
      { name: 'GitLab CI/CD',   icon: 'SiGitlab',       color: '#FC6D26' },
      { name: 'HashiCorp Vault', icon: 'SiVault',       color: '#FFEC6E' },
      { name: 'Blue-Green Deployments', icon: 'HiArrowPathRoundedSquare', color: '#0891B2' },
    ],
  },
  {
    category: 'Data & Messaging',
    items: [
      { name: 'SQL',             icon: 'HiTableCells',     color: '#0EA5E9' },
      { name: 'Oracle / PL-SQL', icon: 'HiCircleStack',    color: '#F80000' },
      { name: 'PostgreSQL',      icon: 'SiPostgresql',     color: '#4169E1' },
      { name: 'MongoDB',         icon: 'SiMongodb',        color: '#47A248' },
      { name: 'Cassandra',       icon: 'SiApachecassandra', color: '#1287B1' },
      { name: 'Redis / Caching', icon: 'SiRedis',          color: '#DC382D' },
      { name: 'Kafka',           icon: 'SiApachekafka',    color: '#231F20' },
      { name: 'RabbitMQ',        icon: 'SiRabbitmq',       color: '#FF6600' },
      { name: 'Splunk',          icon: 'SiSplunk',         color: '#65A637' },
      { name: 'Observability & Monitoring', icon: 'HiPresentationChartLine', color: '#F59E0B' },
      { name: 'Data Modeling',   icon: 'HiRectangleGroup', color: '#8B5CF6' },
    ],
  },
  {
    category: 'Leadership & Practices',
    items: [
      { name: 'Technical Leadership',   icon: 'HiUserGroup', color: '#4F46E5' },
      { name: 'Architecture & Code Reviews', icon: 'HiClipboardDocumentCheck', color: '#6366F1' },
      { name: 'Mentoring',              icon: 'HiUsers',   color: '#10B981' },
      { name: 'Stakeholder Management', icon: 'HiHandRaised', color: '#F59E0B' },
      { name: 'Agile / Scrum',          icon: 'HiArrowPath', color: '#EC4899' },
      { name: 'Test Automation',        icon: 'HiBeaker',  color: '#14B8A6' },
    ],
  },
];

export default skills;
