export function fieldClass(hasError = false) {
  return `w-full rounded-xl border px-4 py-2.5 text-sm text-slate-900 transition-colors focus:outline-none focus:ring-2 focus:ring-violet-500/20 max-md:min-h-11 ${
    hasError
      ? 'border-red-300 focus:border-red-400'
      : 'border-slate-200 focus:border-violet-400'
  }`;
}

export function FormField({ label, required, error, children, className = '' }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-slate-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

/** Label on the left, control on the right — used in details forms */
export function InlineFormField({ label, required, error, children }) {
  return (
    <div className="grid grid-cols-1 gap-1.5 border-b border-slate-50 py-3.5 last:border-0 sm:grid-cols-3 sm:gap-4 sm:items-start">
      <label className="pt-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="sm:col-span-2">
        {children}
        {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      </div>
    </div>
  );
}
