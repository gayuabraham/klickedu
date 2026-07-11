import Button from '../common/Button';
import {
  mergeFilterOptions,
  hasActiveFilters,
  getSubStageFilterOptions,
} from '../../utils/leadFilters';

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

function SelectFilter({
  label,
  value,
  onChange,
  options,
  allLabel,
  className,
  disabled = false,
  getOptionValue = (item) => item,
  getOptionLabel = (item) => item,
}) {
  return (
    <FilterField label={label}>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        className={className}
        disabled={disabled}
      >
        <option value="">{allLabel}</option>
        {options.map((item) => {
          const optionValue = getOptionValue(item);
          return (
            <option key={optionValue} value={optionValue}>
              {getOptionLabel(item)}
            </option>
          );
        })}
      </select>
    </FilterField>
  );
}

export default function LeadFilters({
  filters,
  employees,
  filterOptions = {},
  onFilterChange,
  onReset,
  onSearchChange,
  onExport,
  onAddLead,
  exportDisabled = false,
}) {
  const options = mergeFilterOptions(filterOptions);
  const subStageOptions = getSubStageFilterOptions(filters.stage);
  const filtersActive = hasActiveFilters(filters);

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
              placeholder="Name, email, or phone..."
              value={filters.search}
              onChange={(e) => handleSearchChange(e.target.value)}
              className={`${inputClassMobile} pl-9`}
            />
          </div>
        </FilterField>

        <div className="grid grid-cols-2 gap-2.5">
          <SelectFilter
            label="Stage"
            value={filters.stage}
            onChange={(value) => onFilterChange('stage', value)}
            options={options.stages}
            allLabel="All"
            className={inputClassMobile}
          />
          <SelectFilter
            label="Sub Stage"
            value={filters.subStage}
            onChange={(value) => onFilterChange('subStage', value)}
            options={subStageOptions}
            allLabel="All"
            className={inputClassMobile}
            disabled={!filters.stage}
          />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <SelectFilter
            label="Employee"
            value={filters.employee}
            onChange={(value) => onFilterChange('employee', value)}
            options={employees}
            allLabel="All"
            className={inputClassMobile}
          />
          <SelectFilter
            label="Lead Source"
            value={filters.leadSource}
            onChange={(value) => onFilterChange('leadSource', value)}
            options={options.lead_sources}
            allLabel="All"
            className={inputClassMobile}
          />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <SelectFilter
            label="Priority"
            value={filters.priority}
            onChange={(value) => onFilterChange('priority', value)}
            options={options.priorities}
            allLabel="All"
            className={inputClassMobile}
            getOptionValue={(item) => item.value}
            getOptionLabel={(item) => item.label}
          />
          <SelectFilter
            label="Preferred Intake"
            value={filters.preferredIntake}
            onChange={(value) => onFilterChange('preferredIntake', value)}
            options={options.intakes}
            allLabel="All"
            className={inputClassMobile}
          />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <SelectFilter
            label="Preferred Course"
            value={filters.course}
            onChange={(value) => onFilterChange('course', value)}
            options={options.courses}
            allLabel="All"
            className={inputClassMobile}
          />
          <SelectFilter
            label="Preferred Country"
            value={filters.country}
            onChange={(value) => onFilterChange('country', value)}
            options={options.countries}
            allLabel="All"
            className={inputClassMobile}
          />
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <FilterField label="From">
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => onFilterChange('startDate', e.target.value)}
              className={inputClassMobile}
            />
          </FilterField>
          <FilterField label="To">
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => onFilterChange('endDate', e.target.value)}
              className={inputClassMobile}
            />
          </FilterField>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          disabled={!filtersActive}
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
            Add Student
          </Button>
        </div>
      </div>

      {/* Desktop / tablet */}
      <div className="hidden md:grid md:grid-cols-2 md:gap-3 lg:grid-cols-4">
        <SelectFilter
          label="Stage"
          value={filters.stage}
          onChange={(value) => onFilterChange('stage', value)}
          options={options.stages}
          allLabel="All Stages"
          className={inputClass}
        />
        <SelectFilter
          label="Sub Stage"
          value={filters.subStage}
          onChange={(value) => onFilterChange('subStage', value)}
          options={subStageOptions}
          allLabel="All Sub Stages"
          className={inputClass}
          disabled={!filters.stage}
        />
        <FilterField label="From Date">
          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => onFilterChange('startDate', e.target.value)}
            className={inputClass}
          />
        </FilterField>
        <FilterField label="To Date">
          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => onFilterChange('endDate', e.target.value)}
            className={inputClass}
          />
        </FilterField>
      </div>

      <div className="mt-3 hidden md:grid md:grid-cols-2 md:gap-3 lg:grid-cols-4">
        <SelectFilter
          label="Assigned Employee"
          value={filters.employee}
          onChange={(value) => onFilterChange('employee', value)}
          options={employees}
          allLabel="All Employees"
          className={inputClass}
        />
        <SelectFilter
          label="Lead Source"
          value={filters.leadSource}
          onChange={(value) => onFilterChange('leadSource', value)}
          options={options.lead_sources}
          allLabel="All Sources"
          className={inputClass}
        />
        <SelectFilter
          label="Priority"
          value={filters.priority}
          onChange={(value) => onFilterChange('priority', value)}
          options={options.priorities}
          allLabel="All Priorities"
          className={inputClass}
          getOptionValue={(item) => item.value}
          getOptionLabel={(item) => item.label}
        />
        <SelectFilter
          label="Preferred Intake"
          value={filters.preferredIntake}
          onChange={(value) => onFilterChange('preferredIntake', value)}
          options={options.intakes}
          allLabel="All Intakes"
          className={inputClass}
        />
      </div>

      <div className="mt-3 hidden md:grid md:grid-cols-2 md:gap-3 lg:grid-cols-4">
        <SelectFilter
          label="Preferred Course"
          value={filters.course}
          onChange={(value) => onFilterChange('course', value)}
          options={options.courses}
          allLabel="All Courses"
          className={inputClass}
        />
        <SelectFilter
          label="Preferred Country"
          value={filters.country}
          onChange={(value) => onFilterChange('country', value)}
          options={options.countries}
          allLabel="All Countries"
          className={inputClass}
        />
      </div>

      {filtersActive && (
        <div className="mt-4 hidden justify-end md:flex">
          <Button variant="outline" size="sm" onClick={onReset}>
            Reset Filters
          </Button>
        </div>
      )}
    </div>
  );
}
