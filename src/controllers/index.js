// ── Default exports (raw API functions) ───────────────────────────────────────
export { default as dashboardApi } from './dashboardController';
export { default as studentsApi } from './studentsController';
export { default as assessmentsApi } from './assessmentsController';
export { default as departmentsApi } from './departmentsController';
export { default as analyticsApi } from './analyticsController';
export { default as riskMonitorApi } from './riskMonitorController';
export { default as reportsApi } from './reportsController';
export { default as settingsApi } from './settingsController';
export { default as collegesApi } from './collegesController';

// ── Auth hooks ────────────────────────────────────────────────────────────────
export { useLogin, useLogout } from './authController';

// ── Dashboard hooks ───────────────────────────────────────────────────────────
export {
  useDashboardStats,
  useEITrends,
  useRiskDistribution,
  useDepartmentComparison,
  usePlacementProgress,
  useTopPerformers,
  useRecentActivity,
} from './dashboardController';

// ── Students hooks ────────────────────────────────────────────────────────────
export {
  useGetAllStudents,
  useGetStudentById,
  useGetDepartments,
  useCreateStudent,
  useUpdateStudent,
  useDeleteStudent,
} from './studentsController';

// ── Assessments hooks ─────────────────────────────────────────────────────────
export {
  useAssessments,
  useAssessment,
  useAssessmentResults,
  useCreateAssessment,
  useUpdateAssessment,
  useDeleteAssessment,
} from './assessmentsController';

// ── Departments hooks ─────────────────────────────────────────────────────────
export {
  useDepartments,
  useDepartment,
  useDepartmentStudents,
  useCreateDepartment,
  useUpdateDepartment,
  useDeleteDepartment,
} from './departmentsController';

// ── Analytics hooks ───────────────────────────────────────────────────────────
export {
  useAnalyticsOverview,
  useAnalyticsEITrends,
  useAnalyticsDepartmentComparison,
  useAnalyticsPlacementStats,
  useAnalyticsSkillsBreakdown,
} from './analyticsController';

// ── Risk Monitor hooks ────────────────────────────────────────────────────────
export {
  useRiskMonitor,
  useRiskAlerts,
  useStudentsAtRisk,
  useAcknowledgeAlert,
} from './riskMonitorController';

// ── Reports hooks ─────────────────────────────────────────────────────────────
export {
  useReports,
  useGenerateReport,
  useDeleteReport,
} from './reportsController';

// ── Settings hooks ────────────────────────────────────────────────────────────
export {
  useSettings,
  useUpdateSettings,
  useUpdatePassword,
  useUpdateNotifications,
} from './settingsController';

// ── Colleges hooks ────────────────────────────────────────────────────────────
export {
  useColleges,
  useCollege,
  useCollegeDepartments,
  useCollegeAdmins,
  useCreateCollege,
  useUpdateCollege,
  useDeleteCollege,
} from './collegesController';

// ── Notifications hooks ───────────────────────────────────────────────────────
export { default as notificationsApi } from './notificationsController';
export {
  useNotificationInbox,
  useBroadcastNotification,
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useDeleteAllNotifications,
  useDeleteNotification,
  // Admin-only
  useBroadcastHistory,
  useAdminDeleteBroadcast,
  useAdminDeleteAllBroadcasts,
} from './notificationsController';

