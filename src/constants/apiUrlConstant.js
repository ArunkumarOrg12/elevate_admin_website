export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

// Path-only constants — used by the api instance (which already has baseURL set)
export const AUTH_URLS = {
  SUPERADMIN_LOGIN: '/api/v1/auth/superadmin-login',
  COLLEGEADMIN_LOGIN: '/api/v1/auth/collegeadmin-login',
  LOGOUT: '/api/v1/auth/logout',
  REFRESH_TOKEN: '/api/v1/auth/refresh-token',
};



// Path-only constants for admin routes — used by the api instance (which already has baseURL set)
export const ADMIN_PATHS = {
  DASHBOARD: '/api/v1/dashboard',
  STUDENTS: '/api/v1/student',
  ASSESSMENTS: '/api/v1/assessments',
  DEPARTMENTS: '/api/v1/department/departments',
  ANALYTICS: '/api/v1/analytics',
  RISK_MONITOR: '/api/v1/risk-monitor',
  REPORTS: '/api/v1/reports',
  SETTINGS: '/api/v1/settings',
  COLLEGES: '/api/v1/college/colleges',
  // Assessment sub-resources
  QUESTIONS: '/api/v1/assessments/questions',
  PAPER_SETS: '/api/v1/assessments/paper-sets',
  QUESTION_BANK: '/api/v1/assessments/bank',
  CYCLES: '/api/v1/assessments/cycles',
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
  // Assessment sub-resources
  QUESTIONS: ['questions'],
  PAPER_SETS: ['paper-sets'],
  QUESTION_BANK: ['question-bank'],
  CYCLES: ['cycles'],
};

export const STUDENT_API = {
  GET_ALL_STUDENTS: '/api/v1/student',
  CREATE_STUDENT:   '/api/v1/student',
  DEPARTMENTS:      '/api/v1/department',  // ← used by useGetDepartments
};