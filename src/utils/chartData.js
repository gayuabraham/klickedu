import { STATUS_COLORS } from '../constants/leadStatus';

export const CHART_PRIMARY = '#7C3AED';
export const CHART_ACCENT = '#6366F1';

export function buildStatusPieData(stats) {
  return [
    { name: 'New', value: stats.new, color: STATUS_COLORS.New },
    { name: 'Contacted', value: stats.contacted, color: STATUS_COLORS.Contacted },
    { name: 'Qualified', value: stats.qualified, color: STATUS_COLORS.Qualified },
    { name: 'Closed', value: stats.closed, color: STATUS_COLORS.Closed },
  ].filter((item) => item.value > 0);
}

const MONTH_LABELS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function toWeekdayLabel(date) {
  const day = date.getDay();
  const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return names[day];
}

export function buildMonthlyGrowth(leads) {
  const counts = {};

  for (const lead of leads) {
    const date = new Date(lead.createdDate);
    const label = MONTH_LABELS[date.getMonth()];
    counts[label] = (counts[label] || 0) + 1;
  }

  return MONTH_LABELS.filter((month) => counts[month]).map((month) => ({
    month,
    leads: counts[month],
  }));
}

export function buildWeeklyEnquiries(leads) {
  const counts = Object.fromEntries(WEEKDAY_LABELS.map((day) => [day, 0]));

  for (const lead of leads) {
    const label = toWeekdayLabel(new Date(lead.createdDate));
    if (counts[label] !== undefined) {
      counts[label] += 1;
    }
  }

  return WEEKDAY_LABELS.map((day) => ({
    day,
    enquiries: counts[day],
  }));
}
