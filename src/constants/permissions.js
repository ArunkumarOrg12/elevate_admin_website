import { ROLES } from './roles';

export const PAGE_PERMISSIONS = {
  '/dashboard': [ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN],
  '/students': [ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN],
  '/assessments': [ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN],
  '/departments': [ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN],
  '/analytics': [ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN],
  '/risk-monitor': [ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN],
  '/reports': [ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN],
  '/settings': [ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN],
  '/college-management': [ROLES.SUPER_ADMIN],
};

export const FEATURE_PERMISSIONS = {
  collegeDropdown: [ROLES.SUPER_ADMIN],
  scheduleAssessment: [ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN],
  scheduleReport: [ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN],
  sendAlert: [ROLES.SUPER_ADMIN, ROLES.COLLEGE_ADMIN],
  bulkExport: [ROLES.SUPER_ADMIN],
  userManagement: [ROLES.SUPER_ADMIN],
  eiThresholds: [ROLES.SUPER_ADMIN],
  security: [ROLES.SUPER_ADMIN],
  collegeManagement: [ROLES.SUPER_ADMIN],
};
