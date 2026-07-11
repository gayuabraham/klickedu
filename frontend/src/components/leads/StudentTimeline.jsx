import { formatDateTime } from '../../utils/dateUtils';

const ACTIVITY_STYLES = {
  'Lead Created': { dot: 'bg-emerald-500', badge: 'bg-emerald-50 text-emerald-700' },
  'Lead Updated': { dot: 'bg-slate-400', badge: 'bg-slate-100 text-slate-600' },
  'Follow Up Added': { dot: 'bg-sky-500', badge: 'bg-sky-50 text-sky-700' },
  'Follow Up Completed': { dot: 'bg-teal-500', badge: 'bg-teal-50 text-teal-700' },
  'Note Added': { dot: 'bg-violet-500', badge: 'bg-violet-50 text-violet-700' },
  'Note Updated': { dot: 'bg-violet-400', badge: 'bg-violet-50 text-violet-600' },
  'Note Deleted': { dot: 'bg-rose-400', badge: 'bg-rose-50 text-rose-600' },
  'Application Submitted': { dot: 'bg-indigo-500', badge: 'bg-indigo-50 text-indigo-700' },
  'Visa Approved': { dot: 'bg-amber-500', badge: 'bg-amber-50 text-amber-700' },
  'Round Robin Assignment': { dot: 'bg-blue-500', badge: 'bg-blue-50 text-blue-700' },
};

function getStyle(activity) {
  const key = Object.keys(ACTIVITY_STYLES).find((label) =>
    activity.startsWith(label)
  );
  return ACTIVITY_STYLES[key] || { dot: 'bg-slate-300', badge: 'bg-slate-100 text-slate-600' };
}

export default function StudentTimeline({ activities = [], loading = false }) {
  if (loading) {
    return (
      <div className="mt-6 border-t border-slate-100 pt-6">
        <h3 className="text-sm font-semibold text-slate-900">Timeline</h3>
        <p className="mt-4 text-sm text-slate-400">Loading timeline...</p>
      </div>
    );
  }

  return (
    <div className="mt-6 border-t border-slate-100 pt-6">
      <h3 className="text-sm font-semibold text-slate-900">Timeline</h3>
      <p className="mt-1 text-xs text-slate-500">Every action on this student</p>

      {activities.length === 0 ? (
        <p className="mt-6 rounded-xl border border-dashed border-slate-200 py-8 text-center text-sm text-slate-400">
          No activity yet.
        </p>
      ) : (
        <ol className="relative mt-5 space-y-0 border-l border-slate-200 ml-3">
          {activities.map((item) => {
            const style = getStyle(item.activity);
            return (
              <li key={item.id} className="relative pb-5 pl-6 last:pb-0">
                <span
                  className={`absolute -left-1.5 top-1.5 h-3 w-3 rounded-full ring-4 ring-white ${style.dot}`}
                />
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-md px-2 py-0.5 text-xs font-medium ${style.badge}`}>
                    {item.activity}
                  </span>
                </div>
                <p className="mt-1.5 text-xs text-slate-400">
                  {formatDateTime(item.createdAt)}
                  {item.createdBy ? ` · ${item.createdBy}` : ''}
                </p>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
