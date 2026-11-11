import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../api/adminApi';

export const WEEKDAY_LABELS = {
  0: 'الأحد',
  1: 'الإثنين',
  2: 'الثلاثاء',
  3: 'الأربعاء',
  4: 'الخميس',
  5: 'الجمعة',
  6: 'السبت',
};

/**
 * يجيب الموظفات (STAFF) من /admin/users
 * ويرجّع كل تفاصيل StaffProfile:
 * rating, reviewsCount, city, commissionRate, specialties, offDays, ...
 */
export function useAdminStaff() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStaff = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const users = await adminApi.getUsers();
      const staffOnly = (Array.isArray(users) ? users : [])
        .filter((u) => u.role === 'STAFF' && u.staffProfile?.id)
        .map((u) => {
          const sp = u.staffProfile || {};
          return {
            // identity
            id: u.id, // userId — للاستخدام في الحذف/التعديل
            userId: u.id,
            staffProfileId: sp.id,
            staffCode: sp.staffCode,

            // basic info
            name: u.name,
            phone: u.phone,
            email: u.email,
            role: sp.roleTitle || 'أخصائية',
            roleTitle: sp.roleTitle,

            // status & rating
            status: sp.status,
            isActive: u.isActive,
            isPartOfTeam: sp.isPartOfTeam ?? false,
            rating: sp.rating != null ? Number(sp.rating) : 5,
            reviewsCount: sp.reviewsCount ?? 0,
            completedBookingsCount: sp.completedBookingsCount ?? 0,

            // location & commission
            cityId: sp.cityId,
            city: sp.city || null,
            commissionRate: sp.commissionRate != null ? Number(sp.commissionRate) : 20,

            // media
            avatar: sp.avatarUrl || null,
            avatarUrl: sp.avatarUrl || null,

            // relations
            specialties: Array.isArray(sp.specialties) ? sp.specialties : [],
            offDays: Array.isArray(sp.offDays) ? sp.offDays : [],
            offDayLabels: Array.isArray(sp.offDays)
              ? sp.offDays
                  .map((d) => WEEKDAY_LABELS[d.weekday])
                  .filter(Boolean)
              : [],

            // legacy placeholders (لم تعد موجودة في DB)
            totalEarningsMonth: 0,
          };
        });
      setStaff(staffOnly);
    } catch (err) {
      console.error('[useAdminStaff] failed:', err);
      setError(err.message);
      setStaff([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  return { staff, loading, error, refetch: fetchStaff };
}
