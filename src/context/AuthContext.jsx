import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const PRESET_ACCOUNTS = [
  { phone: '0500000001', user: { id: 'adm-super', name: 'م. عبدالله آل سعود', phone: '0500000001', role: 'admin', roleId: 'super-admin', roleTitle: 'مدير النظام التنفيذي', city: 'الرياض', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' } },
  { phone: '0500000002', user: { id: 'adm-cs', name: 'هند الدوسري', phone: '0500000002', role: 'admin', roleId: 'customer-service', roleTitle: 'مسؤولة خدمة العملاء', city: 'الرياض', avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80' } },
  { phone: '0501112233', user: { id: 'st-01', name: 'فاطمة الزهراء البناني', phone: '0501112233', role: 'staff', roleTitle: 'أخصائية أولى حمام مغربي ومساج', city: 'الرياض', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80' } },
  { phone: '0501234567', user: { id: 'cl-01', name: 'سارة محمد القحطاني', phone: '0501234567', role: 'client', roleTitle: 'عميلة VIP', city: 'الرياض', district: 'حي الملقا', address: 'شارع أنس بن مالك، فيلا 14', avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80' } },
];

const normalizeRole = (backendRole) => {
  const r = (backendRole || '').toUpperCase();
  if (r === 'CUSTOMER' || r === 'CLIENT') return 'client';
  if (r === 'STAFF' || r === 'SPECIALIST') return 'staff';
  if (r === 'ADMIN' || r === 'SUPER_ADMIN') return 'admin';
  return r.toLowerCase();
};

export const requestOtp = async (phoneNumber) => {
  try {
    const cleaned = phoneNumber.replace(/\D/g, '');
    if (cleaned.length < 9) throw new Error('رقم جوال غير صحيح');
    const res = await fetch(`${API_BASE}/auth/otp/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: cleaned }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'فشل إرسال الرمز');
    return {
      success: true,
      ...(data.data?.devCode ? { devCode: data.data.devCode } : {}),
      expiresIn: data.data?.expiresIn,
      resendAfter: data.data?.resendAfter,
    };
  } catch (error) {
    console.error('OTP request failed:', error);
    return { success: false, message: error.message || 'حدث خطأ' };
  }
};

export const verifyOtp = async (phoneNumber, code) => {
  try {
    const cleaned = phoneNumber.replace(/\D/g, '');
    const res = await fetch(`${API_BASE}/auth/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: cleaned, code }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'رمز التحقق غير صحيح');
    const u = data.data.user;
    const userData = {
      id: u.id,
      name: u.name || u.phone,
      phone: u.phone,
      email: u.email || null,
      role: normalizeRole(u.role),
      roleTitle: u.roleTitle || null,
      roleKey: u.roleKey || null,
      avatarUrl: u.avatarUrl || null,
      avatar: u.avatarUrl || null,
      permissions: u.permissions || [],
    };
    return {
      success: true,
      user: userData,
      isNewUser: data.data.isNewUser,
      accessToken: data.data.accessToken,
      refreshToken: data.data.refreshToken,
      expiresIn: data.data.expiresIn,
    };
  } catch (error) {
    console.error('OTP verify failed:', error);
    return { success: false, message: error.message || 'فشل التحقق' };
  }
};

export const loginWithPasswordApi = async (email, password) => {
  try {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) {
      throw new Error(data.message || 'بريد إلكتروني أو كلمة مرور غير صحيحة');
    }
    const u = data.data.user;
    const userData = {
      id: u.id,
      name: u.name || u.email,
      phone: u.phone,
      email: u.email,
      role: normalizeRole(u.role),
      roleTitle: u.roleTitle || null,
      roleKey: u.roleKey || null,
      avatarUrl: u.avatarUrl || null,
      avatar: u.avatarUrl || null,
      permissions: u.permissions || [],
    };
    return {
      success: true,
      user: userData,
      accessToken: data.data.accessToken,
      refreshToken: data.data.refreshToken,
      expiresIn: data.data.expiresIn,
    };
  } catch (error) {
    console.error('Login failed:', error);
    return { success: false, message: error.message || 'فشل تسجيل الدخول' };
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('letsrelax_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      if (user) localStorage.setItem('letsrelax_auth_user', JSON.stringify(user));
      else localStorage.removeItem('letsrelax_auth_user');
    } catch (e) { console.error('sync failed', e); }
  }, [user]);

  const loginWithPhone = async (phoneNumber, otpCode = null, name = '') => {
    setLoading(true);
    try {
      if (otpCode && otpCode.length === 4) {
        const result = await verifyOtp(phoneNumber, otpCode);
        if (result.success) {
          setUser(result.user);
          if (result.accessToken) localStorage.setItem('letsrelax_access_token', result.accessToken);
          if (result.refreshToken) localStorage.setItem('letsrelax_refresh_token', result.refreshToken);
        }
        setLoading(false);
        return result;
      }
      const result = await requestOtp(phoneNumber);
      setLoading(false);
      return result;
    } catch (err) {
      setLoading(false);
      return { success: false, message: err.message || 'حدث خطأ' };
    }
  };

  const loginWithPassword = async (email, password) => {
    setLoading(true);
    const result = await loginWithPasswordApi(email, password);
    if (result.success) {
      setUser(result.user);
      if (result.accessToken) localStorage.setItem('letsrelax_access_token', result.accessToken);
      if (result.refreshToken) localStorage.setItem('letsrelax_refresh_token', result.refreshToken);
    }
    setLoading(false);
    return result;
  };

  const quickDemoLogin = (roleType) => {
    let target = PRESET_ACCOUNTS[0];
    if (roleType === 'staff') target = PRESET_ACCOUNTS.find((a) => a.user.role === 'staff');
    else if (roleType === 'client') target = PRESET_ACCOUNTS.find((a) => a.user.role === 'client');
    else if (roleType === 'cs') target = PRESET_ACCOUNTS.find((a) => a.user.roleId === 'customer-service');
    setUser(target.user);
    return target.user;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('letsrelax_auth_user');
    localStorage.removeItem('letsrelax_access_token');
    localStorage.removeItem('letsrelax_refresh_token');
  };

  const updateUser = (updates) => setUser((p) => (p ? { ...p, ...updates } : null));

  const value = {
    user, loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isStaff: user?.role === 'staff',
    isClient: user?.role === 'client',
    requestOtp, verifyOtp, loginWithPhone, loginWithPassword, quickDemoLogin, logout, updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
