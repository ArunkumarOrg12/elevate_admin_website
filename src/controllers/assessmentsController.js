import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { ADMIN_PATHS, QUERY_KEYS } from '../constants/apiUrlConstant';

// ── API functions ─────────────────────────────────────────────────────────────
const assessmentsApi = {
  getAll: (params) =>
    api.get(ADMIN_PATHS.ASSESSMENTS, { params }),

  getById: (id) =>
    api.get(`${ADMIN_PATHS.ASSESSMENTS}/${id}`),

  create: (data) =>
    api.post(ADMIN_PATHS.ASSESSMENTS, data),

  update: (id, data) =>
    api.put(`${ADMIN_PATHS.ASSESSMENTS}/${id}`, data),

  remove: (id) =>
    api.delete(`${ADMIN_PATHS.ASSESSMENTS}/${id}`),

  getResults: (id, params) =>
    api.get(`${ADMIN_PATHS.ASSESSMENTS}/${id}/results`, { params }),
};

// ── Hooks ─────────────────────────────────────────────────────────────────────
export function useAssessments(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ASSESSMENTS, params],
    queryFn: () => assessmentsApi.getAll(params),
  });
}

export function useAssessment(id) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ASSESSMENTS, id],
    queryFn: () => assessmentsApi.getById(id),
    enabled: !!id,
  });
}

export function useAssessmentResults(id, params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.ASSESSMENTS, id, 'results', params],
    queryFn: () => assessmentsApi.getResults(id, params),
    enabled: !!id,
  });
}

export function useCreateAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assessmentsApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ASSESSMENTS }),
  });
}

export function useUpdateAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => assessmentsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ASSESSMENTS });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.ASSESSMENTS, id] });
    },
  });
}

export function useDeleteAssessment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: assessmentsApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.ASSESSMENTS }),
  });
}

export default assessmentsApi;
