'use client';

import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';

interface CanProps {
  permission?: string;
  role?: string;
  roles?: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const Can: React.FC<CanProps> = ({ 
  permission, 
  role, 
  roles, 
  children, 
  fallback = null 
}) => {
  const { hasPermission, hasRole, user } = useAuthStore();

  if (!user) return <>{fallback}</>;

  // Check permission
  if (permission && !hasPermission(permission)) {
    return <>{fallback}</>;
  }

  // Check single role
  if (role && !hasRole(role)) {
    return <>{fallback}</>;
  }

  // Check multiple roles (any of)
  if (roles && !roles.some(r => hasRole(r))) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
