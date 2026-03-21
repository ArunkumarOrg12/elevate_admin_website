import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { ADMIN_PATHS, QUERY_KEYS } from '../constants/apiUrlConstant';

// ── API functions ─────────────────────────────────────────────────────────────
const dashboardApi = {
  getStats: async (params) => {
    const res = await api.get(`${ADMIN_PATHS.DASHBOARD}/stats`, { params });
    // Unwrap envelope ({ message, data: {...} }) if present
    const raw = res?.data ?? res;
    return {
      total_students:    raw.total_students    ?? 0,
      total_colleges:    raw.total_colleges    ?? 0,
      departments_count: raw.total_departments ?? raw.departments_count ?? 0,
      active_cycles:     raw.active_cycles     ?? 0,
      // Normalise field names expected by OverviewStats / QuickMetrics
      avg_ei_score:      raw.average_ei_score  ?? raw.avg_ei_score ?? 0,
      high_risk_count:   raw.high_risk_students ?? raw.high_risk_count ?? 0,
    };
  },

  getEITrends: (params) =>
    api.get(`${ADMIN_PATHS.DASHBOARD}/ei-trends`, { params }),

  getRiskDistribution: (params) =>
    api.get(`${ADMIN_PATHS.DASHBOARD}/risk-distribution`, { params }),

  getDepartmentComparison: (params) =>
    api.get(`${ADMIN_PATHS.DASHBOARD}/department-comparison`, { params }),

  getPlacementProgress: (params) =>
    api.get(`${ADMIN_PATHS.DASHBOARD}/placement-progress`, { params }),

  getTopPerformers: (params) =>
    api.get(`${ADMIN_PATHS.DASHBOARD}/top-performers`, { params }),

  getRecentActivity: (params) =>
    api.get(`${ADMIN_PATHS.DASHBOARD}/recent-activity`, { params }),
};

// ── Hooks ─────────────────────────────────────────────────────────────────────
export function useDashboardStats(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.DASHBOARD, 'stats', params],
    queryFn: () => dashboardApi.getStats(params),
  });
}

export function useEITrends(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.DASHBOARD, 'ei-trends', params],
    queryFn: () => dashboardApi.getEITrends(params),
  });
}

export function useRiskDistribution(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.DASHBOARD, 'risk-distribution', params],
    queryFn: () => dashboardApi.getRiskDistribution(params),
  });
}

export function useDepartmentComparison(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.DASHBOARD, 'department-comparison', params],
    queryFn: () => dashboardApi.getDepartmentComparison(params),
  });
}

export function usePlacementProgress(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.DASHBOARD, 'placement-progress', params],
    queryFn: () => dashboardApi.getPlacementProgress(params),
  });
}

export function useTopPerformers(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.DASHBOARD, 'top-performers', params],
    queryFn: () => dashboardApi.getTopPerformers(params),
  });
}

export function useRecentActivity(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.DASHBOARD, 'recent-activity', params],
    queryFn: () => dashboardApi.getRecentActivity(params),
  });
}

export default dashboardApi;
