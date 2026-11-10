import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../api/adminApi';

export function useAdminClients(filters = {}) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { search, tier } = filters;

  const fetchClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getClients({ search, tier });
      setClients(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('[useAdminClients] failed:', err);
      setError(err.message);
      setClients([]);
    } finally {
      setLoading(false);
    }
  }, [search, tier]);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const getClientDetails = async (id) => {
    try {
      const data = await adminApi.getClient(id);
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const addNote = async (id, note) => {
    try {
      const data = await adminApi.addClientNote(id, note);
      await fetchClients();
      return { success: true, data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return {
    clients,
    loading,
    error,
    refetch: fetchClients,
    getClientDetails,
    addNote,
  };
}
