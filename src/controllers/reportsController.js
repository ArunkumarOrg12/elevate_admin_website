import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { ADMIN_PATHS, QUERY_KEYS } from '../constants/apiUrlConstant';

// ── API functions ─────────────────────────────────────────────────────────────
const reportsApi = {
  getAll: (params) =>
    api.get(ADMIN_PATHS.REPORTS, { params }),

  generate: (data) =>
    api.post(ADMIN_PATHS.REPORTS, data),

  download: (id) =>
    api.get(`${ADMIN_PATHS.REPORTS}/${id}/download`, { responseType: 'blob' }),

  remove: (id) =>
    api.delete(`${ADMIN_PATHS.REPORTS}/${id}`),
};

// ── Hooks ─────────────────────────────────────────────────────────────────────
export function useReports(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.REPORTS, params],
    queryFn: () => reportsApi.getAll(params),
  });
}

export function useGenerateReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reportsApi.generate,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REPORTS }),
  });
}

export function useDeleteReport() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: reportsApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.REPORTS }),
  });
}

export default reportsApi;
