import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { ROLES } from '../constants/roles';

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');

  return {
    ...ctx,
    isSuperAdmin: ctx.user?.role === ROLES.SUPER_ADMIN,
    isCollegeAdmin: ctx.user?.role === ROLES.COLLEGE_ADMIN,
  };
}
