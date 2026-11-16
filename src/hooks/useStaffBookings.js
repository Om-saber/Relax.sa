import { useState, useEffect, useCallback } from 'react';
import { staffApi } from '../api/staffApi';

export function useStaffBookings(enabled = true) {
  const [todayBookings, setTodayBookings] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [commissions, setCommissions] = useState({ total: 0, pending: 0, paid: 0, count: 0 });
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      const [today, upcoming, summary] = await Promise.all([
        staffApi.getTodayBookings(),
        staffApi.getUpcomingBookings(),
        // A failed summary must not hide the bookings list.
        staffApi.getCommissionSummary().catch(() => null),
      ]);
      setTodayBookings(Array.isArray(today) ? today : []);
      setUpcomingBookings(Array.isArray(upcoming) ? upcoming : []);
      if (summary) setCommissions(summary);
    } catch (err) {
      setError(err.message);
      setTodayBookings([]);
      setUpcomingBookings([]);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const updateStatus = async (id, status) => {
    try {
      await staffApi.updateBookingStatus(id, status);
      await fetchAll();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    todayBookings,
    upcomingBookings,
    commissions,
    loading,
    error,
    refetch: fetchAll,
    updateStatus,
  };
}
