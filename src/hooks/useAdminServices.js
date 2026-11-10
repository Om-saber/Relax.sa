import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../api/adminApi';

export function useAdminServices(filters = {}) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { categoryKey, search, isActive } = filters;

  const fetchServices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getServices({ categoryKey, search, isActive });
      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('[useAdminServices] failed:', err);
      setError(err.message);
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, [categoryKey, search, isActive]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const createService = async (data) => {
    try {
      await adminApi.createService(data);
      await fetchServices();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateService = async (id, data) => {
    try {
      await adminApi.updateService(id, data);
      await fetchServices();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const toggleService = async (id) => {
    try {
      await adminApi.toggleService(id);
      await fetchServices();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const deleteService = async (id) => {
    try {
      await adminApi.deleteService(id);
      await fetchServices();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    services,
    loading,
    error,
    refetch: fetchServices,
    createService,
    updateService,
    toggleService,
    deleteService,
  };
}
