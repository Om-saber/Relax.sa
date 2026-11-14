import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../api/adminApi';

const DEFAULT = {
  kpis: {
    totalRevenue: 0,
    totalCommissions: 0,
    totalBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    activeBookings: 0,
    completionRate: 0,
    cancellationRate: 0,
  },
  salesByCity: [],
  topServices: [],
};

export function useAdminReports(enabled = true) {
  const [reports, setReports] = useState(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getReportsOverview();
      setReports({
        kpis: { ...DEFAULT.kpis, ...(data?.kpis || {}) },
        salesByCity: Array.isArray(data?.salesByCity) ? data.salesByCity : [],
        topServices: Array.isArray(data?.topServices) ? data.topServices : [],
      });
    } catch (err) {
      console.error('[useAdminReports] failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    load();
  }, [load]);

  return { reports, loading, error, refetch: load };
}
