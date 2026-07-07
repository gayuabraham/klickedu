import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import StatusBadge from '../common/StatusBadge';
import { getLeadsExploreUrl } from '../../constants/summaryStatsConfig';
import { formatDate } from '../../utils/dateUtils';

const PREVIEW_LIMIT = 5;

export default function StatLeadsPreview({ item, leads, totalCount, onClose }) {
  const previewLeads = leads.slice(0, PREVIEW_LIMIT);
  const exploreUrl = getLeadsExploreUrl(item.filterStatus);

  return (
    <div className="card-elevated overflow-hidden animate-fade-in">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">{item.previewTitle}</h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Showing {previewLeads.length} of {totalCount} lead{totalCount !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={exploreUrl}
            className="inline-flex min-h-9 items-center justify-center gap-1.5 rounded-lg brand-accent px-4 py-2 text-xs font-semibold text-white shadow-sm transition-shadow hover:shadow-md"
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
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {previewLeads.length === 0 ? (
        <p className="px-4 py-8 text-center text-sm text-slate-500 sm:px-5">No leads in this category.</p>
      ) : (
        <div className="divide-y divide-slate-100">
          {previewLeads.map((lead) => (
            <div key={lead.id} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-slate-50 sm:px-5">
              <Avatar name={lead.name} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-slate-900">{lead.name}</p>
                <p className="truncate text-xs text-slate-500">{lead.courseInterested}</p>
              </div>
              <div className="hidden shrink-0 items-center gap-2 sm:flex">
                <Avatar name={lead.assignedEmployee} size="xs" />
                <span className="max-w-[120px] truncate text-xs text-slate-600">{lead.assignedEmployee}</span>
              </div>
              <StatusBadge status={lead.status} compact />
              <span className="hidden shrink-0 text-xs text-slate-500 lg:inline">{formatDate(lead.createdDate)}</span>
            </div>
          ))}
        </div>
      )}

      {totalCount > PREVIEW_LIMIT && (
        <div className="border-t border-slate-100 bg-slate-50/50 px-4 py-2.5 text-center sm:px-5">
          <Link to={exploreUrl} className="text-xs font-medium text-violet-600 hover:text-violet-700">
            View all {totalCount} leads
          </Link>
        </div>
      )}
    </div>
  );
}
