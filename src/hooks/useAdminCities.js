import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../api/adminApi';

export function useAdminCities(enabled = true) {
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCities = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getCities();
      setCities(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('[useAdminCities] failed:', err);
      setError(err.message);
      setCities([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!enabled) return;
    fetchCities();
  }, [fetchCities]);

  const createCity = async (data) => {
    try {
      await adminApi.createCity(data);
      await fetchCities();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateCity = async (id, data) => {
    try {
      await adminApi.updateCity(id, data);
      await fetchCities();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const toggleCity = async (id) => {
    try {
      await adminApi.toggleCity(id);
      await fetchCities();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteCity = async (id) => {
    try {
      await adminApi.deleteCity(id);
      await fetchCities();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    cities,
    loading,
    error,
    refetch: fetchCities,
    createCity,
    updateCity,
    toggleCity,
    deleteCity,
  };
}
