export function formatDate(dateString) {
  if (!dateString) return '—';
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function isDateInRange(dateString, startDate, endDate) {
  if (!startDate && !endDate) return true;
  const date = new Date(dateString + 'T00:00:00');
  if (startDate && date < new Date(startDate + 'T00:00:00')) return false;
  if (endDate && date > new Date(endDate + 'T00:00:00')) return false;
  return true;
}
