import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLeadsContext } from '../context/LeadsContext';
import Avatar from '../components/common/Avatar';
import ErrorState from '../components/common/ErrorState';
import { TableSkeleton } from '../components/common/Skeleton';
import EmployeeDetailsModal from '../components/employees/EmployeeDetailsModal';
import { EMPLOYEE_ROLE } from '../utils/employee';

export default function Employees() {
  const { employees, leads, loading, error, reload, setNavbar } = useLeadsContext();
  const [selectedEmployee, setSelectedEmployee] = useState(null);

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
      <div className="w-full space-y-4">
        <TableSkeleton rows={6} />
      </div>
    );
  }

  if (error) return <ErrorState message={error} onRetry={reload} />;

  return (
    <div className="w-full space-y-4">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Sales Team</h2>
        <p className="mt-1 text-sm text-slate-500">{employees.length} employees</p>
      </div>

      <div className="card-elevated overflow-hidden">
        <div className="divide-y divide-slate-100">
          {employeeRows.map((employee, index) => (
            <div
              key={employee.name}
              className={`flex items-center gap-2 px-2 py-2 sm:gap-3 sm:px-3 sm:py-2.5 ${
                index % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'
              }`}
            >
              <button
                type="button"
                onClick={() => setSelectedEmployee(employee)}
                className="flex min-w-0 flex-1 items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors hover:bg-violet-50/60 sm:px-4 sm:py-2.5"
              >
                <Avatar name={employee.name} size="md" />
                <div className="min-w-0 flex-1">
                  <p className="text-base font-medium text-slate-900">{employee.name}</p>
                  <p className="text-sm text-slate-500">{EMPLOYEE_ROLE}</p>
                </div>
              </button>

              <div className="shrink-0 px-2 text-right">
                <p className="text-base font-semibold text-slate-900">{employee.leadCount}</p>
                <p className="text-xs text-slate-500">assigned leads</p>
              </div>

              <Link
                to={`/leads?employee=${encodeURIComponent(employee.name)}`}
                title={`View ${employee.name}'s leads`}
                aria-label={`View leads assigned to ${employee.name}`}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-violet-100 hover:text-violet-600"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <EmployeeDetailsModal
        employee={selectedEmployee}
        leads={leads}
        isOpen={Boolean(selectedEmployee)}
        onClose={() => setSelectedEmployee(null)}
      />
    </div>
  );
}
