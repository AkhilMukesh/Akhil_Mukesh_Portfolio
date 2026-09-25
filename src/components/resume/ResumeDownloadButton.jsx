import { useState, useCallback } from 'react';
import { HiDocumentText, HiArrowDownTray } from 'react-icons/hi2';
import { useContent } from '../../context/ContentContext';
import resumeProfile from '../../data/profile';

/**
 * Generates the resume PDF in-browser from LIVE content, on demand.
 *
 * The @react-pdf/renderer bundle is heavy, so it's lazy-loaded only when the
 * visitor actually clicks — the initial page stays lean. On any failure we
 * fall back to the committed static /resume.pdf so the button never dead-ends.
 */
export default function ResumeDownloadButton({ className = '' }) {
  const { projects, experience, skills, certifications } = useContent();
  const [state, setState] = useState('idle'); // idle | working | done | error

  const staticHref = `${import.meta.env.BASE_URL}resume.pdf`;

  const generate = useCallback(
    async (e) => {
      e.preventDefault();
      if (state === 'working') return;
      setState('working');
      try {
        // Lazy-load renderer + document only when needed.
        const [{ pdf }, { default: ResumeDocument }] = await Promise.all([
          import('@react-pdf/renderer'),
          import('./ResumeDocument'),
        ]);

        const blob = await pdf(
          <ResumeDocument
            profile={resumeProfile}
            experience={experience}
            projects={projects}
            skills={skills}
            certifications={certifications}
          />,
        ).toBlob();

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Khaza-Shaik-Resume.pdf';
        document.body.appendChild(a);
        a.click();
        a.remove();
        // Revoke on next tick so Safari has time to start the download.
        setTimeout(() => URL.revokeObjectURL(url), 4000);
        setState('done');
        setTimeout(() => setState('idle'), 2500);
      } catch (err) {
        console.error('[resume] live generation failed, using static PDF:', err);
        // Fall back to the committed static PDF.
        window.open(staticHref, '_blank', 'noopener');
        setState('error');
        setTimeout(() => setState('idle'), 2500);
      }
    },
    [state, projects, experience, skills, certifications, staticHref],
  );

  const label =
    state === 'working' ? 'Building…' : state === 'done' ? 'Downloaded' : 'Resume';

  return (
    <a
      href={staticHref}
      download="Khaza-Shaik-Resume.pdf"
      onClick={generate}
      aria-label="Download resume PDF (generated from live content)"
      aria-busy={state === 'working'}
      className={className}
    >
      {state === 'working' ? (
        <HiArrowDownTray className="size-4 shrink-0 animate-bounce" aria-hidden />
      ) : (
        <HiDocumentText className="size-4 shrink-0" aria-hidden />
      )}
      {label}
    </a>
  );
}
