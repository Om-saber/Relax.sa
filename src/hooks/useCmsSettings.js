import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../api/adminApi';

const DEFAULT = {
  bannerAnnouncement: '',
  promoCode: '',
  promoDiscount: 0,
  supportPhone: '',
  workingHoursText: '',
};

export function useCmsSettings() {
  const [cms, setCms] = useState(DEFAULT);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.getCmsSettings();
      setCms({ ...DEFAULT, ...data });
    } catch (err) {
      console.error('[useCmsSettings] failed:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const update = async (patch) => {
    try {
      const data = await adminApi.updateCmsSettings(patch);
      setCms({ ...DEFAULT, ...data });
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  };

  return { cms, loading, update, refetch: load };
}
