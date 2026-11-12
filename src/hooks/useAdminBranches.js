import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../api/adminApi';

export function useAdminBranches(cityId) {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBranches = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getBranches(cityId);
      setBranches(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('[useAdminBranches] failed:', err);
      setError(err.message);
      setBranches([]);
    } finally {
      setLoading(false);
    }
  }, [cityId]);

  useEffect(() => {
    fetchBranches();
  }, [fetchBranches]);

  const createBranch = async (data) => {
    try {
      await adminApi.createBranch(data);
      await fetchBranches();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateBranch = async (id, data) => {
    try {
      await adminApi.updateBranch(id, data);
      await fetchBranches();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const toggleBranch = async (id) => {
    try {
      await adminApi.toggleBranch(id);
      await fetchBranches();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteBranch = async (id) => {
    try {
      await adminApi.deleteBranch(id);
      await fetchBranches();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    branches,
    loading,
    error,
    refetch: fetchBranches,
    createBranch,
    updateBranch,
    toggleBranch,
    deleteBranch,
  };
}
