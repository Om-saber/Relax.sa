/**
 * paymentsApi.js — Frontend wrapper for Payments endpoints (PayPal)
 *
 * create-order requires a logged-in user (Bearer JWT).
 * capture is public because PayPal redirects back before the session is restored.
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
    const err = new Error(
      json?.error?.message ||
        json?.message ||
        `API ${res.status}: ${res.statusText}`,
    );
    err.code = json?.error?.code;
    err.details = json?.error?.details;
    err.status = res.status;
    throw err;
  }

  return json.data;
}

export const paymentsApi = {
  /** إنشاء (أو إعادة استخدام) PayPal Order لحجز معيّن */
  createPayPalOrder: (bookingId) =>
    apiFetch('/payments/paypal/create-order', {
      method: 'POST',
      body: JSON.stringify({ bookingId }),
    }),

  /** تأكيد الدفع بعد عودة العميلة من PayPal */
  capturePayPalOrder: (orderId) =>
    apiFetch(`/payments/paypal/capture/${encodeURIComponent(orderId)}`, {
      method: 'POST',
      body: JSON.stringify({}),
    }),

  /** حالة الدفع لحجز معيّن */
  getBookingPaymentStatus: (bookingId) =>
    apiFetch(`/payments/booking/${bookingId}/status`),
};
