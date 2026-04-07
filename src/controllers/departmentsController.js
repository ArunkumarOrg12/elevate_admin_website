import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { ADMIN_PATHS, QUERY_KEYS } from '../constants/apiUrlConstant';

// ── API functions ─────────────────────────────────────────────────────────────
const departmentsApi = {
  getAll: (params) =>
    api.get(ADMIN_PATHS.DEPARTMENTS, { params }),

  getById: (id) =>
    api.get(`${ADMIN_PATHS.DEPARTMENTS}/${id}`),

  create: (data) =>
    api.post(ADMIN_PATHS.DEPARTMENTS, data),

  update: (id, data) =>
    api.put(`${ADMIN_PATHS.DEPARTMENTS}/${id}`, data),

  remove: (id) =>
    api.delete(`${ADMIN_PATHS.DEPARTMENTS}/${id}`),

  getStudents: (id, params) =>
    api.get(`${ADMIN_PATHS.DEPARTMENTS}/${id}/students`, { params }),
};

// ── Hooks ─────────────────────────────────────────────────────────────────────
// departmentController.js
export function useDepartments(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.DEPARTMENTS, params],
    queryFn: async () => {
      const res = await departmentsApi.getAll({ limit: 100, ...params });
      return res?.departments ?? res?.data?.departments ?? [];
    },
  });
}

export function useDepartment(id) {
  return useQuery({
    queryKey: [...QUERY_KEYS.DEPARTMENTS, id],
    queryFn: () => departmentsApi.getById(id),
    enabled: !!id,
  });
}

export function useDepartmentStudents(id, params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.DEPARTMENTS, id, 'students', params],
    queryFn: () => departmentsApi.getStudents(id, params),
    enabled: !!id,
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: departmentsApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEPARTMENTS }),
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => departmentsApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEPARTMENTS });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.DEPARTMENTS, id] });
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: departmentsApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.DEPARTMENTS }),
  });
}

export default departmentsApi;
