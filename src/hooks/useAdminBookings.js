import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../api/adminApi';

const STATUS_MAP = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  ON_WAY: 'on_way',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
  NO_SHOW: 'no_show',
};

function toNum(v, fallback = 0) {
  if (v === null || v === undefined) return fallback;
  const n = typeof v === 'number' ? v : parseFloat(String(v));
  return isNaN(n) ? fallback : n;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toISOString().split('T')[0];
  } catch {
    return '';
  }
}

function adaptAdminBooking(b) {
  if (!b) return null;
  const items = b.items || [];
  return {
    id: b.id,
    bookingNumber: b.bookingNumber,
    customerName: b.customerName,
    customerPhone: b.customerPhone,
    city: b.city?.nameAr || b.cityId || '',
    cityKey: b.city?.key || '',
    district: b.district || '',
    address: b.address || '',
    date: formatDate(b.date),
    timeSlot: b.timeSlot?.labelAr || b.timeSlot?.key || '',
    timeSlotKey: b.timeSlot?.key || '',
    services: items.map((it) => ({
      id: it.serviceId || it.id,
      title: it.titleAr,
      titleEn: it.titleEn,
      price: toNum(it.unitPrice),
      quantity: it.quantity,
      duration: it.durationMinutes,
    })),
    totalPrice: toNum(b.totalPrice),
    subtotal: toNum(b.subtotal || b.totalPrice),
    discountAmount: toNum(b.discountAmount),
    vatAmount: toNum(b.vatAmount),
    paymentMethod: b.paymentMethod ? String(b.paymentMethod).toLowerCase() : null,
    paymentStatus: b.paymentStatus ? String(b.paymentStatus).toLowerCase() : 'unpaid',
    status: STATUS_MAP[b.status] || String(b.status).toLowerCase(),
    specialistId: b.specialistId || null,
    specialistName: b.specialistName || b.specialist?.user?.name || b.specialist?.name || null,
    specialistPhone: b.specialistPhone || b.specialist?.user?.phone || b.specialist?.phone || null,
    notes: b.notes || '',
    createdAt: b.createdAt,
    cancelledAt: b.cancelledAt,
    cancelReason: b.cancelReason,
    _raw: b,
  };
}

export function useAdminBookings(filters = {}) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  const { cityKey, status, search, page, limit } = filters;

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getBookings({ cityKey, status, search, page, limit });
      const items = data.items || [];
      setBookings(items.map(adaptAdminBooking));
      setPagination(data.pagination || null);
    } catch (err) {
      console.error('[useAdminBookings] failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [cityKey, status, search, page, limit]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const updateStatus = async (id, newStatus) => {
    try {
      await adminApi.updateBookingStatus(id, newStatus);
      await fetchBookings();
      return { success: true };
    } catch (err) {
      console.error('[useAdminBookings.updateStatus] failed:', err);
      return { success: false, error: err.message };
    }
  };

  return { bookings, loading, error, pagination, refetch: fetchBookings, updateStatus };
}
