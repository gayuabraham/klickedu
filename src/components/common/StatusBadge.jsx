import { STATUS_BADGE_CLASS } from '../../constants/leadStatus';

export default function StatusBadge({ status, compact = false }) {
  const sizeClass = compact
    ? 'px-1.5 py-px text-[9px] font-semibold'
    : 'px-2.5 py-0.5 text-[11px] font-semibold';

  return (
    <span
      className={`inline-flex items-center rounded-full ${sizeClass} ${STATUS_BADGE_CLASS[status] || 'bg-slate-100 text-slate-600'}`}
    >
      {status}
    </span>
  );
}
