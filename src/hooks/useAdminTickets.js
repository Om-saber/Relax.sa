import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../api/adminApi';

// Normalize enum values (NEW, HIGH, ...) to lowercase for legacy UI
function adaptTicket(t) {
  return {
    ...t,
    status: (t.status || 'NEW').toLowerCase(),
    priority: (t.priority || 'MEDIUM').toLowerCase(),
  };
}

export function useAdminTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getTickets();
      setTickets((Array.isArray(data) ? data : []).map(adaptTicket));
    } catch (err) {
      console.error('[useAdminTickets] failed:', err);
      setError(err.message);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const createTicket = async (data) => {
    try {
      await adminApi.createTicket(data);
      await fetchTickets();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  const updateStatus = async (id, status, resolutionNotes) => {
    try {
      const upper = String(status).toUpperCase();
      await adminApi.updateTicketStatus(id, upper, resolutionNotes);
      await fetchTickets();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return { tickets, loading, error, refetch: fetchTickets, createTicket, updateStatus };
}
