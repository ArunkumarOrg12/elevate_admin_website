export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

// Path-only constants — used by the api instance (which already has baseURL set)
export const AUTH_PATHS = {
  SUPERADMIN_LOGIN: '/api/v1/auth/superadmin-login',
  COLLEGEADMIN_LOGIN: '/api/v1/auth/collegeadmin-login',
  LOGOUT: '/api/v1/auth/logout',
  REFRESH_TOKEN: '/api/v1/auth/refresh-token',
};

// Full URLs — kept for raw axios calls (e.g. refresh inside the interceptor)
export const AUTH_URLS = {
  LOGOUT: `${BASE_URL}${AUTH_PATHS.LOGOUT}`,
  REFRESH_TOKEN: `${BASE_URL}${AUTH_PATHS.REFRESH_TOKEN}`,
};

// Path-only constants for admin routes — used by the api instance (which already has baseURL set)
export const ADMIN_PATHS = {
  DASHBOARD: '/api/admin/dashboard',
  STUDENTS: '/api/admin/students',
  ASSESSMENTS: '/api/admin/assessments',
  DEPARTMENTS: '/api/admin/departments',
  ANALYTICS: '/api/admin/analytics',
  RISK_MONITOR: '/api/admin/risk-monitor',
  REPORTS: '/api/admin/reports',
  SETTINGS: '/api/admin/settings',
  COLLEGES: '/api/admin/colleges',
};

// Full URLs — kept for raw axios calls outside the api instance
export const ADMIN_URLS = {
  DASHBOARD: `${BASE_URL}${ADMIN_PATHS.DASHBOARD}`,
  STUDENTS: `${BASE_URL}${ADMIN_PATHS.STUDENTS}`,
  ASSESSMENTS: `${BASE_URL}${ADMIN_PATHS.ASSESSMENTS}`,
  DEPARTMENTS: `${BASE_URL}${ADMIN_PATHS.DEPARTMENTS}`,
  ANALYTICS: `${BASE_URL}${ADMIN_PATHS.ANALYTICS}`,
  RISK_MONITOR: `${BASE_URL}${ADMIN_PATHS.RISK_MONITOR}`,
  REPORTS: `${BASE_URL}${ADMIN_PATHS.REPORTS}`,
  SETTINGS: `${BASE_URL}${ADMIN_PATHS.SETTINGS}`,
  COLLEGES: `${BASE_URL}${ADMIN_PATHS.COLLEGES}`,
};

export const QUERY_KEYS = {
  DASHBOARD: ['dashboard'],
  STUDENTS: ['students'],
  ASSESSMENTS: ['assessments'],
  DEPARTMENTS: ['departments'],
  ANALYTICS: ['analytics'],
  RISK_MONITOR: ['risk-monitor'],
  REPORTS: ['reports'],
  SETTINGS: ['settings'],
  COLLEGES: ['colleges'],
};
