import { useEffect } from 'react';
import { useLeadsContext } from '../context/LeadsContext';
import { calculateLeadStats } from '../utils/leadStats';
import DashboardHero from '../components/dashboard/DashboardHero';
import SummaryStatsPanel from '../components/dashboard/SummaryStatsPanel';
import DashboardCharts from '../components/dashboard/DashboardCharts';
import RecentLeads from '../components/dashboard/RecentLeads';
import { DashboardSkeleton } from '../components/common/Skeleton';
import ErrorState from '../components/common/ErrorState';

export default function Dashboard() {
  const { leads, loading, error, reload, lastUpdated, setNavbar, currentUser } = useLeadsContext();

  useEffect(() => {
    setNavbar({ title: 'Dashboard' });
  }, [setNavbar]);

  if (loading) return <DashboardSkeleton />;
  if (error) return <ErrorState message={error} onRetry={reload} />;

  const stats = calculateLeadStats(leads);
  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
    .slice(0, 6);

  return (
    <div className="w-full space-y-4 sm:space-y-5">
      <DashboardHero leadCount={stats.total} lastUpdated={lastUpdated} firstName={currentUser.firstName} />
      <SummaryStatsPanel stats={stats} />
      <DashboardCharts stats={stats} leads={leads} />
      <RecentLeads leads={recentLeads} />
    </div>
  );
}
