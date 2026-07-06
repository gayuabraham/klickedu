// Demo trends until we store historical snapshots
const TRENDS = {
  total: '+12%',
  new: '+8%',
  contacted: '+5%',
  qualified: '+15%',
  closed: '+3%',
};

export function getTrendLabel(type) {
  return TRENDS[type] || '+0%';
}
