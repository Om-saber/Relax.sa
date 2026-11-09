/**
 * bookingsApi.js — Frontend wrapper for Bookings endpoints
 */

const API_BASE =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

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
      json?.message ||
      json?.error?.message ||
      `API ${res.status}: ${res.statusText}`;
    throw new Error(msg);
  }

  return json.data;
}

export const bookingsApi = {
  // Public
  getAvailableSlots: (date, city) => {
    const q = new URLSearchParams({ date });
    if (city) q.set('city', city);
    return apiFetch(`/bookings/available-slots?${q.toString()}`);
  },

  create: (data) =>
    apiFetch('/bookings', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  // Protected (requires JWT)
  getMy: () => apiFetch('/bookings/me'),

  getById: (id) => apiFetch(`/bookings/${id}`),

  cancel: (id, reason) =>
    apiFetch(`/bookings/${id}/cancel`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    }),

  reschedule: (id, date, timeSlotKey) =>
    apiFetch(`/bookings/${id}/reschedule`, {
      method: 'PATCH',
      body: JSON.stringify({ date, timeSlotKey }),
    }),
};
