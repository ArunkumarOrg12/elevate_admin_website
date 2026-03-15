import { useAuth } from '../../hooks/useAuth';

export default function RoleGuard({ allowedRoles, fallback = null, children }) {
  const { user } = useAuth();
  if (!allowedRoles.includes(user?.role)) return fallback;
  return children;
}
