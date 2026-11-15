/**
 * cmsApi.js — Frontend wrapper for public CMS endpoints
 *
 * Endpoints (public, no auth):
 *   GET /cms/pages
 *   GET /cms/pages/:slug
 *   GET /cms/faqs
 *   GET /cms/banners
 */

const API_BASE =
  import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

async function apiFetch(path) {
  const res = await fetch(`${API_BASE}${path}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const error = new Error(err?.message || `API ${res.status}: ${res.statusText}`);
    error.status = res.status;
    throw error;
  }
  const json = await res.json();
  if (!json.success) {
    throw new Error(json?.message || 'API error');
  }
  return json.data;
}

export const cmsApi = {
  getPages: () => apiFetch('/cms/pages'),
  getPage: (slug) => apiFetch(`/cms/pages/${encodeURIComponent(slug)}`),
  getFaqs: () => apiFetch('/cms/faqs'),
  getBanners: () => apiFetch('/cms/banners'),
};
