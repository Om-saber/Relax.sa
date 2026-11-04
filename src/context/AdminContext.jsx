import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_BOOKINGS,
  INITIAL_STAFF,
  INITIAL_CLIENTS,
  INITIAL_COMPLAINTS,
  INITIAL_ROLES,
  INITIAL_CITY_CONFIG,
  INITIAL_BLACKOUTS,
  INITIAL_CMS_CONTENT,
  INITIAL_BOOKING_SETTINGS,
} from '../data/mockAdminData';
import { SERVICES as BASE_SERVICES } from '../data/servicesData';

const AdminContext = createContext();

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

export const AdminProvider = ({ children }) => {
  // 1. Bookings
  const [bookings, setBookings] = useState(() => {
    try {
      const saved = localStorage.getItem('letsrelax_admin_bookings');
      return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
    } catch {
      return INITIAL_BOOKINGS;
    }
  });

  // 2. Staff
  const [staffList, setStaffList] = useState(() => {
    try {
      const saved = localStorage.getItem('letsrelax_admin_staff');
      return saved ? JSON.parse(saved) : INITIAL_STAFF;
    } catch {
      return INITIAL_STAFF;
    }
  });

  // 3. Clients
  const [clients, setClients] = useState(() => {
    try {
      const saved = localStorage.getItem('letsrelax_admin_clients');
      return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
    } catch {
      return INITIAL_CLIENTS;
    }
  });

  // 4. Complaints / Support
  const [complaints, setComplaints] = useState(() => {
    try {
      const saved = localStorage.getItem('letsrelax_admin_complaints');
      return saved ? JSON.parse(saved) : INITIAL_COMPLAINTS;
    } catch {
      return INITIAL_COMPLAINTS;
    }
  });

  // 5. Roles
  const [roles, setRoles] = useState(() => {
    try {
      const saved = localStorage.getItem('letsrelax_admin_roles');
      return saved ? JSON.parse(saved) : INITIAL_ROLES;
    } catch {
      return INITIAL_ROLES;
    }
  });

  // 6. Cities & Branches
  const [cityConfigs, setCityConfigs] = useState(() => {
    try {
      const saved = localStorage.getItem('letsrelax_admin_cities');
      return saved ? JSON.parse(saved) : INITIAL_CITY_CONFIG;
    } catch {
      return INITIAL_CITY_CONFIG;
    }
  });

  // 7. Services
  const [servicesList, setServicesList] = useState(() => {
    try {
      const saved = localStorage.getItem('letsrelax_admin_services');
      return saved ? JSON.parse(saved) : BASE_SERVICES;
    } catch {
      return BASE_SERVICES;
    }
  });

  // 8. Blackout dates
  const [blackouts, setBlackouts] = useState(() => {
    try {
      const saved = localStorage.getItem('letsrelax_admin_blackouts');
      return saved ? JSON.parse(saved) : INITIAL_BLACKOUTS;
    } catch {
      return INITIAL_BLACKOUTS;
    }
  });

  // 9. Site Content CMS
  const [cmsContent, setCmsContent] = useState(() => {
    try {
      const saved = localStorage.getItem('letsrelax_admin_cms');
      return saved ? JSON.parse(saved) : INITIAL_CMS_CONTENT;
    } catch {
      return INITIAL_CMS_CONTENT;
    }
  });

  // 10. Booking & Verification Settings (خيارات وإعدادات الحجز والتحقق)
  const [bookingSettings, setBookingSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('letsrelax_booking_settings');
      return saved ? { ...INITIAL_BOOKING_SETTINGS, ...JSON.parse(saved) } : INITIAL_BOOKING_SETTINGS;
    } catch {
      return INITIAL_BOOKING_SETTINGS;
    }
  });

  // Persist all state
  useEffect(() => {
    localStorage.setItem('letsrelax_admin_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('letsrelax_admin_staff', JSON.stringify(staffList));
  }, [staffList]);

  useEffect(() => {
    localStorage.setItem('letsrelax_admin_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('letsrelax_admin_complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('letsrelax_admin_roles', JSON.stringify(roles));
  }, [roles]);

  useEffect(() => {
    localStorage.setItem('letsrelax_admin_cities', JSON.stringify(cityConfigs));
  }, [cityConfigs]);

  useEffect(() => {
    localStorage.setItem('letsrelax_admin_services', JSON.stringify(servicesList));
  }, [servicesList]);

  useEffect(() => {
    localStorage.setItem('letsrelax_admin_blackouts', JSON.stringify(blackouts));
  }, [blackouts]);

  useEffect(() => {
    localStorage.setItem('letsrelax_admin_cms', JSON.stringify(cmsContent));
  }, [cmsContent]);

  useEffect(() => {
    localStorage.setItem('letsrelax_booking_settings', JSON.stringify(bookingSettings));
  }, [bookingSettings]);

  // ==========================================
  // DOUBLE BOOKING CONFLICT PREVENTION (منع الحجز المزدوج)
  // ==========================================
  const checkDoubleBooking = (specialistId, date, timeSlot, excludeBookingId = null) => {
    if (!specialistId || !date || !timeSlot) return { hasConflict: false };

    const targetStaff = staffList.find((s) => s.id === specialistId);
    const staffName = targetStaff ? targetStaff.name : 'الأخصائية';

    const conflict = bookings.find((b) => {
      if (excludeBookingId && b.id === excludeBookingId) return false;
      if (b.specialistId !== specialistId) return false;
      if (b.status === 'cancelled') return false;
      return b.date === date && b.timeSlot === timeSlot;
    });

    if (conflict) {
      return {
        hasConflict: true,
        specialistName,
        conflictBooking: conflict,
        message: `⚠️ تنبيه تعارض مواعيد خطير! الأخصائية (${staffName}) لديها حجز مسبق بالفعل (${conflict.bookingNumber} - ${conflict.customerName}) في نفس التوقيت: ${date} (${timeSlot}). النظام يمنع الحجز المزدوج تماماً لحماية جودة المواعيد. يرجى اختيار أخصائية أخرى أو توقيت بديل.`,
      };
    }

    return { hasConflict: false };
  };

  // ==========================================
  // BOOKINGS ACTIONS
  // ==========================================
  const addBooking = (newBookingData) => {
    if (newBookingData.specialistId) {
      const conflictCheck = checkDoubleBooking(
        newBookingData.specialistId,
        newBookingData.date,
        newBookingData.timeSlot
      );
      if (conflictCheck.hasConflict) {
        return { success: false, error: conflictCheck.message };
      }
    }

    const newId = `BK-${Date.now().toString().slice(-4)}`;
    const newNumber = `RLX-${Math.floor(100 + Math.random() * 900)}`;

    const newBooking = {
      id: newId,
      bookingNumber: newNumber,
      createdAt: new Date().toISOString(),
      status: 'pending',
      paymentStatus: 'paid',
      commissionAmount: (newBookingData.totalPrice || 200) * 0.2,
      ...newBookingData,
    };

    setBookings((prev) => [newBooking, ...prev]);

    // Auto add/update client
    setClients((prev) => {
      const existing = prev.find((c) => c.phone === newBooking.customerPhone);
      if (existing) {
        return prev.map((c) =>
          c.phone === newBooking.customerPhone
            ? {
                ...c,
                totalBookings: c.totalBookings + 1,
                totalSpent: c.totalSpent + (newBooking.totalPrice || 0),
                lastBookingDate: newBooking.date,
              }
            : c
        );
      } else {
        const newClient = {
          id: `cl-${Date.now().toString().slice(-4)}`,
          name: newBooking.customerName,
          phone: newBooking.customerPhone,
          city: newBooking.city || 'الرياض',
          district: newBooking.district || '',
          address: newBooking.address || '',
          tier: 'Silver',
          totalBookings: 1,
          totalSpent: newBooking.totalPrice || 0,
          lastBookingDate: newBooking.date,
          notes: 'عميلة جديدة عبر الموقع',
          registeredAt: new Date().toISOString().split('T')[0],
        };
        return [newClient, ...prev];
      }
    });

    return { success: true, booking: newBooking };
  };

  const updateBookingStatus = (bookingId, newStatus) => {
    setBookings((prev) =>
      prev.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b))
    );
  };

  const reassignSpecialist = (bookingId, newSpecialistId) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, error: 'الحجز غير موجود' };

    const conflictCheck = checkDoubleBooking(
      newSpecialistId,
      booking.date,
      booking.timeSlot,
      bookingId
    );
    if (conflictCheck.hasConflict) {
      return { success: false, error: conflictCheck.message };
    }

    const staffMember = staffList.find((s) => s.id === newSpecialistId);
    if (!staffMember) return { success: false, error: 'الأخصائية غير موجودة' };

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              specialistId: staffMember.id,
              specialistName: staffMember.name,
              specialistPhone: staffMember.phone,
            }
          : b
      )
    );

    return { success: true };
  };

  const rescheduleBooking = (bookingId, newDate, newTimeSlot) => {
    const booking = bookings.find((b) => b.id === bookingId);
    if (!booking) return { success: false, error: 'الحجز غير موجود' };

    if (booking.specialistId) {
      const conflictCheck = checkDoubleBooking(
        booking.specialistId,
        newDate,
        newTimeSlot,
        bookingId
      );
      if (conflictCheck.hasConflict) {
        return { success: false, error: conflictCheck.message };
      }
    }

    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              date: newDate,
              timeSlot: newTimeSlot,
              status: 'confirmed',
            }
          : b
      )
    );

    return { success: true };
  };

  const cancelBooking = (bookingId, reason = 'إلغاء بناءً على طلب الإدارة') => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? { ...b, status: 'cancelled', notes: `${b.notes || ''} [ملغي: ${reason}]` }
          : b
      )
    );
  };

  // ==========================================
  // STAFF ACTIONS
  // ==========================================
  const addStaff = (staffData) => {
    const newStaff = {
      id: `st-${Date.now().toString().slice(-4)}`,
      rating: 5.0,
      reviewsCount: 0,
      status: 'available',
      completedBookingsCount: 0,
      totalEarningsMonth: 0,
      commissionRate: 20,
      shift: '10:00 ص - 08:00 م',
      offDays: ['الجمعة', 'السبت'],
      isPartOfTeam: false,
      email: `${staffData.name ? staffData.name.replace(/\s+/g, '.').toLowerCase() : 'staff'}@relax.sa`,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
      ...staffData,
    };
    setStaffList((prev) => [...prev, newStaff]);
    return newStaff;
  };

  const updateStaff = (id, updates) => {
    setStaffList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
  };

  const deleteStaff = (id) => {
    setStaffList((prev) => prev.filter((s) => s.id !== id));
  };

  const toggleStaffVacation = (id) => {
    setStaffList((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: s.status === 'on_leave' ? 'available' : 'on_leave',
            }
          : s
      )
    );
  };

  // ==========================================
  // CLIENT ACTIONS
  // ==========================================
  const updateClient = (id, updates) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
  };

  const addClientNote = (clientId, noteText) => {
    setClients((prev) =>
      prev.map((c) =>
        c.id === clientId
          ? { ...c, notes: `${c.notes ? c.notes + ' | ' : ''}${noteText}` }
          : c
      )
    );
  };

  // ==========================================
  // CRM & COMPLAINTS
  // ==========================================
  const addComplaint = (complaintData) => {
    const newTicket = {
      id: `TKT-${Date.now().toString().slice(-4)}`,
      ticketNumber: `CRM-${Math.floor(100 + Math.random() * 900)}`,
      createdAt: new Date().toISOString(),
      status: 'new',
      priority: 'medium',
      resolutionNotes: '',
      ...complaintData,
    };
    setComplaints((prev) => [newTicket, ...prev]);
    return newTicket;
  };

  const updateComplaintStatus = (id, newStatus, resolutionNotes = '') => {
    setComplaints((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              status: newStatus,
              resolutionNotes: resolutionNotes || c.resolutionNotes,
              resolvedAt: newStatus === 'resolved' ? new Date().toISOString() : c.resolvedAt,
            }
          : c
      )
    );
  };

  // ==========================================
  // CITIES, SERVICES & BLACKOUTS
  // ==========================================
  const updateCity = (cityId, updates) => {
    setCityConfigs((prev) =>
      prev.map((c) => (c.id === cityId ? { ...c, ...updates } : c))
    );
  };

  const updateServicePrice = (serviceId, newPrice) => {
    setServicesList((prev) =>
      prev.map((s) => (s.id === serviceId ? { ...s, price: Number(newPrice) } : s))
    );
  };

  const togglePermission = (roleId, permissionKey) => {
    setRoles((prev) =>
      prev.map((r) =>
        r.id === roleId
          ? {
              ...r,
              permissions: {
                ...r.permissions,
                [permissionKey]: !r.permissions[permissionKey],
              },
            }
          : r
      )
    );
  };

  const addBlackoutDate = (dateData) => {
    setBlackouts((prev) => [{ id: `blk-${Date.now()}`, ...dateData }, ...prev]);
  };

  const removeBlackoutDate = (id) => {
    setBlackouts((prev) => prev.filter((b) => b.id !== id));
  };

  const updateCmsContent = (updates) => {
    setCmsContent((prev) => ({ ...prev, ...updates }));
  };

  const updateBookingSetting = (key, value) => {
    setBookingSettings((prev) => ({ ...prev, [key]: value }));
  };

  const updateBookingSettings = (updates) => {
    setBookingSettings((prev) => ({ ...prev, ...updates }));
  };

  const resetBookingSettings = () => {
    setBookingSettings(INITIAL_BOOKING_SETTINGS);
    localStorage.setItem('letsrelax_booking_settings', JSON.stringify(INITIAL_BOOKING_SETTINGS));
  };

  // Analytics totals
  const totalRevenue = bookings
    .filter((b) => b.status !== 'cancelled')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const completedCount = bookings.filter((b) => b.status === 'completed').length;
  const activeCount = bookings.filter((b) =>
    ['confirmed', 'on_way', 'in_progress'].includes(b.status)
  ).length;
  const pendingCount = bookings.filter((b) => b.status === 'pending').length;
  const cancelledCount = bookings.filter((b) => b.status === 'cancelled').length;

  const totalCommissionsPaid = bookings
    .filter((b) => b.status === 'completed')
    .reduce((sum, b) => sum + (b.commissionAmount || (b.totalPrice || 200) * 0.2), 0);

  const value = {
    bookings,
    staffList,
    clients,
    complaints,
    roles,
    cityConfigs,
    servicesList,
    blackouts,
    cmsContent,
    bookingSettings,
    updateBookingSetting,
    updateBookingSettings,
    resetBookingSettings,
    totalRevenue,
    completedCount,
    activeCount,
    pendingCount,
    cancelledCount,
    totalCommissionsPaid,
    checkDoubleBooking,
    addBooking,
    updateBookingStatus,
    reassignSpecialist,
    rescheduleBooking,
    cancelBooking,
    addStaff,
    updateStaff,
    deleteStaff,
    toggleStaffVacation,
    updateClient,
    addClientNote,
    addComplaint,
    updateComplaintStatus,
    updateCity,
    updateServicePrice,
    togglePermission,
    addBlackoutDate,
    removeBlackoutDate,
    updateCmsContent,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
};

export default AdminContext;
