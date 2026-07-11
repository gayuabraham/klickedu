import Button from './Button';

export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-red-100 bg-white px-6 py-16 text-center shadow-sm">
      <div className="mb-5 flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50">
        <svg className="h-10 w-10 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>
      <h3 className="text-base font-semibold text-slate-900">Unable to load data</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-500">{message}</p>
      {onRetry && (
        <Button onClick={onRetry} className="mt-6">
          Try Again
        </Button>
      )}
    </div>
  );
}
