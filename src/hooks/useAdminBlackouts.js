import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../api/adminApi';

export function useAdminBlackouts() {
  const [blackouts, setBlackouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBlackouts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getBlackouts();
      setBlackouts(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('[useAdminBlackouts] failed:', err);
      setError(err.message);
      setBlackouts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBlackouts();
  }, [fetchBlackouts]);

  const createBlackout = async (data) => {
    try {
      await adminApi.createBlackout(data);
      await fetchBlackouts();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteBlackout = async (id) => {
    try {
      await adminApi.deleteBlackout(id);
      await fetchBlackouts();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    blackouts,
    loading,
    error,
    refetch: fetchBlackouts,
    createBlackout,
    deleteBlackout,
  };
}
