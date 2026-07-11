import { useState, useEffect, useCallback } from 'react';
import { fetchDashboardData } from '../services/dashboardService';

export function useDashboard(lastUpdated) {
  const [stats, setStats] = useState(null);
  const [byCountry, setByCountry] = useState([]);
  const [bySource, setBySource] = useState([]);
  const [byIntake, setByIntake] = useState([]);
  const [monthlyAdmissions, setMonthlyAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchDashboardData();
      setStats(data.stats);
      setByCountry(data.byCountry);
      setBySource(data.bySource);
      setByIntake(data.byIntake);
      setMonthlyAdmissions(data.monthlyAdmissions);
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard, lastUpdated]);

  return {
    stats,
    byCountry,
    bySource,
    byIntake,
    monthlyAdmissions,
    loading,
    error,
    reload: loadDashboard,
  };
}
