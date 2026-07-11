import Button from '../common/Button';

const PAGE_SIZES = [10, 25, 50];

export default function LeadPagination({
  currentPage,
  totalPages,
  pageSize,
  totalItems,
  onPageChange,
  onPageSizeChange,
}) {
  const start = totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, totalItems);

  const pageNumbers = [];
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);
  if (endPage - startPage + 1 < maxVisible) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="card-elevated flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5 max-md:gap-4 max-md:px-4 max-md:py-4">
      <div className="flex flex-col gap-3 text-sm text-slate-500 max-md:w-full sm:flex-row sm:flex-wrap sm:items-center sm:gap-4">
        <span className="max-md:text-center">
          Showing <span className="font-semibold text-slate-900">{start}</span>–
          <span className="font-semibold text-slate-900">{end}</span> of{' '}
          <span className="font-semibold text-slate-900">{totalItems}</span> leads
        </span>
        <div className="flex items-center gap-2 max-md:w-full max-md:justify-between">
          <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Rows per page</label>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm transition-all focus:border-violet-300 focus:outline-none focus:ring-2 focus:ring-violet-500/15 max-md:min-h-11 max-md:flex-1"
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2 max-md:w-full">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className="max-md:min-h-11 max-md:flex-1"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Prev
        </Button>

        <div className="hidden items-center gap-0.5 sm:flex">
          {pageNumbers.map((page) => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`min-w-[2.25rem] rounded-lg px-2.5 py-2 text-sm font-medium transition-all ${
                page === currentPage
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {page}
            </button>
          ))}
        </div>

        <span className="min-w-[3.5rem] flex-1 text-center text-sm font-medium text-slate-600 sm:hidden">
          {currentPage} / {totalPages}
        </span>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className="max-md:min-h-11 max-md:flex-1"
        >
          Next
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
}
