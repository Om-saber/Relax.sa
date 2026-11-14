import { useState, useEffect, useCallback } from 'react';
import { staffApi } from '../api/staffApi';

export function useStaffBookings(enabled = true) {
  const [todayBookings, setTodayBookings] = useState([]);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
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
      const [today, upcoming] = await Promise.all([
        staffApi.getTodayBookings(),
        staffApi.getUpcomingBookings(),
      ]);
      setTodayBookings(Array.isArray(today) ? today : []);
      setUpcomingBookings(Array.isArray(upcoming) ? upcoming : []);
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
    loading,
    error,
    refetch: fetchAll,
    updateStatus,
  };
}
