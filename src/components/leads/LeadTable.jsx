import StatusBadge from '../common/StatusBadge';
import Avatar from '../common/Avatar';
import LeadCardList from './LeadCardList';
import { formatDate } from '../../utils/dateUtils';

function ActionButton({ onClick, label, children, variant = 'default' }) {
  const styles = {
    default: 'text-slate-400 hover:bg-slate-100 hover:text-slate-700',
    view: 'text-blue-500 hover:bg-blue-50 hover:text-blue-600',
    edit: 'text-slate-400 hover:bg-violet-50 hover:text-violet-600',
  };

  return (
    <button
      onClick={onClick}
      title={label}
      className={`rounded-md p-1.5 transition-colors duration-150 ${styles[variant]}`}
    >
      {children}
    </button>
  );
}

const thClass =
  'px-3 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500';
const tdClass = 'px-3 py-3 align-middle text-sm';

export default function LeadTable({ leads, onView, onEdit }) {
  return (
    <>
      <LeadCardList leads={leads} onView={onView} onEdit={onEdit} />
      <div className="card-elevated hidden overflow-hidden md:block">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] table-fixed text-sm">
          <colgroup>
            <col className="w-[18%]" />
            <col className="w-[17%]" />
            <col className="w-[16%]" />
            <col className="w-[11%]" />
            <col className="w-[16%]" />
            <col className="w-[12%]" />
            <col className="w-[10%]" />
          </colgroup>
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-200">
              <th className={thClass}>Lead</th>
              <th className={thClass}>Contact</th>
              <th className={thClass}>Course</th>
              <th className={thClass}>Status</th>
              <th className={thClass}>Assigned</th>
              <th className={`${thClass} whitespace-nowrap`}>Created</th>
              <th className={`${thClass} whitespace-nowrap pr-4`}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead, index) => (
              <tr
                key={lead.id}
                className={`border-b border-slate-100 transition-colors duration-150 hover:bg-violet-50/30 ${
                  index % 2 === 1 ? 'bg-slate-50/60' : 'bg-white'
                }`}
              >
                <td className={`${tdClass} max-w-0`}>
                  <div className="flex min-w-0 items-center gap-2">
                    <Avatar name={lead.name} size="sm" />
                    <p className="truncate font-medium text-slate-900" title={lead.name}>
                      {lead.name}
                    </p>
                  </div>
                </td>
                <td className={`${tdClass} max-w-0`}>
                  <p className="truncate text-slate-700">{lead.mobile}</p>
                  <p className="truncate text-xs text-slate-500" title={lead.email}>
                    {lead.email}
                  </p>
                </td>
                <td className={`${tdClass} max-w-0`}>
                  <p className="truncate text-slate-700" title={lead.courseInterested}>
                    {lead.courseInterested}
                  </p>
                </td>
                <td className={tdClass}>
                  <StatusBadge status={lead.status} />
                </td>
                <td className={`${tdClass} max-w-0`}>
                  <div className="flex min-w-0 items-center gap-2">
                    <Avatar name={lead.assignedEmployee} size="sm" />
                    <span className="truncate text-slate-700" title={lead.assignedEmployee}>
                      {lead.assignedEmployee}
                    </span>
                  </div>
                </td>
                <td className={`${tdClass} whitespace-nowrap text-slate-500`}>
                  {formatDate(lead.createdDate)}
                </td>
                <td className={`${tdClass} whitespace-nowrap pr-4`}>
                  <div className="flex items-center gap-1">
                    <ActionButton onClick={() => onView(lead)} label="View lead" variant="view">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </ActionButton>
                    <ActionButton onClick={() => onEdit(lead)} label="Edit lead" variant="edit">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </ActionButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    </>
  );
}
