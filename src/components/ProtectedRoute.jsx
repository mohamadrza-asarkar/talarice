import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../context';

export function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin, isLoadingUser } = useApp();
  const location = useLocation();

  if (isLoadingUser) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '60vh', gap: '0.75rem', color: '#fef08a' }}>
        <i className="fa-solid fa-wheat-awn fa-spin text-2xl text-amber-400" />
        <p style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>در حال بررسی دسترسی...</p>
      </div>
    );
  }

  if (requireAdmin) {
    // Let Admin component render its dedicated AdminAuthModal if not admin
    return children;
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;
