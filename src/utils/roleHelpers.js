import { PAGE_PERMISSIONS, FEATURE_PERMISSIONS } from '../constants/permissions';

export function canAccessPage(role, path) {
  const allowed = PAGE_PERMISSIONS[path];
  return allowed ? allowed.includes(role) : false;
}

export function hasPermission(role, feature) {
  const allowed = FEATURE_PERMISSIONS[feature];
  return allowed ? allowed.includes(role) : false;
}
