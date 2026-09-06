import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRole, ROLE_TO_PATH } from '../../context/RoleContext';
import type { RoleType } from '../../types';

interface ProtectedRouteProps {
  allowedRoles: RoleType[];
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { isAuthenticated, currentUser, currentRole } = useRole();

  if (!isAuthenticated || !currentUser) {
    return <Navigate to="/login" replace />;
  }

  const effectiveRole = currentUser.role || currentRole;

  if (!allowedRoles.includes(effectiveRole)) {
    // Logged in, but wrong role for this page — send them to their own authorized dashboard
    const fallbackPath = ROLE_TO_PATH[effectiveRole] || '/';
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
