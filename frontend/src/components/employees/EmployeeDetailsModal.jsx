import { Link } from 'react-router-dom';
import Modal from '../common/Modal';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import StatusBadge from '../common/StatusBadge';
import { LEAD_STATUSES } from '../../constants/leadStatus';
import {
  EMPLOYEE_DEPARTMENT,
  EMPLOYEE_ROLE,
  getEmployeeEmail,
  getEmployeePhone,
  getEmployeeLeadStats,
} from '../../utils/employee';

function Detail({ label, value }) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-100 py-3 last:border-0">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-right text-sm font-medium text-slate-900">{value}</span>
    </div>
  );
}

export default function EmployeeDetailsModal({ employee, leads, isOpen, onClose }) {
  if (!employee) return null;

  const stats = getEmployeeLeadStats(leads, employee.name);
  const leadsUrl = `/leads?employee=${encodeURIComponent(employee.name)}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Employee Details" subtitle={EMPLOYEE_ROLE} size="lg">
      <div className="mb-5 flex items-center gap-4 rounded-xl border border-slate-100 bg-slate-50/60 px-4 py-4">
        <Avatar name={employee.name} size="xl" />
        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-semibold text-slate-900">{employee.name}</h3>
          <p className="text-sm text-slate-500">{EMPLOYEE_ROLE}</p>
          <span className="mt-2 inline-flex items-center rounded-full bg-violet-50 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-violet-700">
            {EMPLOYEE_DEPARTMENT}
          </span>
        </div>
        <div className="hidden text-right sm:block">
          <p className="text-2xl font-bold text-violet-700">{stats.total}</p>
          <p className="text-[10px] font-medium uppercase tracking-wide text-slate-500">Assigned leads</p>
        </div>
      </div>

      <div className="mb-5 rounded-xl border border-slate-100 bg-slate-50/50 px-4">
        <Detail label="Email" value={getEmployeeEmail(employee.name)} />
        <Detail label="Phone" value={getEmployeePhone(employee.name)} />
        <Detail label="Department" value={EMPLOYEE_DEPARTMENT} />
      </div>

      <div className="mb-5">
        <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Lead pipeline</h4>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {LEAD_STATUSES.map((status) => (
            <div key={status} className="rounded-xl border border-slate-100 bg-white px-3 py-2.5 text-center">
              <p className="text-lg font-bold text-slate-900">{stats.byStatus[status] || 0}</p>
              <p className="mt-0.5 text-[10px] font-medium text-slate-500">{status}</p>
            </div>
          ))}
        </div>
      </div>

      {stats.recent.length > 0 && (
        <div className="mb-5">
          <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-400">Recent leads</h4>
          <div className="divide-y divide-slate-100 rounded-xl border border-slate-100">
            {stats.recent.map((lead) => (
              <div key={lead.id} className="flex items-center justify-between gap-3 px-4 py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-900">{lead.name}</p>
                  <p className="truncate text-xs text-slate-500">{lead.preferredCourse}</p>
                </div>
                <StatusBadge status={lead.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-3 border-t border-slate-100 pt-4">
        <Button variant="secondary" onClick={onClose}>
          Close
        </Button>
        <Link to={leadsUrl} onClick={onClose}>
          <Button>
            View all leads
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </Button>
        </Link>
      </div>
    </Modal>
  );
}
