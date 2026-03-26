import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import { ADMIN_PATHS, QUERY_KEYS } from '../constants/apiUrlConstant';

// ── API functions ─────────────────────────────────────────────────────────────
const collegesApi = {
  getAll: (params) =>
    api.get(ADMIN_PATHS.COLLEGES, { params }),

  getById: (id) =>
    api.get(`${ADMIN_PATHS.COLLEGES}/${id}`),

  create: (data) =>
    api.post(ADMIN_PATHS.COLLEGES, data),

  update: (id, data) =>
     api.patch(`${ADMIN_PATHS.COLLEGES}/${id}`, data),

  remove: (id) =>
    api.delete(`${ADMIN_PATHS.COLLEGES}/${id}`),

  getDepartments: (id, params) =>
    api.get(`${ADMIN_PATHS.COLLEGES}/${id}/departments`, { params }),

  getAdmins: (id) =>
    api.get(`${ADMIN_PATHS.COLLEGES}/${id}/admins`),
};

// ── Hooks ─────────────────────────────────────────────────────────────────────
export function useColleges(params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.COLLEGES, params],
    queryFn: () => collegesApi.getAll(params),
    select: (res) => {
      if (Array.isArray(res)) return res;
      if (Array.isArray(res?.colleges)) return res.colleges;
      if (Array.isArray(res?.data?.colleges)) return res.data.colleges;
      if (Array.isArray(res?.data)) return res.data;
      return [];
    },
  });
}

export function useCollege(id) {
  return useQuery({
    queryKey: [...QUERY_KEYS.COLLEGES, id],
    queryFn: () => collegesApi.getById(id),
    enabled: !!id,
  });
}

export function useCollegeDepartments(id, params) {
  return useQuery({
    queryKey: [...QUERY_KEYS.COLLEGES, id, 'departments', params],
    queryFn: () => collegesApi.getDepartments(id, params),
    enabled: !!id,
  });
}

export function useCollegeAdmins(id) {
  return useQuery({
    queryKey: [...QUERY_KEYS.COLLEGES, id, 'admins'],
    queryFn: () => collegesApi.getAdmins(id),
    enabled: !!id,
  });
}

export function useCreateCollege() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: collegesApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COLLEGES }),
  });
}

export function useUpdateCollege() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }) => collegesApi.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COLLEGES });
      queryClient.invalidateQueries({ queryKey: [...QUERY_KEYS.COLLEGES, id] });
    },
  });
}

export function useDeleteCollege() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: collegesApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: QUERY_KEYS.COLLEGES }),
  });
}

export default collegesApi;
