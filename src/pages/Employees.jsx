import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLeadsContext } from '../context/LeadsContext';
import Avatar from '../components/common/Avatar';
import ErrorState from '../components/common/ErrorState';
import { TableSkeleton } from '../components/common/Skeleton';

export default function Employees() {
  const { employees, leads, loading, error, reload, setNavbar } = useLeadsContext();

  useEffect(() => {
    setNavbar({ title: 'Employees' });
  }, [setNavbar]);

  const employeeRows = useMemo(() => {
    return employees.map((name) => ({
      name,
      leadCount: leads.filter((lead) => lead.assignedEmployee === name).length,
    }));
  }, [employees, leads]);

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl">
        <TableSkeleton rows={6} />
      </div>
    );
  }

  if (error) return <ErrorState message={error} onRetry={reload} />;

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Sales Team</h2>
        <p className="mt-0.5 text-xs text-slate-500">{employees.length} employees</p>
      </div>

      <div className="card-elevated overflow-hidden">
        <div className="divide-y divide-slate-100">
          {employeeRows.map((employee, index) => (
            <Link
              key={employee.name}
              to={`/leads?employee=${encodeURIComponent(employee.name)}`}
              className={`flex items-center gap-3 px-4 py-3 transition-colors hover:bg-violet-50/40 sm:px-5 sm:py-3.5 ${
                index % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'
              }`}
            >
              <Avatar name={employee.name} size="md" />
              <div className="min-w-0 flex-1">
                <p className="font-medium text-slate-900">{employee.name}</p>
                <p className="text-xs text-slate-500">Sales Counselor</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold text-slate-900">{employee.leadCount}</p>
                <p className="text-[10px] text-slate-500">assigned leads</p>
              </div>
              <svg className="h-4 w-4 shrink-0 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
