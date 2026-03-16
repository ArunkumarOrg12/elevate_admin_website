import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { ADMIN_PATHS, QUERY_KEYS } from '../constants/apiUrlConstant';

// ── API functions ─────────────────────────────────────────────────────────────
const studentsApi = {
  getAll: (params) =>
    api.get(ADMIN_PATHS.STUDENTS, { params }),

  getById: (id) =>
    api.get(`${ADMIN_PATHS.STUDENTS}/${id}`),

  create: (data) =>
    api.post(ADMIN_PATHS.STUDENTS, data),

  update: (id, data) =>
    api.put(`${ADMIN_PATHS.STUDENTS}/${id}`, data),

  remove: (id) =>
    api.delete(`${ADMIN_PATHS.STUDENTS}/${id}`),

  getEIHistory: (id, params) =>
    api.get(`${ADMIN_PATHS.STUDENTS}/${id}/ei-history`, { params }),
};

// ── Hooks ─────────────────────────────────────────────────────────────────────
export function useStudents(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.STUDENTS, params],
    queryFn: () => studentsApi.getAll(params),
  });
}

export function useStudent(id) {
  return useQuery({
    queryKey: [...QUERY_KEYS.STUDENTS, id],
    queryFn: () => studentsApi.getById(id),
    enabled: !!id,
  });
}

export function useStudentEIHistory(id, params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.STUDENTS, id, 'ei-history', params],
    queryFn: () => studentsApi.getEIHistory(id, params),
    enabled: !!id,
  });
}

export function useCreateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: studentsApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STUDENTS }),
  });
}

export function useUpdateStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => studentsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STUDENTS });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.STUDENTS, id] });
    },
  });
}

export function useDeleteStudent() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: studentsApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.STUDENTS }),
  });
}

export default studentsApi;
