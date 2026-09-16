import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../context';

export function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin, isLoadingAuth } = useApp();
  const location = useLocation();

  if (isLoadingAuth) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] p-8 text-emerald-800" style={{ fontFamily: 'vazir, sans-serif' }}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700 ml-3"></div>
        <span>در حال بارگذاری اطلاعات حساب کاربری...</span>
      </div>
    );
  }

  return !isAuthenticated ? (
    <Navigate to="/auth" state={{ from: location }} replace />
  ) : (requireAdmin && !isAdmin) ? (
    <Navigate to="/" replace />
  ) : (
    children
  );
}

export default ProtectedRoute;
