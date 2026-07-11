import { useEffect } from 'react';
import { useLeadsContext } from '../context/LeadsContext';

export default function PlaceholderPage({ title }) {
  const { setNavbar } = useLeadsContext();

  useEffect(() => {
    setNavbar({ title });
  }, [setNavbar, title]);

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-slate-200 bg-white px-8 py-16 text-center shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-500">This section is not available yet.</p>
    </div>
  );
}
