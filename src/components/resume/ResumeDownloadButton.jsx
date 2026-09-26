import { HiDocumentText } from 'react-icons/hi2';

export default function ResumeDownloadButton({ className = '' }) {
  const staticHref = `${import.meta.env.BASE_URL}resume.pdf`;

  return (
    <a
      href={staticHref}
      download="Akhil-Mukesh.pdf"
      aria-label="Download resume PDF"
      className={className}
    >
      <HiDocumentText className="size-4 shrink-0" aria-hidden />
      Resume
    </a>
  );
}
