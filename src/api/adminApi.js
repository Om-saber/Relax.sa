/**
 * adminApi.js — Frontend wrapper for Admin endpoints
 *
 * All endpoints require a Bearer JWT (admin user).
 * Token is read from localStorage (letsrelax_access_token).
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

export const adminApi = {
  // ── Users ─────────────────────────────────────────────
  getUsers: (params = {}) => {
    const q = new URLSearchParams();
    if (params.roleKey) q.set('roleKey', params.roleKey);
    if (params.roleId) q.set('roleId', params.roleId);
    if (params.isActive !== undefined) q.set('isActive', String(params.isActive));
    if (params.search) q.set('search', params.search);
    const qs = q.toString();
    return apiFetch(`/admin/users${qs ? `?${qs}` : ''}`);
  },

  createUser: (data) =>
    apiFetch('/admin/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateUser: (id, data) =>
    apiFetch(`/admin/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  deleteUser: (id) =>
    apiFetch(`/admin/users/${id}`, { method: 'DELETE' }),

  resetPassword: (id) =>
    apiFetch(`/admin/users/${id}/reset-password`, { method: 'POST' }),

  // ── Roles & Permissions ───────────────────────────────
  getRoles: () => apiFetch('/admin/roles'),

  getPermissions: () => apiFetch('/admin/permissions'),

  updateRolePermissions: (roleId, permissions) =>
    apiFetch(`/admin/roles/${roleId}/permissions`, {
      method: 'PATCH',
      body: JSON.stringify({ permissions }),
    }),

  // ── Overview ───────────────────────────────────────────
  getOverview: () => apiFetch('/admin/overview'),

  // ── Services (CRUD) ─────────────────────────────────────
  getServices: (params = {}) => {
    const q = new URLSearchParams();
    if (params.categoryKey) q.set('categoryKey', params.categoryKey);
    if (params.search) q.set('search', params.search);
    if (params.isActive !== undefined) q.set('isActive', String(params.isActive));
    const qs = q.toString();
    return apiFetch(`/admin/services${qs ? '?' + qs : ''}`);
  },

  createService: (data) =>
    apiFetch('/admin/services', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateService: (id, data) =>
    apiFetch(`/admin/services/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  toggleService: (id) =>
    apiFetch(`/admin/services/${id}/toggle`, { method: 'PATCH' }),

  deleteService: (id) =>
    apiFetch(`/admin/services/${id}`, { method: 'DELETE' }),

  // ── Cities (CRUD) ───────────────────────────────────────
  getCities: () => apiFetch('/admin/cities'),

  createCity: (data) =>
    apiFetch('/admin/cities', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateCity: (id, data) =>
    apiFetch(`/admin/cities/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  toggleCity: (id) =>
    apiFetch(`/admin/cities/${id}/toggle`, { method: 'PATCH' }),

  deleteCity: (id) =>
    apiFetch(`/admin/cities/${id}`, { method: 'DELETE' }),

  // ── Clients (CRM) ───────────────────────────────────────
  getClients: (params = {}) => {
    const q = new URLSearchParams();
    if (params.search) q.set('search', params.search);
    if (params.tier) q.set('tier', params.tier);
    const qs = q.toString();
    return apiFetch(`/admin/clients${qs ? '?' + qs : ''}`);
  },

  getClient: (id) => apiFetch(`/admin/clients/${id}`),

  addClientNote: (id, note) =>
    apiFetch(`/admin/clients/${id}/notes`, {
      method: 'POST',
      body: JSON.stringify({ note }),
    }),

  // ── Booking Assignment ─────────────────────────────────
  updateStaffOffDays: (staffProfileId, weekdays) =>
    apiFetch(`/admin/staff-profiles/${staffProfileId}/off-days`, {
      method: 'PATCH',
      body: JSON.stringify({ weekdays }),
    }),

  assignBooking: (id, specialistId) =>
    apiFetch(`/admin/bookings/${id}/assign`, {
      method: 'PATCH',
      body: JSON.stringify({ specialistId }),
    }),

  // ── Bookings ───────────────────────────────────────────
  getBookings: (params = {}) => {
    const q = new URLSearchParams();
    if (params.cityKey) q.set('cityKey', params.cityKey);
    if (params.status) q.set('status', params.status);
    if (params.search) q.set('search', params.search);
    if (params.page) q.set('page', String(params.page));
    if (params.limit) q.set('limit', String(params.limit));
    const qs = q.toString();
    return apiFetch(`/admin/bookings${qs ? '?' + qs : ''}`);
  },

  updateBookingStatus: (id, status) =>
    apiFetch(`/admin/bookings/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
};
