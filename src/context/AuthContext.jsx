import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_STAFF, INITIAL_CLIENTS } from '../data/mockAdminData';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Preset demo accounts
const PRESET_ACCOUNTS = [
  {
    phone: '0500000001',
    user: {
      id: 'adm-super',
      name: 'م. عبدالله آل سعود',
      phone: '0500000001',
      role: 'admin',
      roleId: 'super-admin',
      roleTitle: 'مدير النظام التنفيذي',
      city: 'الرياض',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    },
  },
  {
    phone: '0500000002',
    user: {
      id: 'adm-cs',
      name: 'هند الدوسري',
      phone: '0500000002',
      role: 'admin',
      roleId: 'customer-service',
      roleTitle: 'مسؤولة خدمة العملاء',
      city: 'الرياض',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80',
    },
  },
  {
    phone: '0501112233',
    user: {
      id: 'st-01',
      name: 'فاطمة الزهراء البناني',
      phone: '0501112233',
      role: 'staff',
      roleTitle: 'أخصائية أولى حمام مغربي ومساج',
      city: 'الرياض',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    },
  },
  {
    phone: '0501234567',
    user: {
      id: 'cl-01',
      name: 'سارة محمد القحطاني',
      phone: '0501234567',
      role: 'client',
      roleTitle: 'عميلة VIP',
      city: 'الرياض',
      district: 'حي الملقا',
      address: 'شارع أنس بن مالك، فيلا 14',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    },
  },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('letsrelax_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('letsrelax_auth_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('letsrelax_auth_user');
      }
    } catch (e) {
      console.error('Failed to sync auth user to localStorage', e);
    }
  }, [user]);

  const normalizePhone = (num) => {
    if (!num) return '';
    let cleaned = num.toString().replace(/[\s\-\+]/g, '');
    if (cleaned.startsWith('966')) {
      cleaned = '0' + cleaned.slice(3);
    }
    return cleaned;
  };

  const loginWithPhone = async (phoneNumber, otpCode = '1234', name = '') => {
    setLoading(true);
    await new Promise((res) => setTimeout(res, 500));

    const cleaned = normalizePhone(phoneNumber);

    // 1. Preset accounts
    const preset = PRESET_ACCOUNTS.find((acc) => normalizePhone(acc.phone) === cleaned);
    if (preset) {
      setUser(preset.user);
      setLoading(false);
      return {
        success: true,
        user: preset.user,
        redirectPath:
          preset.user.role === 'admin'
            ? '/dashboard'
            : preset.user.role === 'staff'
            ? '/staff'
            : '/client-portal',
      };
    }

    // 2. Staff check
    const staffMatch = INITIAL_STAFF.find((st) => normalizePhone(st.phone) === cleaned);
    if (staffMatch) {
      const staffUser = {
        id: staffMatch.id,
        name: staffMatch.name,
        phone: staffMatch.phone,
        role: 'staff',
        roleTitle: staffMatch.role,
        city: staffMatch.city,
        avatar: staffMatch.avatar,
      };
      setUser(staffUser);
      setLoading(false);
      return { success: true, user: staffUser, redirectPath: '/staff' };
    }

    // 3. Client check
    const clientMatch = INITIAL_CLIENTS.find((cl) => normalizePhone(cl.phone) === cleaned);
    if (clientMatch) {
      const clientUser = {
        id: clientMatch.id,
        name: clientMatch.name,
        phone: clientMatch.phone,
        role: 'client',
        roleTitle: `عميلة ${clientMatch.tier}`,
        city: clientMatch.city,
        district: clientMatch.district,
        address: clientMatch.address,
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
      };
      setUser(clientUser);
      setLoading(false);
      return { success: true, user: clientUser, redirectPath: '/client-portal' };
    }

    // 4. New Client registration
    const newClientUser = {
      id: `cl-${Date.now().toString().slice(-4)}`,
      name: name.trim() || `عميلة (${cleaned.slice(-4)})`,
      phone: cleaned,
      role: 'client',
      roleTitle: 'عميلة جديدة',
      city: 'الرياض',
      district: '',
      address: '',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    };
    setUser(newClientUser);
    setLoading(false);
    return { success: true, user: newClientUser, redirectPath: '/client-portal' };
  };

  const quickDemoLogin = (roleType) => {
    let target = PRESET_ACCOUNTS[0]; // Admin by default
    if (roleType === 'staff') {
      target = PRESET_ACCOUNTS.find((a) => a.user.role === 'staff');
    } else if (roleType === 'client') {
      target = PRESET_ACCOUNTS.find((a) => a.user.role === 'client');
    } else if (roleType === 'cs') {
      target = PRESET_ACCOUNTS.find((a) => a.user.roleId === 'customer-service');
    }
    setUser(target.user);
    return target.user;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('letsrelax_auth_user');
  };

  const updateUser = (updates) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isStaff: user?.role === 'staff',
    isClient: user?.role === 'client',
    loginWithPhone,
    quickDemoLogin,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
