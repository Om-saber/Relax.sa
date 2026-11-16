/**
 * staffApi.js — Frontend wrapper for Staff Portal endpoints
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

function getToken() {
  try {
    return localStorage.getItem('letsrelax_access_token') || '';
  } catch {
    return '';
  }
}

async function apiFetch(path, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (res.status === 204) return null;

  const json = await res.json().catch(() => ({}));

  if (!res.ok || json.success === false) {
    const msg =
      json?.error?.message ||
      json?.message ||
      `API ${res.status}: ${res.statusText}`;
    throw new Error(msg);
  }

  return json.data;
}

export const staffApi = {
  getTodayBookings: () => apiFetch('/admin/staff/bookings/today'),
  getUpcomingBookings: () => apiFetch('/admin/staff/bookings/upcoming'),
  getCommissionSummary: () => apiFetch('/admin/staff/commissions/summary'),
  updateBookingStatus: (id, status) =>
    apiFetch(`/admin/staff/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};
