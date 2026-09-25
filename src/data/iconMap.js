/**
 * Maps a stable string key → a react-icons component.
 *
 * Why this exists:
 *   Skill icons are React components, which can't be stored in a database.
 *   So the DB stores an `icon` KEY (e.g. "SiPython") and we resolve it back
 *   to the component here at render time. `iconKeyOf()` does the reverse for
 *   seeding / saving from the admin editor.
 *
 * Adding a new icon: import it below and add it to ICON_MAP.
 */
import {
  SiReact,
  SiHtml5,
  SiCss,
  SiRedux,
  SiAngular,
  SiSpringboot,
  SiSpringsecurity,
  SiJavascript,
  SiTypescript,
  SiPython,
  SiNextdotjs,
  SiApachekafka,
  SiApachecassandra,
  SiKubernetes,
  SiDocker,
  SiGitlab,
  SiSplunk,
  SiPostgresql,
  SiMongodb,
  SiRabbitmq,
  SiOpenai,
  SiLangchain,
  SiAnthropic,
  SiFastapi,
  SiJira,
  SiGraphql,
  SiRedis,
  SiVault,
} from 'react-icons/si';
import { FaJava, FaAws, FaMicrosoft } from 'react-icons/fa';
import {
  // generic / conceptual — one per idea so the toolbox doesn't repeat itself
  HiCpuChip,
  HiCircleStack,
  HiSparkles,
  HiCube,             // microservices / containers
  HiCubeTransparent,  // distributed systems
  HiSquares2X2,       // system design / architecture
  HiArrowsRightLeft,  // REST / API design
  HiBolt,             // event-driven, performance
  HiRocketLaunch,     // scalability
  HiShieldCheck,      // security / HA
  HiChartBar,         // observability / monitoring
  HiWrenchScrewdriver,// legacy modernization
  HiPuzzlePiece,      // design patterns
  HiUsers,            // mentoring / stakeholders
  HiUserGroup,        // technical leadership
  HiClipboardDocumentCheck, // code review, agile
  HiBeaker,           // test automation
  HiArrowPath,        // CI/CD
  HiMagnifyingGlass,  // retrieval / RAG
  HiChatBubbleLeftRight, // LLMs / prompt engineering
  HiCodeBracket,      // languages / frontend generics
  HiDevicePhoneMobile,// responsive design
  HiTableCells,       // data modeling / SQL
  HiServerStack,      // cloud / infra
  HiHandRaised,       // stakeholder management
  HiRectangleGroup,   // data modeling
  HiPresentationChartLine, // observability
  HiShare,            // graph-shaped tools (LangGraph)
  HiArrowPathRoundedSquare, // blue-green / zero-downtime releases
} from 'react-icons/hi2';

export const ICON_MAP = {
  SiReact,
  SiHtml5,
  SiCss,
  SiRedux,
  SiAngular,
  SiSpringboot,
  SiSpringsecurity,
  SiJavascript,
  SiTypescript,
  SiPython,
  SiNextdotjs,
  SiApachekafka,
  SiApachecassandra,
  SiKubernetes,
  SiDocker,
  SiGitlab,
  SiSplunk,
  SiPostgresql,
  SiMongodb,
  SiRabbitmq,
  SiOpenai,
  SiLangchain,
  SiAnthropic,
  SiFastapi,
  SiJira,
  SiGraphql,
  SiRedis,
  SiVault,
  FaJava,
  FaAws,
  FaMicrosoft,
  HiCpuChip,
  HiCircleStack,
  HiSparkles,
  HiCube,
  HiCubeTransparent,
  HiSquares2X2,
  HiArrowsRightLeft,
  HiBolt,
  HiRocketLaunch,
  HiShieldCheck,
  HiChartBar,
  HiWrenchScrewdriver,
  HiPuzzlePiece,
  HiUsers,
  HiUserGroup,
  HiClipboardDocumentCheck,
  HiBeaker,
  HiArrowPath,
  HiMagnifyingGlass,
  HiChatBubbleLeftRight,
  HiCodeBracket,
  HiDevicePhoneMobile,
  HiTableCells,
  HiServerStack,
  HiHandRaised,
  HiRectangleGroup,
  HiPresentationChartLine,
  HiShare,
  HiArrowPathRoundedSquare,
};

/** Fallback icon key used when a stored key is unknown. */
export const FALLBACK_ICON_KEY = 'HiCpuChip';

/** Resolve a stored key → component (never returns undefined). */
export function iconForKey(key) {
  return ICON_MAP[key] || ICON_MAP[FALLBACK_ICON_KEY];
}

/** Reverse lookup: component → key (used when seeding from static data). */
export function iconKeyOf(component) {
  const entry = Object.entries(ICON_MAP).find(([, c]) => c === component);
  return entry ? entry[0] : FALLBACK_ICON_KEY;
}

/** Sorted list of available keys — handy for an admin icon picker. */
export const ICON_KEYS = Object.keys(ICON_MAP).sort();
