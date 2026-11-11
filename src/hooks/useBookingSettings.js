import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../api/adminApi';

export const DEFAULT_BOOKING_SETTINGS = {
  allowSpecialistSelection: false,
  specialistSelectionMode: 'auto',
  showStaffRatings: true,
  mandatoryTimeSelection: true,
  minAdvanceBookingHours: 2,
  maxAdvanceBookingDays: 30,
  timeSelectionOnServicePage: false,
  showCalendarInQuickView: true,
  requireTermsApproval: true,
  termsRequireExplicitCheckbox: true,
  termsPageUrl: '/terms',
  customOtpSenderEnabled: true,
  smsGatewayProvider: 'Taqnyat',
  senderName: 'Relax-Spa',
  smsRemainingBalance: 1450,
  autoResendTimeoutSeconds: 60,
};

const DEFAULT = DEFAULT_BOOKING_SETTINGS;

export function useBookingSettings() {
  const [settings, setSettings] = useState(DEFAULT);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminApi.getBookingSettings();
      setSettings({ ...DEFAULT, ...data });
    } catch (err) {
      console.error('[useBookingSettings] failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const update = async (patch) => {
    setSaving(true);
    try {
      const data = await adminApi.updateBookingSettings(patch);
      setSettings({ ...DEFAULT, ...data });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setSaving(false);
    }
  };

  return { settings, loading, error, saving, update, refetch: load };
}
