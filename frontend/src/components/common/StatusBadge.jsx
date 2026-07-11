import { STATUS_BADGE_CLASS, STATUS_COLORS } from '../../constants/leadStatus';

export default function StatusBadge({ status, compact = false, large = false }) {
  const sizeClass = large
    ? 'gap-2 px-3.5 py-1.5 text-sm font-semibold'
    : compact
      ? 'px-2 py-0.5 text-xs font-semibold'
      : 'px-2.5 py-1 text-xs font-semibold';

  const dotSize = large ? 'h-2.5 w-2.5' : 'h-2 w-2';

  return (
    <span
      className={`inline-flex items-center rounded-full ${sizeClass} ${STATUS_BADGE_CLASS[status] || 'bg-slate-100 text-slate-600'}`}
    >
      {large && (
        <span
          className={`shrink-0 rounded-full ${dotSize}`}
          style={{ backgroundColor: STATUS_COLORS[status] || '#94a3b8' }}
          aria-hidden="true"
        />
      )}
      {status}
    </span>
  );
}
