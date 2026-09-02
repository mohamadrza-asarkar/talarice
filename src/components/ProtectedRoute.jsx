import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../context';
import { InitialLoadingScreen } from './maintenanceScreen';

/**
 * کامپوننت محافظت از مسیرها (Protected Route)
 * در صورتی که کاربر وارد نشده باشد، او را به صفحه لاگین هدایت می‌کند
 * و آدرس صفحه قبلی را ذخیره می‌کند تا پس از ورود به همان‌جا برگردد.
 */
export function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin, isLoadingUser } = useApp();
  const location = useLocation();

  // در حال بررسی اعتبار کاربر
  if (isLoadingUser) {
    return <InitialLoadingScreen />;
  }

  // ۱. هدایت کاربر مهمان به صفحه ورود
  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // ۲. در صورتی که دسترسی مدیریت نیاز باشد ولی کاربر ادمین نباشد
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/profile" replace />;
  }

  return children;
}

export default ProtectedRoute;
