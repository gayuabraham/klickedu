export const LEAD_SOURCES = [
  'Website',
  'Instagram',
  'Facebook',
  'Google Ads',
  'Referral',
  'Walk-In',
  'Education Fair',
  'WhatsApp',
];

export const PREFERRED_COUNTRIES = [
  'Canada',
  'Australia',
  'United Kingdom',
  'USA',
  'Germany',
  'Ireland',
  'New Zealand',
  'Other',
];

export const PREFERRED_INTAKES = [
  'January 2026',
  'May 2026',
  'September 2026',
  'January 2027',
];

export const PREFERRED_COURSES = [
  'Data Science',
  'Artificial Intelligence',
  'Cyber Security',
  'Computer Science',
  'Business Analytics',
  'MBA',
  'UI/UX Design',
  'Digital Marketing',
  'Full Stack Development',
];

export const PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

export const QUALIFICATIONS = [
  'High School',
  'Diploma',
  "Bachelor's",
  "Master's",
  'PhD',
  'Other',
];

export const ENGLISH_TESTS = [
  { value: 'none', label: 'None' },
  { value: 'ielts', label: 'IELTS' },
  { value: 'toefl', label: 'TOEFL' },
  { value: 'pte', label: 'PTE' },
  { value: 'duolingo', label: 'Duolingo' },
  { value: 'other', label: 'Other' },
];

export const FOLLOWUP_TYPES = [
  { value: 'call', label: 'Call' },
  { value: 'email', label: 'Email' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'meeting', label: 'Meeting' },
  { value: 'other', label: 'Other' },
];

/** Keep a select pre-selected even if the value is not in the standard list. */
export function withCurrentOption(options, current) {
  if (!current) return options;
  if (options.includes(current)) return options;
  return [current, ...options];
}

export function getPriorityLabel(value) {
  const match = PRIORITIES.find((item) => item.value === value);
  return match ? match.label : value || '—';
}
