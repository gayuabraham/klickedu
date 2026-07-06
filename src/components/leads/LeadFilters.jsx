import Button from '../common/Button';
import { LEAD_STATUSES } from '../../constants/leadStatus';

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-900 transition-colors focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500/15';

export default function LeadFilters({ filters, employees, onFilterChange, onReset, onSearchChange }) {
  const hasActiveFilters =
    filters.status || filters.employee || filters.startDate || filters.endDate || filters.search;

  function handleSearchChange(value) {
    onSearchChange(value);
    onFilterChange('search', value);
  }

  return (
    <div className="card-elevated p-4 sm:p-5">
      <div className="mb-4 md:hidden">
        <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-slate-500">
          Search
        </label>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, mobile, or email..."
            value={filters.search}
            onChange={(e) => handleSearchChange(e.target.value)}
            className={`${inputClass} pl-9`}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-slate-500">Status</label>
          <select value={filters.status} onChange={(e) => onFilterChange('status', e.target.value)} className={inputClass}>
            <option value="">All Statuses</option>
            {LEAD_STATUSES.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-slate-500">Assigned Employee</label>
          <select value={filters.employee} onChange={(e) => onFilterChange('employee', e.target.value)} className={inputClass}>
            <option value="">All Employees</option>
            {employees.map((emp) => (
              <option key={emp} value={emp}>{emp}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-slate-500">From Date</label>
          <input type="date" value={filters.startDate} onChange={(e) => onFilterChange('startDate', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-[10px] font-semibold uppercase tracking-wide text-slate-500">To Date</label>
          <input type="date" value={filters.endDate} onChange={(e) => onFilterChange('endDate', e.target.value)} className={inputClass} />
        </div>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 flex justify-end">
          <Button variant="outline" size="sm" onClick={onReset}>
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
}
