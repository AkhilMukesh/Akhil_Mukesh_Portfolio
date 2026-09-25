/**
 * Returns the number of full years since the career started.
 * Updates automatically based on the current date.
 *
 * Career start: Feb 2016 (Software Engineer at TCS — first role from resume).
 */
const CAREER_START = new Date(2016, 1, 1); // month is 0-indexed: 1 = February

export function getYearsOfExperience(now = new Date()) {
  let years = now.getFullYear() - CAREER_START.getFullYear();
  const monthDiff = now.getMonth() - CAREER_START.getMonth();
  const dayDiff = now.getDate() - CAREER_START.getDate();

  // Subtract a year if we haven't yet passed the anniversary this year
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    years -= 1;
  }

  return years;
}

/** Formatted string like "10+" for display. */
export function getYearsOfExperienceLabel(now = new Date()) {
  return `${getYearsOfExperience(now)}+`;
}
