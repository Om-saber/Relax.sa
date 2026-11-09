import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/**
 * ProtectedRoute — يحمي الصفحات اللي محتاجة تسجيل دخول
 *
 * Props:
 * - children: الصفحة المحمية
 * - requiredRole: 'admin' | 'staff' | 'client' | null (لو null → أي مستخدم مسجل)
 *
 * Behavior:
 * - مش مسجل → redirect لـ /login أو /staff-login (حسب requiredRole)
 * - مسجل بدور غلط → redirect لصفحته المناسبة
 * - مسجل بالدور الصح → يعرض الصفحة
 */
const ProtectedRoute = ({ children, requiredRole = null, allowPermittedStaff = false }) => {
  const { user, isAuthenticated, loading } = useAuth();

  // Loading state (بدون redirect عشان ما يحصلش flicker)
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#FFF5F7] to-white">
        <div className="text-center">
          <div className="inline-block w-12 h-12 rounded-full border-4 border-rose-200 border-t-[#CF3A69] animate-spin" />
          <p className="mt-4 text-sm font-bold text-[#8E717D]">جاري التحقق...</p>
        </div>
      </div>
    );
  }

  // مش مسجل دخول → redirect لصفحة الدخول المناسبة
  if (!isAuthenticated) {
    const fallback =
      requiredRole === 'admin' || requiredRole === 'staff'
        ? '/staff-login'
        : '/login';
    return <Navigate to={fallback} replace />;
  }

  // مسجل بدور غلط → redirect لصفحته
  if (requiredRole && user?.role !== requiredRole) {
    // Special case: allow STAFF with permissions on admin routes
    if (
      allowPermittedStaff &&
      user?.role === 'staff' &&
      Array.isArray(user?.permissions) &&
      user.permissions.length > 0
    ) {
      return children;
    }
    const roleHome =
      user?.role === 'admin'
        ? '/dashboard'
        : user?.role === 'staff'
        ? '/staff'
        : '/client-portal';
    return <Navigate to={roleHome} replace />;
  }

  // كل حاجة تمام → اعرض الصفحة
  return children;
};

export default ProtectedRoute;
