import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { ADMIN_PATHS, QUERY_KEYS } from '../constants/apiUrlConstant';

// ── API functions ─────────────────────────────────────────────────────────────
const dashboardApi = {
  getStats: (params) =>
    api.get(ADMIN_PATHS.DASHBOARD, { params }),

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
