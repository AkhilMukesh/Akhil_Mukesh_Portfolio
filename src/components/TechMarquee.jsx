import {
  SiAngular,
  SiSpringboot,
  SiSpring,
  SiJavascript,
  SiTypescript,
  SiPython,
  SiHibernate,
  SiApachekafka,
  SiApachecassandra,
  SiKubernetes,
  SiGitlab,
  SiSplunk,
  SiOpenai,
  SiLangchain,
  SiNextdotjs,
} from 'react-icons/si';
import { FaJava, FaAws } from 'react-icons/fa';
import { HiCpuChip } from 'react-icons/hi2';

/**
 * Infinite horizontal marquee of tech icons — mirrors AuthKit's
 * "Single Sign-On / Password / MFA / Social Login..." feature strip.
 *
 * The track contains the tech list duplicated twice; the CSS animates
 * a translateX(-50%) so the loop is seamless.
 */
const TECH = [
  { Icon: FaJava, label: 'Java' },
  { Icon: SiSpringboot, label: 'Spring Boot' },
  { Icon: SiSpring, label: 'Spring' },
  { Icon: SiAngular, label: 'Angular' },
  { Icon: SiTypescript, label: 'TypeScript' },
  { Icon: SiJavascript, label: 'JavaScript' },
  { Icon: SiNextdotjs, label: 'Next.js' },
  { Icon: SiHibernate, label: 'Hibernate' },
  { Icon: SiApachekafka, label: 'Kafka' },
  { Icon: SiApachecassandra, label: 'Cassandra' },
  { Icon: SiKubernetes, label: 'Kubernetes' },
  { Icon: FaAws, label: 'AWS' },
  { Icon: SiGitlab, label: 'GitLab' },
  { Icon: SiSplunk, label: 'Splunk' },
  { Icon: SiPython, label: 'Python' },
  { Icon: SiLangchain, label: 'LangChain' },
  { Icon: SiOpenai, label: 'LLMs' },
  { Icon: HiCpuChip, label: 'AI Agents' },
];

export default function TechMarquee() {
  return (
    <div
      className="tech-marquee"
      aria-label="Technology stack"
      role="region"
    >
      <div className="tech-marquee-track">
        {[...TECH, ...TECH].map(({ Icon, label }, i) => (
          <div key={`${label}-${i}`} className="tech-marquee-item">
            <Icon className="w-5 h-5" />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
