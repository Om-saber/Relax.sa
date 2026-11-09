/**
 * useBookings.js — React hooks لبيانات الحجوزات
 */

import { useState, useEffect, useCallback } from 'react';
import { bookingsApi } from '../api/bookingsApi';

// ─────────────────────────────────────────
// useMyBookings — حجوزات المستخدمة الحالية
// ─────────────────────────────────────────
export function useMyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await bookingsApi.getMy();
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('[useMyBookings] failed:', err);
      setError(err.message);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  return { bookings, loading, error, refetch: fetchBookings };
}

// ─────────────────────────────────────────
// useAvailableSlots — المواعيد المتاحة
// ─────────────────────────────────────────
export function useAvailableSlots(date, city) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState(null);

  const fetchSlots = useCallback(async () => {
    if (!date) return;
    setLoading(true);
    setError(null);
    try {
      const data = await bookingsApi.getAvailableSlots(date, city);
      setSlots(data.slots || []);
      setMeta({
        isBlackout: data.isBlackout,
        blackoutReason: data.blackoutReason,
        dailyFull: data.dailyFull,
        dailyAvailable: data.dailyAvailable,
        dailyCapacity: data.dailyCapacity,
      });
    } catch (err) {
      console.error('[useAvailableSlots] failed:', err);
      setError(err.message);
      setSlots([]);
    } finally {
      setLoading(false);
    }
  }, [date, city]);

  useEffect(() => {
    fetchSlots();
  }, [fetchSlots]);

  return { slots, loading, error, meta, refetch: fetchSlots };
}

// ─────────────────────────────────────────
// useBooking — حجز واحد
// ─────────────────────────────────────────
export function useBooking(id) {
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBooking = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await bookingsApi.getById(id);
      setBooking(data);
    } catch (err) {
      console.error('[useBooking] failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchBooking();
  }, [fetchBooking]);

  return { booking, loading, error, refetch: fetchBooking };
}
