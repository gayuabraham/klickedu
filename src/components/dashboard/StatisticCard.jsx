import { getTrendLabel } from '../../utils/trends';

export default function StatisticCard({ item, value, isActive, icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group flex w-full flex-1 flex-col items-center px-3 py-3.5 text-center transition-all duration-300 hover:bg-slate-50 hover:shadow-sm sm:px-4 sm:py-4 ${
        isActive ? `ring-2 ring-inset ${item.activeRing}` : ''
      } hover:scale-[1.02] active:scale-[0.99]`}
    >
      <div className={`mb-2 flex h-9 w-9 items-center justify-center rounded-full ${item.iconBg}`}>
        {icon}
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
    </button>
  );
}

