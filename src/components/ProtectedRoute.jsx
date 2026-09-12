import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../context';

export function ProtectedRoute({ children, requireAdmin = false }) {
  const { isAuthenticated, isAdmin } = useApp();
  const location = useLocation();

  return !isAuthenticated ? (
    <Navigate to="/auth" state={{ from: location }} replace />
  ) : (requireAdmin && !isAdmin) ? (
    <Navigate to="/profile" replace />
  ) : (
    children
  );
}

export default ProtectedRoute;
