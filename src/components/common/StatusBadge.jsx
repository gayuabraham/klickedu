import { STATUS_BADGE_CLASS } from '../../constants/leadStatus';

export default function StatusBadge({ status, compact = false }) {
  const sizeClass = compact
    ? 'px-2 py-0.5 text-xs font-semibold'
    : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center rounded-full ${sizeClass} ${STATUS_BADGE_CLASS[status] || 'bg-slate-100 text-slate-600'}`}
    >
      {status}
    </span>
  );
}
