import { Link } from 'react-router-dom';
import EducationIllustration from './EducationIllustration';
import LastUpdated from './LastUpdated';

export default function DashboardHero({ leadCount, lastUpdated, firstName }) {
  return (
    <div className="card-elevated overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <div className="flex flex-1 flex-col justify-center px-4 py-2 sm:px-5 sm:py-3 max-md:px-3 max-md:py-3">
          <div className="flex items-start justify-between gap-3">
            <p className="text-[10px] font-semibold uppercase tracking-wider text-violet-600">
              KlickEdu CRM
            </p>
            <LastUpdated updatedAt={lastUpdated} />
          </div>
          <h2 className="mt-1 text-base font-bold text-slate-900 sm:text-lg">
            Welcome back, <span className="brand-text">{firstName}</span>
          </h2>
          <p className="mt-0.5 max-w-md text-xs text-slate-500">
            Track course inquiries and guide students toward their dream programs.
          </p>
          <div className="mt-2.5 flex flex-wrap items-center gap-2">
            <Link
              to="/leads"
              className="inline-flex items-center gap-1.5 rounded-lg brand-accent px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition-shadow hover:shadow-md max-md:min-h-11 max-md:px-4 max-md:text-sm"
            >
              Manage Leads
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <div className="flex items-center gap-2 rounded-lg bg-violet-50 px-2.5 py-1.5 ring-1 ring-violet-200">
              <span className="text-base font-bold text-violet-700">{leadCount}</span>
              <span className="text-[10px] text-violet-500">Active leads</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-100 px-4 py-3 sm:w-[42%] lg:w-[38%] max-md:py-4">
          <EducationIllustration className="h-32 w-full max-w-[300px] drop-shadow-sm sm:h-36 max-md:h-28" />
        </div>
      </div>
    </div>
  );
}
