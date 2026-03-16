import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { ADMIN_PATHS, QUERY_KEYS } from '../constants/apiUrlConstant';

// ── API functions ─────────────────────────────────────────────────────────────
const analyticsApi = {
  getOverview: (params) =>
    api.get(ADMIN_PATHS.ANALYTICS, { params }),

  getEITrends: (params) =>
    api.get(`${ADMIN_PATHS.ANALYTICS}/ei-trends`, { params }),

  getDepartmentComparison: (params) =>
    api.get(`${ADMIN_PATHS.ANALYTICS}/department-comparison`, { params }),

  getPlacementStats: (params) =>
    api.get(`${ADMIN_PATHS.ANALYTICS}/placement`, { params }),

  getSkillsBreakdown: (params) =>
    api.get(`${ADMIN_PATHS.ANALYTICS}/skills`, { params }),
};

// ── Hooks ─────────────────────────────────────────────────────────────────────
export function useAnalyticsOverview(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ANALYTICS, 'overview', params],
    queryFn: () => analyticsApi.getOverview(params),
  });
}

export function useAnalyticsEITrends(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ANALYTICS, 'ei-trends', params],
    queryFn: () => analyticsApi.getEITrends(params),
  });
}

export function useAnalyticsDepartmentComparison(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ANALYTICS, 'department-comparison', params],
    queryFn: () => analyticsApi.getDepartmentComparison(params),
  });
}

export function useAnalyticsPlacementStats(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ANALYTICS, 'placement', params],
    queryFn: () => analyticsApi.getPlacementStats(params),
  });
}

export function useAnalyticsSkillsBreakdown(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ANALYTICS, 'skills', params],
    queryFn: () => analyticsApi.getSkillsBreakdown(params),
  });
}

export default analyticsApi;
