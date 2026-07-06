import { Link } from 'react-router-dom';
import Avatar from '../common/Avatar';
import StatusBadge from '../common/StatusBadge';
import { formatDate } from '../../utils/dateUtils';

export default function RecentLeads({ leads }) {
  return (
    <div className="card-elevated overflow-hidden">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 sm:px-5 sm:py-4">
        <div>
          <h3 className="text-sm font-semibold text-slate-900">Recent Leads</h3>
          <p className="text-xs text-slate-500">Latest course inquiries from students</p>
        </div>
        <Link
          to="/leads"
          className="text-xs font-medium text-violet-600 transition-colors hover:text-violet-700"
        >
          View all
        </Link>
      </div>

      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[640px] text-xs">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:px-5">Lead</th>
              <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:px-5">Course</th>
              <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:px-5">Assigned</th>
              <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:px-5">Status</th>
              <th className="px-4 py-2.5 text-left text-[10px] font-semibold uppercase tracking-wider text-slate-500 sm:px-5">Created</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, index) => (
              <tr
                key={lead.id}
                className={`transition-colors hover:bg-slate-50 ${index % 2 === 1 ? 'bg-slate-50/40' : 'bg-white'}`}
              >
                <td className="px-4 py-3 sm:px-5">
                  <div className="flex items-center gap-2.5">
                    <Avatar name={lead.name} size="sm" />
                    <div className="min-w-0">
                      <p className="font-medium text-slate-900">{lead.name}</p>
                      <p className="truncate text-[11px] text-slate-500">{lead.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-700 sm:px-5">{lead.courseInterested}</td>
                <td className="px-4 py-3 sm:px-5">
                  <div className="flex items-center gap-2">
                    <Avatar name={lead.assignedEmployee} size="xs" />
                    <span className="text-slate-700">{lead.assignedEmployee}</span>
                  </div>
                </td>
                <td className="px-4 py-3 sm:px-5">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="px-4 py-3 text-slate-500 sm:px-5">{formatDate(lead.createdDate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="divide-y divide-slate-100 md:hidden">
        {leads.map((lead) => (
          <div key={lead.id} className="px-4 py-3 transition-colors hover:bg-slate-50">
            <div className="flex items-start gap-3">
              <Avatar name={lead.name} size="sm" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="font-medium text-slate-900">{lead.name}</p>
                    <p className="truncate text-[11px] text-slate-500">{lead.email}</p>
                  </div>
                  <StatusBadge status={lead.status} />
                </div>
                <p className="mt-1.5 text-[11px] text-slate-600">{lead.courseInterested}</p>
                <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
                  <div className="flex items-center gap-1.5">
                    <Avatar name={lead.assignedEmployee} size="xs" />
                    <span>{lead.assignedEmployee}</span>
                  </div>
                  <span>{formatDate(lead.createdDate)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
