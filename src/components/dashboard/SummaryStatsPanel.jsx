import { Link } from 'react-router-dom';
import { getTrendLabel } from '../../utils/trends';

const STAT_ITEMS = [
  {
    key: 'total',
    title: 'Total Leads',
    filterStatus: '',
    iconBg: 'bg-slate-100 text-slate-700',
    trendColor: 'text-emerald-600',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    key: 'new',
    title: 'New Leads',
    filterStatus: 'New',
    iconBg: 'bg-blue-100 text-blue-600',
    trendColor: 'text-blue-600',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
      </svg>
    ),
  },
  {
    key: 'contacted',
    title: 'Contacted',
    filterStatus: 'Contacted',
    iconBg: 'bg-orange-100 text-orange-600',
    trendColor: 'text-orange-600',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
      </svg>
    ),
  },
  {
    key: 'qualified',
    title: 'Qualified',
    filterStatus: 'Qualified',
    iconBg: 'bg-violet-100 text-violet-600',
    trendColor: 'text-violet-600',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
  },
  {
    key: 'closed',
    title: 'Closed',
    filterStatus: 'Closed',
    iconBg: 'bg-emerald-100 text-emerald-600',
    trendColor: 'text-emerald-600',
    icon: (
      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
];

function StatItem({ item, value }) {
  const to = item.filterStatus
    ? `/leads?status=${encodeURIComponent(item.filterStatus)}`
    : '/leads';

  return (
    <Link
      to={to}
      className="flex flex-1 flex-col items-center px-3 py-3.5 text-center transition-colors duration-200 hover:bg-slate-50 sm:px-4 sm:py-4"
    >
      <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-full ${item.iconBg}`}>
        {item.icon}
      </div>
      <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">{item.title}</p>
      <p className="mt-1 text-xl font-bold text-slate-900 sm:text-2xl">{value}</p>
      <p className={`mt-1 flex items-center gap-0.5 text-[10px] font-medium ${item.trendColor}`}>
        <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
        {getTrendLabel(item.key)}
      </p>
      <p className="mt-0.5 text-[9px] text-slate-400">Compared to last month</p>
    </Link>
  );
}

export default function SummaryStatsPanel({ stats }) {
  const values = {
    total: stats.total,
    new: stats.new,
    contacted: stats.contacted,
    qualified: stats.qualified,
    closed: stats.closed,
  };

  return (
    <div className="card-elevated overflow-hidden">
      <div className="grid grid-cols-2 divide-x divide-y divide-slate-100 md:grid-cols-3 lg:grid-cols-5 lg:divide-y-0">
        {STAT_ITEMS.map((item, index) => (
          <div
            key={item.key}
            className={index === STAT_ITEMS.length - 1 && STAT_ITEMS.length % 2 !== 0 ? 'col-span-2 md:col-span-1' : ''}
          >
            <StatItem item={item} value={values[item.key]} />
          </div>
        ))}
      </div>
    </div>
  );
}
