import { useEffect, useMemo, useState } from 'react';
import { useLeadsContext } from '../context/LeadsContext';
import { useDashboard } from '../hooks/useDashboard';
import { SUMMARY_STAT_ITEMS, filterLeadsByStat } from '../constants/summaryStatsConfig';
import DashboardHero from '../components/dashboard/DashboardHero';
import SummaryStatsPanel from '../components/dashboard/SummaryStatsPanel';
import LeadPreview from '../components/dashboard/LeadPreview';
import DashboardCharts from '../components/dashboard/DashboardCharts';
import RecentLeads from '../components/dashboard/RecentLeads';
import { DashboardSkeleton } from '../components/common/Skeleton';
import ErrorState from '../components/common/ErrorState';

export default function Dashboard() {
  const { leads, lastUpdated, setNavbar, currentUser, reload: reloadLeads } = useLeadsContext();
  const {
    stats,
    byCountry,
    bySource,
    byIntake,
    monthlyAdmissions,
    loading,
    error,
    reload: reloadDashboard,
  } = useDashboard(lastUpdated);
  const [selectedStatKey, setSelectedStatKey] = useState(null);

  useEffect(() => {
    setNavbar({ title: 'Dashboard' });
  }, [setNavbar]);

  function handleSelectStat(key) {
    setSelectedStatKey((current) => (current === key ? null : key));
  }

  function handleRetry() {
    reloadDashboard();
    reloadLeads();
  }

  const selectedItem = SUMMARY_STAT_ITEMS.find((item) => item.key === selectedStatKey) || null;

  const previewLeads = useMemo(() => {
    if (!selectedStatKey) return [];
    return filterLeadsByStat(leads, selectedStatKey).sort(
      (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
    );
  }, [leads, selectedStatKey]);

  if (loading) return <DashboardSkeleton />;
  if (error || !stats) return <ErrorState message={error || 'Failed to load dashboard'} onRetry={handleRetry} />;

  const recentLeads = [...leads]
    .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
    .slice(0, 6);

  return (
    <div className="w-full space-y-4 sm:space-y-5 max-md:space-y-3">
      <DashboardHero leadCount={stats.totalStudents} lastUpdated={lastUpdated} firstName={currentUser.firstName} />

      <SummaryStatsPanel stats={stats} selectedStatKey={selectedStatKey} onSelectStat={handleSelectStat} />

      {selectedItem && (
        <LeadPreview
          title={selectedItem.previewTitle}
          count={previewLeads.length}
          leads={previewLeads}
          onClose={() => setSelectedStatKey(null)}
        />
      )}

      <DashboardCharts
        byCountry={byCountry}
        bySource={bySource}
        byIntake={byIntake}
        monthlyAdmissions={monthlyAdmissions}
      />
      <RecentLeads leads={recentLeads} />
    </div>
  );
}
