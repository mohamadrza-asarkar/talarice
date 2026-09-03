import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../context';

export function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin, isLoadingUser } = useApp();
  const location = useLocation();

  if (isLoadingUser) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <p>در حال بررسی هویت...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/profile" replace />;
  }

  return children;
}

export default ProtectedRoute;
