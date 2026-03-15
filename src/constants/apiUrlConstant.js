export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

export const AUTH_URLS = {
  LOGIN: `${BASE_URL}/api/auth/login`,
  LOGOUT: `${BASE_URL}/api/auth/logout`,
  REFRESH_TOKEN: `${BASE_URL}/api/auth/refresh`,
};

export const ADMIN_URLS = {
  DASHBOARD: `${BASE_URL}/api/admin/dashboard`,
  STUDENTS: `${BASE_URL}/api/admin/students`,
  ASSESSMENTS: `${BASE_URL}/api/admin/assessments`,
  DEPARTMENTS: `${BASE_URL}/api/admin/departments`,
  ANALYTICS: `${BASE_URL}/api/admin/analytics`,
  RISK_MONITOR: `${BASE_URL}/api/admin/risk-monitor`,
  REPORTS: `${BASE_URL}/api/admin/reports`,
  SETTINGS: `${BASE_URL}/api/admin/settings`,
  COLLEGES: `${BASE_URL}/api/admin/colleges`,
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
