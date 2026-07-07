import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import StatusBadge from '../common/StatusBadge';
import { getLeadsExploreUrl } from '../../constants/summaryStatsConfig';
import { formatDate } from '../../utils/dateUtils';

function LeadRow({ lead }) {
  return (
    <div className="flex items-center gap-3 px-5 py-3 transition-colors hover:bg-slate-50">
      <Avatar name={lead.name} size="sm" />
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-slate-900">{lead.name}</p>
        <p className="truncate text-xs text-slate-500">{lead.courseInterested}</p>
      </div>
      <StatusBadge status={lead.status} compact />
      <span className="hidden shrink-0 text-xs text-slate-500 sm:inline">{formatDate(lead.createdDate)}</span>
    </div>
  );
}

export default function LeadPreview({ title, count, leads, filterStatus, onClose }) {
  const exploreUrl = getLeadsExploreUrl(filterStatus);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-[60] bg-slate-900/40 backdrop-blur-md animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        className="fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl animate-slide-in-right"
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-preview-title"
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
          <div>
            <h3 id="lead-preview-title" className="text-base font-semibold text-slate-900">
              {title}
            </h3>
            <p className="mt-0.5 text-sm text-slate-500">
              {count} lead{count !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to={exploreUrl}
              className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-2 text-xs font-semibold text-white shadow-sm transition-all duration-300 hover:bg-violet-700 hover:shadow-md active:scale-[0.99]"
            >
              Explore
              <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
              aria-label="Close preview"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {leads.length === 0 ? (
            <div className="flex h-full items-center justify-center px-5 py-12 text-sm text-slate-500">
              No leads in this category.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {leads.map((lead) => (
                <LeadRow key={lead.id} lead={lead} />
              ))}
            </div>
          )}
        </div>
      </aside>
    </>,
    document.body,
  );
}
