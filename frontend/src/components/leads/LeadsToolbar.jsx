import Button from '../common/Button';

export default function LeadsToolbar({ totalCount, filteredCount, onExport, onAddLead }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between max-md:gap-1">
      <div>
        <h2 className="text-xl font-semibold text-slate-900 max-md:text-lg">Lead Management</h2>
        <p className="mt-1 text-sm text-slate-500 max-md:mt-0.5 max-md:text-xs">
          {filteredCount === totalCount
            ? `${totalCount} total leads in pipeline`
            : `Showing ${filteredCount} of ${totalCount} leads`}
        </p>
      </div>
      <div className="hidden flex-wrap items-center gap-2 md:flex">
        <Button variant="secondary" size="sm" onClick={onExport} disabled={totalCount === 0}>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export
        </Button>
        <Button size="sm" onClick={onAddLead}>
          <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Student
        </Button>
      </div>
    </div>
  );
}
