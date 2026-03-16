import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { ADMIN_PATHS, QUERY_KEYS } from '../constants/apiUrlConstant';

// ── API functions ─────────────────────────────────────────────────────────────
const riskMonitorApi = {
  getAll: (params) =>
    api.get(ADMIN_PATHS.RISK_MONITOR, { params }),

  getAlerts: (params) =>
    api.get(`${ADMIN_PATHS.RISK_MONITOR}/alerts`, { params }),

  getStudentsAtRisk: (params) =>
    api.get(`${ADMIN_PATHS.RISK_MONITOR}/students`, { params }),

  acknowledgeAlert: (id) =>
    api.patch(`${ADMIN_PATHS.RISK_MONITOR}/alerts/${id}/acknowledge`),
};

// ── Hooks ─────────────────────────────────────────────────────────────────────
export function useRiskMonitor(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.RISK_MONITOR, params],
    queryFn: () => riskMonitorApi.getAll(params),
  });
}

export function useRiskAlerts(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.RISK_MONITOR, 'alerts', params],
    queryFn: () => riskMonitorApi.getAlerts(params),
  });
}

export function useStudentsAtRisk(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.RISK_MONITOR, 'students', params],
    queryFn: () => riskMonitorApi.getStudentsAtRisk(params),
  });
}

export function useAcknowledgeAlert() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: riskMonitorApi.acknowledgeAlert,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.RISK_MONITOR }),
  });
}

export default riskMonitorApi;
