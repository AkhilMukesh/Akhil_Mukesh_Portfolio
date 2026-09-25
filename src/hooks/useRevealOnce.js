import { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

/**
 * Scroll-reveal trigger for a section, with a guaranteed fallback.
 *
 * Why this exists instead of calling useInView directly:
 *
 *  1. The old call was `useInView(ref, { margin: '-100px' })`, and that margin
 *     applies to ALL FOUR sides. On a 375px-wide phone it shrinks the detection
 *     box to 175px wide, which made the trigger unreliable — sections stayed at
 *     opacity 0 and the page rendered blank while still taking up height.
 *     We only ever wanted a *vertical* inset, so the margin is now
 *     `0px 0px -12% 0px` (bottom only): fire slightly before the section's top
 *     edge reaches the viewport bottom, with no horizontal shrinking.
 *
 *  2. Reveal-on-scroll should never be the only thing standing between a
 *     visitor and the content. If the observer hasn't fired shortly after
 *     mount — restored scroll position, a short page where the section is
 *     already past the trigger line, reduced-motion, an observer hiccup — we
 *     reveal anyway. Late content beats invisible content.
 *
 *  3. Users who asked for reduced motion skip the animation entirely.
 *
 * @returns {[React.RefObject, boolean]} ref to attach, and whether to reveal
 */
export function useRevealOnce({ fallbackMs = 600 } = {}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' });
  const [forced, setForced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const prefersReduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      setForced(true);
      return undefined;
    }

    // Safety net: if the observer hasn't reported the section visible by now,
    // show it regardless so content is never permanently hidden.
    const t = window.setTimeout(() => setForced(true), fallbackMs);
    return () => window.clearTimeout(t);
  }, [fallbackMs]);

  return [ref, inView || forced];
}
