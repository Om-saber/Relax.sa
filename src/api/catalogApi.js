/**
 * catalogApi.js — Frontend wrapper for Catalog endpoints
 *
 * Endpoints (public, no auth):
 *   GET /categories
 *   GET /cities
 *   GET /services?category=...&search=...&city=...
 *   GET /services/:slug
 *   GET /packages
 *   GET /packages/:slug
 */

const API_BASE =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

async function apiFetch(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message || `API ${res.status}: ${res.statusText}`);
  }
  const json = await res.json();
  if (!json.success) {
    throw new Error(json?.message || 'API error');
  }
  return json.data;
}

export const catalogApi = {
  getCategories: () => apiFetch('/categories'),

  getCities: () => apiFetch('/cities'),

  getServices: (params = {}) => {
    const q = new URLSearchParams();
    if (params.category) q.set('category', params.category);
    if (params.search) q.set('search', params.search);
    if (params.city) q.set('city', params.city);
    const qs = q.toString();
    return apiFetch(`/services${qs ? `?${qs}` : ''}`);
  },

  getService: (slug) => apiFetch(`/services/${slug}`),

  getPackages: () => apiFetch('/packages'),

  getPackage: (slug) => apiFetch(`/packages/${slug}`),
};
