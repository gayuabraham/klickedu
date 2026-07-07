export const SUMMARY_STAT_ITEMS = [
  {
    key: 'total',
    title: 'Total Leads',
    previewTitle: 'All Leads',
    filterStatus: '',
    iconBg: 'bg-slate-100 text-slate-700',
    activeRing: 'ring-violet-300 bg-violet-50/50',
    trendColor: 'text-emerald-600',
    iconName: 'users',
  },
  {
    key: 'new',
    title: 'New Leads',
    previewTitle: 'New Leads',
    filterStatus: 'New',
    iconBg: 'bg-blue-100 text-blue-600',
    activeRing: 'ring-blue-300 bg-blue-50/50',
    trendColor: 'text-blue-600',
    iconName: 'userPlus',
  },
  {
    key: 'contacted',
    title: 'Contacted',
    previewTitle: 'Contacted Leads',
    filterStatus: 'Contacted',
    iconBg: 'bg-orange-100 text-orange-600',
    activeRing: 'ring-orange-300 bg-orange-50/50',
    trendColor: 'text-orange-600',
    iconName: 'phone',
  },
  {
    key: 'qualified',
    title: 'Qualified',
    previewTitle: 'Qualified Leads',
    filterStatus: 'Qualified',
    iconBg: 'bg-violet-100 text-violet-600',
    activeRing: 'ring-violet-300 bg-violet-50/60',
    trendColor: 'text-violet-600',
    iconName: 'badge',
  },
  {
    key: 'closed',
    title: 'Closed',
    previewTitle: 'Closed Leads',
    filterStatus: 'Closed',
    iconBg: 'bg-emerald-100 text-emerald-600',
    activeRing: 'ring-emerald-300 bg-emerald-50/50',
    trendColor: 'text-emerald-600',
    iconName: 'check',
  },
];

export function getLeadsExploreUrl(filterStatus) {
  return filterStatus ? `/leads?status=${encodeURIComponent(filterStatus)}` : '/leads';
}

export function filterLeadsByStat(leads, statKey) {
  if (statKey === 'total') return leads;
  const item = SUMMARY_STAT_ITEMS.find((entry) => entry.key === statKey);
  if (!item?.filterStatus) return leads;
  return leads.filter((lead) => lead.status === item.filterStatus);
}
