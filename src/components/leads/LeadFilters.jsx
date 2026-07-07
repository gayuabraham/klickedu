import Button from '../common/Button';
import { LEAD_STATUSES } from '../../constants/leadStatus';

const inputClass =
  'w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 transition-colors focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500/15';

const inputClassMobile =
  'w-full rounded-lg border border-slate-200 bg-white px-2.5 py-2 text-sm text-slate-900 transition-colors focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500/15 min-h-10';

const labelClass = 'mb-1 block text-[10px] font-semibold uppercase tracking-wide text-slate-500';

function FilterField({ label, children }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

export default function LeadFilters({ filters, employees, onFilterChange, onReset, onSearchChange, onExport, onAddLead, exportDisabled = false }) {
  const hasActiveFilters =
    filters.status || filters.employee || filters.startDate || filters.endDate || filters.search;

  function handleSearchChange(value) {
    onSearchChange(value);
    onFilterChange('search', value);
  }

  return (
    <div className="card-elevated p-4 sm:p-5 max-md:p-3">
      {/* Mobile: compact stacked layout */}
      <div className="space-y-2.5 md:hidden">
        <FilterField label="Search">
          <div className="relative">
            <svg className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Name, mobile, or email..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className={`${inputClassMobile} pl-9`}
            />
          </div>
        </FilterField>

        <div className="grid grid-cols-2 gap-2.5">
          <FilterField label="Status">
            <select value={filters.status} onChange={(e) => onFilterChange('status', e.target.value)} className={inputClassMobile}>
              <option value="">All</option>
              {LEAD_STATUSES.map((status) => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </FilterField>
          <FilterField label="Employee">
            <select value={filters.employee} onChange={(e) => onFilterChange('employee', e.target.value)} className={inputClassMobile}>
              <option value="">All</option>
              {employees.map((emp) => (
                <option key={emp} value={emp}>{emp}</option>
              ))}
            </select>
          </FilterField>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <FilterField label="From">
            <input type="date" value={filters.startDate} onChange={(e) => onFilterChange('startDate', e.target.value)} className={inputClassMobile} />
          </FilterField>
          <FilterField label="To">
            <input type="date" value={filters.endDate} onChange={(e) => onFilterChange('endDate', e.target.value)} className={inputClassMobile} />
          </FilterField>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          disabled={!hasActiveFilters}
          className="min-h-11 w-full"
        >
          Reset Filters
        </Button>

        <div className="grid grid-cols-2 gap-2.5">
          <Button variant="secondary" size="sm" className="min-h-11 w-full" onClick={onExport} disabled={exportDisabled}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export
          </Button>
          <Button size="sm" className="min-h-11 w-full" onClick={onAddLead}>
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Lead
          </Button>
        </div>
      </div>

      {/* Desktop / tablet: unchanged layout */}
      <div className="hidden md:grid md:grid-cols-2 md:gap-3 lg:grid-cols-4">
        <FilterField label="Status">
          <select value={filters.status} onChange={(e) => onFilterChange('status', e.target.value)} className={inputClass}>
            <option value="">All Statuses</option>
            {LEAD_STATUSES.map((status) => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
        </FilterField>
        <FilterField label="Assigned Employee">
          <select value={filters.employee} onChange={(e) => onFilterChange('employee', e.target.value)} className={inputClass}>
            <option value="">All Employees</option>
            {employees.map((emp) => (
              <option key={emp} value={emp}>{emp}</option>
            ))}
          </select>
        </FilterField>
        <FilterField label="From Date">
          <input type="date" value={filters.startDate} onChange={(e) => onFilterChange('startDate', e.target.value)} className={inputClass} />
        </FilterField>
        <FilterField label="To Date">
          <input type="date" value={filters.endDate} onChange={(e) => onFilterChange('endDate', e.target.value)} className={inputClass} />
        </FilterField>
      </div>

      {hasActiveFilters && (
        <div className="mt-4 hidden justify-end md:flex">
          <Button variant="outline" size="sm" onClick={onReset}>
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
}
