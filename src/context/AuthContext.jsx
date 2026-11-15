import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';


const normalizeRole = (backendRole) => {
  const r = (backendRole || '').toUpperCase();
  if (r === 'CUSTOMER' || r === 'CLIENT') return 'client';
  if (r === 'STAFF' || r === 'SPECIALIST') return 'staff';
  if (r === 'ADMIN' || r === 'SUPER_ADMIN') return 'admin';
  return r.toLowerCase();
};

export const requestOtp = async (phoneNumber, name = '') => {
  try {
    const cleaned = (phoneNumber ?? '').replace(/\D/g, '');
    if (cleaned.length < 9) throw new Error('رقم جوال غير صحيح');
    const res = await fetch(`${API_BASE}/auth/otp/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: cleaned, ...(name ? { name: name.trim() } : {}) }),
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

export const verifyOtp = async (phoneNumber, code, name = '') => {
  try {
    const cleaned = (phoneNumber ?? '').replace(/\D/g, '');
    const res = await fetch(`${API_BASE}/auth/otp/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: cleaned, code, ...(name ? { name: name.trim() } : {}) }),
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

export const refreshAccessToken = async () => {
  try {
    const storedRefresh = localStorage.getItem('letsrelax_refresh_token');
    if (!storedRefresh) throw new Error('No refresh token');

    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: storedRefresh }),
    });
    const data = await res.json();
    if (!res.ok || !data.success) throw new Error(data.message || 'Refresh failed');

    if (data.data?.accessToken) {
      localStorage.setItem('letsrelax_access_token', data.data.accessToken);
    }
    if (data.data?.refreshToken) {
      localStorage.setItem('letsrelax_refresh_token', data.data.refreshToken);
    }
    return { success: true };
  } catch (err) {
    console.error('[refreshAccessToken] failed:', err);
    return { success: false, error: err.message };
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

  // Auto-refresh access token every 14 minutes (token TTL is 15m)
  const refreshIntervalRef = useRef(null);

  useEffect(() => {
    if (!user) {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
      return;
    }

    const doRefresh = async () => {
      const result = await refreshAccessToken();
      if (!result.success) {
        console.warn('[auto-refresh] failed — logging out');
        setUser(null);
        localStorage.removeItem('letsrelax_auth_user');
        localStorage.removeItem('letsrelax_access_token');
        localStorage.removeItem('letsrelax_refresh_token');
      }
    };

    // Delay first refresh to 14 min (let login flow finish)
    refreshIntervalRef.current = setInterval(doRefresh, 14 * 60 * 1000);

    return () => {
      if (refreshIntervalRef.current) {
        clearInterval(refreshIntervalRef.current);
        refreshIntervalRef.current = null;
      }
    };
  }, [user]);

  const loginWithPhone = async (phoneNumber, otpCode = null, name = '') => {
    setLoading(true);
    try {
      if (otpCode && otpCode.length === 4) {
        const result = await verifyOtp(phoneNumber, otpCode, name);
        if (result.success) {
          setUser(result.user);
          if (result.accessToken) localStorage.setItem('letsrelax_access_token', result.accessToken);
          if (result.refreshToken) localStorage.setItem('letsrelax_refresh_token', result.refreshToken);
        }
        setLoading(false);
        return result;
      }
      const result = await requestOtp(phoneNumber, name);
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


  const clearLocalSession = () => {
    setUser(null);
    localStorage.removeItem('letsrelax_auth_user');
    localStorage.removeItem('letsrelax_access_token');
    localStorage.removeItem('letsrelax_refresh_token');
  };

  // P1-21: 401 interceptor. All API modules call fetch directly, so we wrap fetch once here.
  // On a 401 from the API (except /auth/* itself) we refresh once and retry the request once
  // with the new token; if the refresh fails we log out locally. Concurrent 401s share one refresh.
  useEffect(() => {
    const originalFetch = window.fetch;
    let refreshInFlight = null;

    window.fetch = async (input, init = {}) => {
      const response = await originalFetch(input, init);

      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : null;
      if (
        response.status !== 401 ||
        !url ||
        !url.startsWith(API_BASE) ||
        url.startsWith(`${API_BASE}/auth/`) ||
        !localStorage.getItem('letsrelax_refresh_token')
      ) {
        return response;
      }

      if (!refreshInFlight) {
        refreshInFlight = refreshAccessToken().finally(() => {
          refreshInFlight = null;
        });
      }
      const refreshed = await refreshInFlight;
      if (!refreshed.success) {
        clearLocalSession();
        return response;
      }

      const headers = new Headers(init.headers || {});
      headers.set('Authorization', `Bearer ${localStorage.getItem('letsrelax_access_token')}`);
      return originalFetch(input, { ...init, headers });
    };

    return () => {
      window.fetch = originalFetch;
    };
  }, []);

  // P1-20a: invalidate refresh token on server; local clear in finally
  // The tokens are read first, then the local session is cleared right away, because the callers
  // call logout() without awaiting and navigate immediately (e.g. to /staff-login). Clearing again
  // in finally guarantees a local logout even if the server call fails (e.g. 401 on an expired
  // access token, or offline).
  const logout = async () => {
    const refreshToken = localStorage.getItem('letsrelax_refresh_token');
    const accessToken = localStorage.getItem('letsrelax_access_token');
    clearLocalSession();

    try {
      if (!refreshToken) return;
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({ refreshToken }),
        // Let the request finish even if the page navigates or unloads.
        keepalive: true,
      });
    } catch (err) {
      console.warn('[logout] server logout failed; local session cleared anyway:', err);
    } finally {
      clearLocalSession();
    }
  };

  const updateUser = (updates) => setUser((p) => (p ? { ...p, ...updates } : null));

  const value = {
    user, loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isStaff: user?.role === 'staff',
    isClient: user?.role === 'client',
    requestOtp, verifyOtp, loginWithPhone, loginWithPassword, logout, updateUser, refreshAccessToken,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
