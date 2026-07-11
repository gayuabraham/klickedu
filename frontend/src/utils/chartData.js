export const CHART_PRIMARY = '#7C3AED';

const CHART_COLORS = [
  '#7C3AED',
  '#3B82F6',
  '#F97316',
  '#10B981',
  '#EC4899',
  '#6366F1',
  '#14B8A6',
  '#F59E0B',
];

/** Applications by Country → pie chart */
export function buildCountryPieData(byCountry = []) {
  return byCountry
    .filter((item) => item.count > 0)
    .map((item, index) => ({
      name: item.country,
      value: item.count,
      color: CHART_COLORS[index % CHART_COLORS.length],
    }));
}

/** Lead Source Distribution → bar chart */
export function buildSourceBarData(bySource = []) {
  return bySource.map((item) => ({
    source: item.source,
    count: item.count,
  }));
}

/** Short labels so intake bars stay readable */
function shortIntakeLabel(intake) {
  return String(intake || '')
    .replace('January', 'Jan')
    .replace('September', 'Sep');
}

/** Students by Preferred Intake → bar chart */
export function buildIntakeBarData(byIntake = []) {
  return byIntake.map((item) => ({
    intake: shortIntakeLabel(item.intake),
    count: item.count,
  }));
}

/** Monthly Admissions → bar chart */
export function buildMonthlyAdmissionsData(monthly = []) {
  return monthly.map((item) => ({
    month: `${item.month} ${String(item.year).slice(2)}`,
    count: item.count,
  }));
}
