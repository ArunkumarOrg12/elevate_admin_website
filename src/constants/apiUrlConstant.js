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
  // Assessment sub-resources
  QUESTIONS: '/api/v1/assessments/questions',
  PAPER_SETS: '/api/v1/assessments/paper-sets',
  QUESTION_BANK: '/api/v1/assessments/bank',
  CYCLES: '/api/v1/assessments/cycles',
  GET_ALL_ADMINS: "/api/v1/auth/all-admins",
  DELETE_ADMIN: (id) => `/api/v1/auth/admins/${id}`,
  CREATE_ADMIN: "/api/v1/auth/register",   // ← adjust to your actual endpoint
  COLLEGES: "/api/v1/college/colleges",  
  PROGRAMS:    "/api/v1/program/programs",
};

export const NOTIFICATION_API = {
  // ── User-scoped ──────────────────────────────────────────────────────────
  INBOX:                    '/api/v1/notification/inbox',
  BROADCAST:                '/api/v1/notification/broadcast',
  READ_ALL:                 '/api/v1/notification/read-all',
  READ_ONE:                 (id) => `/api/v1/notification/${id}/read`,
  DELETE_ALL:               '/api/v1/notification',
  DELETE_ONE:               (id) => `/api/v1/notification/${id}`,

  // ── Admin-scoped (cascade deletes across ALL users) ───────────────────────
  BROADCAST_HISTORY:        '/api/v1/notification/broadcast',          // GET
  ADMIN_DELETE_ONE:         (id) => `/api/v1/notification/broadcast/${id}`, // DELETE — removes from every recipient
  ADMIN_DELETE_ALL:         '/api/v1/notification/broadcast',          // DELETE — wipes all broadcasts for all users
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
  NOTIFICATIONS: ['notifications'],
};

export const STUDENT_API = {
  GET_ALL_STUDENTS: '/api/v1/student',
  CREATE_STUDENT:   '/api/v1/student',
  DEPARTMENTS:      '/api/v1/department/departments',  // ← used by useGetDepartments
  BULK_UPLOAD: '/api/v1/student/bulk-upload'
};