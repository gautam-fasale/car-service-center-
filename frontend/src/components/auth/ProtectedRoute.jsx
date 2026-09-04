import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-slate-500 font-semibold">Verifying session...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!isAuthenticated || !user) {
    if (allowedRoles.includes('Admin')) {
      return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }
    if (allowedRoles.includes('ServiceCenter')) {
      return <Navigate to="/partner/login" state={{ from: location }} replace />;
    }
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role unauthorized
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.userType)) {
    if (user.userType === 'Admin') {
      return <Navigate to="/admin/dashboard" replace />;
    }
    if (user.userType === 'ServiceCenter') {
      return <Navigate to="/partner/dashboard" replace />;
    }
    return <Navigate to="/service-centers" replace />;
  }

  return children;
};
